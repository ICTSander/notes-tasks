import { createHmac } from "crypto";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return process.env.AUTH_SECRET || "fallback-dev-secret";
}

/** Create an HMAC-signed session value */
export function signSession(value: string): string {
  const hmac = createHmac("sha256", getSecret()).update(value).digest("hex");
  return `${value}.${hmac}`;
}

/** Verify an HMAC-signed session value. Returns the original value or null. */
export function verifySession(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const expected = signSession(value);
  if (signed !== expected) return null;
  return value;
}

/** Build a Set-Cookie header string */
export function buildSessionCookie(): string {
  const signed = signSession("authenticated");
  return `${COOKIE_NAME}=${signed}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

/** Check if a cookie header string contains a valid session */
export function hasValidSession(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  if (!match) return false;
  return verifySession(match[1]) === "authenticated";
}

export { COOKIE_NAME, MAX_AGE };
