import Anthropic from "@anthropic-ai/sdk";
import type { SuggestedTask } from "@/lib/types";
import { mockRewrite } from "./mock";

const SYSTEM_PROMPT = `You are a task extraction assistant. Given raw text (quick notes), convert them into clear, actionable tasks.

Rules:
- Start each task title with a verb (Call, Send, Plan, Review, etc.)
- Return 1-6 tasks max
- Keep titles short (under 80 chars)
- Set priority 1-5 (5 = most urgent)
- Estimate minutes realistically
- Detect deadlines from the text (today, tomorrow, specific dates)
- Return valid JSON only, no markdown fences

Output format (JSON array):
[
  {
    "title": "string",
    "details": "string or null",
    "priority": number,
    "estimateMinutes": number,
    "dueDate": "ISO string or null"
  }
]`;

function buildUserPrompt(text: string, projectName?: string): string {
  let prompt = `Convert this note into actionable tasks:\n\n"${text}"`;
  if (projectName) prompt += `\n\nProject context: ${projectName}`;
  return prompt;
}

function parseAiResponse(raw: string): SuggestedTask[] {
  // Strip markdown code fences if present
  const cleaned = raw.replace(/```(?:json)?\s*/g, "").replace(/```/g, "");
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed.slice(0, 6).map((item: Record<string, unknown>) => ({
      title: typeof item.title === "string" ? item.title : "Untitled task",
      details: typeof item.details === "string" ? item.details : undefined,
      priority: typeof item.priority === "number"
        ? Math.min(5, Math.max(1, Math.round(item.priority)))
        : 3,
      estimateMinutes: typeof item.estimateMinutes === "number"
        ? Math.max(5, Math.min(480, Math.round(item.estimateMinutes)))
        : 30,
      dueDate: typeof item.dueDate === "string" ? item.dueDate : null,
    }));
  } catch {
    return [];
  }
}

async function callAnthropic(text: string, projectName?: string): Promise<SuggestedTask[]> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env automatically

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      { role: "user", content: buildUserPrompt(text, projectName) },
    ],
  });

  const block = message.content[0];
  const content = block.type === "text" ? block.text : "";
  return parseAiResponse(content);
}

async function callOpenAI(text: string, projectName?: string): Promise<SuggestedTask[]> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(text, projectName) },
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  return parseAiResponse(content);
}

export type Provider = "mock" | "anthropic" | "openai";

export function detectProvider(forceMock?: boolean): Provider {
  if (forceMock) return "mock";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "mock";
}

export async function rewriteNote(
  text: string,
  projectName?: string,
  forceMock?: boolean
): Promise<SuggestedTask[]> {
  const provider = detectProvider(forceMock);

  try {
    switch (provider) {
      case "anthropic":
        return await callAnthropic(text, projectName);
      case "openai":
        return await callOpenAI(text, projectName);
      case "mock":
      default:
        return mockRewrite(text);
    }
  } catch (error) {
    console.error(`[${provider}] rewrite failed, falling back to mock:`, error);
    return mockRewrite(text);
  }
}
