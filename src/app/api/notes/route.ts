import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.rawText || typeof body.rawText !== "string") {
      return NextResponse.json({ error: "rawText is required" }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        rawText: body.rawText.trim(),
        projectId: body.projectId || null,
      },
    });
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
