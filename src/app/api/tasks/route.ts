import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "OPEN";
  const projectIds = searchParams.get("projectIds")?.split(",").filter(Boolean);
  const search = searchParams.get("search");

  const tasks = await prisma.task.findMany({
    where: {
      ...(status !== "ALL" && { status }),
      ...(projectIds && projectIds.length > 0 && { projectId: { in: projectIds } }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { details: { contains: search } },
        ],
      }),
    },
    include: {
      project: { select: { id: true, name: true, color: true } },
    },
    orderBy: [
      { priority: "desc" },
      { dueDate: "asc" },
      { createdAt: "desc" },
    ],
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.tasks || !Array.isArray(body.tasks)) {
      return NextResponse.json({ error: "tasks array is required" }, { status: 400 });
    }

    const created = await prisma.task.createMany({
      data: body.tasks.map((t: Record<string, unknown>) => ({
        title: (t.title as string).slice(0, 200),
        details: typeof t.details === "string" ? t.details.slice(0, 500) : null,
        projectId: (t.projectId as string) || null,
        sourceNoteId: (t.sourceNoteId as string) || null,
        priority: Math.min(5, Math.max(1, Number(t.priority) || 3)),
        estimateMinutes: Math.max(5, Math.min(480, Number(t.estimateMinutes) || 30)),
        dueDate: t.dueDate ? new Date(t.dueDate as string) : null,
        status: "OPEN",
      })),
    });

    return NextResponse.json({ count: created.count }, { status: 201 });
  } catch (error) {
    console.error("Create tasks error:", error);
    return NextResponse.json({ error: "Failed to create tasks" }, { status: 500 });
  }
}
