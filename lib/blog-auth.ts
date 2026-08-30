import "server-only";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "sks-blog-session";
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  return process.env.BLOG_SESSION_SECRET;
}

function sign(value: string) {
  const key = secret();
  if (!key) throw new Error("BLOG_SESSION_SECRET is not configured.");
  return createHmac("sha256", key).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function isConfigured() {
  return Boolean(
    process.env.BLOG_AUTHOR_USERNAME &&
      process.env.BLOG_AUTHOR_PASSWORD &&
      process.env.BLOG_SESSION_SECRET
  );
}

export function isAuthenticated() {
  const value = cookies().then((store) => store.get(COOKIE_NAME)?.value);
  return value.then((session) => {
    if (!session) return false;
    const [username, expires, signature] = session.split(".");
    if (!username || !expires || !signature || Number(expires) < Date.now()) {
      return false;
    }
    const expected = sign(`${username}.${expires}`);
    return safeEqual(signature, expected) && safeEqual(
      username,
      process.env.BLOG_AUTHOR_USERNAME ?? ""
    );
  });
}

export async function authenticate(username: string, password: string) {
  if (!isConfigured()) return false;
  const expectedUsername = process.env.BLOG_AUTHOR_USERNAME ?? "";
  const expectedPassword = process.env.BLOG_AUTHOR_PASSWORD ?? "";
  const usernameOk = safeEqual(username, expectedUsername);
  const passwordOk = safeEqual(password, expectedPassword);
  if (!usernameOk || !passwordOk) return false;

  const expires = Date.now() + MAX_AGE * 1000;
  const value = `${username}.${expires}`;
  (await cookies()).set(COOKIE_NAME, `${value}.${sign(value)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return true;
}

export async function clearSession() {
  (await cookies()).delete(COOKIE_NAME);
}
