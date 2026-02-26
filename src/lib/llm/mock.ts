import type { SuggestedTask } from "@/lib/types";

const URGENCY_WORDS: Record<string, number> = {
  urgent: 5,
  asap: 5,
  immediately: 5,
  critical: 5,
  today: 4,
  tonight: 4,
  tomorrow: 4,
  soon: 3,
  "this week": 3,
  important: 4,
};

function detectPriority(text: string): number {
  const lower = text.toLowerCase();
  for (const [word, priority] of Object.entries(URGENCY_WORDS)) {
    if (lower.includes(word)) return priority;
  }
  return 3;
}

function detectDueDate(text: string): string | null {
  const lower = text.toLowerCase();
  const now = new Date();

  if (lower.includes("today") || lower.includes("tonight")) {
    now.setHours(23, 59, 0, 0);
    return now.toISOString();
  }
  if (lower.includes("tomorrow")) {
    now.setDate(now.getDate() + 1);
    now.setHours(23, 59, 0, 0);
    return now.toISOString();
  }
  if (lower.includes("this week")) {
    const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7;
    now.setDate(now.getDate() + daysUntilFriday);
    now.setHours(23, 59, 0, 0);
    return now.toISOString();
  }
  if (lower.includes("next week")) {
    now.setDate(now.getDate() + 7);
    now.setHours(23, 59, 0, 0);
    return now.toISOString();
  }
  return null;
}

function estimateMinutes(text: string): number {
  const lower = text.toLowerCase();
  if (lower.includes("quick") || lower.includes("brief")) return 10;
  if (lower.includes("meeting") || lower.includes("call")) return 30;
  if (lower.includes("report") || lower.includes("write") || lower.includes("draft")) return 60;
  if (lower.includes("review") || lower.includes("read")) return 20;
  return 30;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const VERB_STARTERS = [
  "call", "send", "email", "write", "review", "check", "buy",
  "schedule", "plan", "prepare", "create", "fix", "update",
  "organize", "clean", "book", "cancel", "confirm", "meet",
  "read", "research", "discuss", "finish", "complete", "submit",
  "set up", "follow up", "reach out", "look into",
];

function startsWithVerb(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return VERB_STARTERS.some((v) => lower.startsWith(v));
}

function stripPrefix(text: string): string {
  return text.replace(
    /^(i\s+)?(need\s+to|have\s+to|should|must|gotta|gonna|want\s+to|got\s+to)\s+/i,
    ""
  );
}

function makeActionable(text: string): string {
  const trimmed = stripPrefix(text.trim());
  if (startsWithVerb(trimmed)) return capitalize(trimmed);

  const lower = trimmed.toLowerCase();
  if (lower.includes("meeting") || lower.includes("appointment"))
    return `Schedule ${lower}`;
  if (lower.includes("email") || lower.includes("message"))
    return `Send ${lower}`;
  if (lower.includes("groceries") || lower.includes("supplies"))
    return `Buy ${lower}`;

  return `Handle ${lower}`;
}

export function mockRewrite(text: string): SuggestedTask[] {
  // Split by common delimiters: periods, semicolons, newlines, "also", "and" (between clauses)
  const parts = text
    .split(/[.;\n]+|(?:,?\s+(?:also|and also|and then)\s+)|(?:,\s+and\s+)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);

  // If no clear split, treat as one task
  const items = parts.length > 0 ? parts : [text.trim()];

  return items.slice(0, 6).map((item) => ({
    title: makeActionable(item),
    priority: detectPriority(item),
    estimateMinutes: estimateMinutes(item),
    dueDate: detectDueDate(item),
  }));
}
