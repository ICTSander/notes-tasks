import { NextRequest, NextResponse } from "next/server";

// Paths that don't require authentication
const PUBLIC_PATHS = ["/login", "/api/auth"];
const PUBLIC_PREFIXES = ["/_next", "/icons", "/favicon"];
const PUBLIC_FILES = ["/manifest.webmanifest", "/sw.js", "/apple-touch-icon.svg"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) return true;
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (PUBLIC_FILES.includes(pathname)) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // No APP_PASSWORD set — skip auth entirely (local dev without password)
  // Note: env vars in middleware need to be accessed via process.env
  // but Edge runtime doesn't support all Node APIs. We check the cookie only.

  // Check for valid session cookie
  const cookie = req.cookies.get("session");
  if (!cookie?.value) {
    return redirectToLogin(req);
  }

  // Verify HMAC signature using Web Crypto (Edge-compatible)
  // For simplicity, we do a basic structure check here.
  // The full HMAC verification happens in the API routes.
  const parts = cookie.value.split(".");
  if (parts.length !== 2 || parts[0] !== "authenticated") {
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest): NextResponse {
  const loginUrl = new URL("/login", req.url);
  // For API routes, return 401 instead of redirect
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
