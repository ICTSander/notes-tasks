import { NextRequest, NextResponse } from "next/server";
import { rewriteNote, detectProvider } from "@/lib/llm/provider";
import type { RewriteRequest, RewriteResponse } from "@/lib/types";

export async function GET() {
  const provider = detectProvider(false);
  return NextResponse.json({
    provider,
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: RewriteRequest = await req.json();

    if (!body.text || typeof body.text !== "string" || body.text.trim().length === 0) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const mockHeader = req.headers.get("x-mock-ai");
    const forceMock = mockHeader === "true";

    const tasks = await rewriteNote(body.text, body.projectName, forceMock);

    // Validate server-side
    const validated = tasks.map((t) => ({
      title: t.title.slice(0, 200),
      details: t.details?.slice(0, 500),
      priority: Math.min(5, Math.max(1, t.priority ?? 3)),
      estimateMinutes: Math.max(5, Math.min(480, t.estimateMinutes ?? 30)),
      dueDate: t.dueDate ?? null,
    }));

    const provider = detectProvider(forceMock);
    const response: RewriteResponse = { tasks: validated };
    return NextResponse.json({ ...response, provider });
  } catch (error) {
    console.error("Rewrite error:", error);
    return NextResponse.json(
      { error: "Failed to rewrite note" },
      { status: 500 }
    );
  }
}
