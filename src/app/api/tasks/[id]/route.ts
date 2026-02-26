import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.title !== undefined) data.title = (body.title as string).slice(0, 200);
    if (body.details !== undefined) data.details = body.details;
    if (body.priority !== undefined) data.priority = Math.min(5, Math.max(1, Number(body.priority)));
    if (body.estimateMinutes !== undefined) data.estimateMinutes = Math.max(5, Math.min(480, Number(body.estimateMinutes)));
    if (body.dueDate !== undefined) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    if (body.projectId !== undefined) data.projectId = body.projectId || null;

    const task = await prisma.task.update({
      where: { id },
      data,
      include: {
        project: { select: { id: true, name: true, color: true } },
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
