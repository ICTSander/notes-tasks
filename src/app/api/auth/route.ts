import { NextRequest, NextResponse } from "next/server";
import { buildSessionCookie, hasValidSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = body.password;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const appPassword = process.env.APP_PASSWORD;
    if (!appPassword) {
      // No password configured — allow access (dev mode)
      const res = NextResponse.json({ ok: true });
      res.headers.set("Set-Cookie", buildSessionCookie());
      return res;
    }

    if (password !== appPassword) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.headers.set("Set-Cookie", buildSessionCookie());
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const valid = hasValidSession(req.headers.get("cookie"));
  return NextResponse.json({ authenticated: valid });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  return res;
}
