import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { query } from "./db";

const COOKIE = "session";
const ADMIN_COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const value = process.env.AUTH_SECRET || "dev-only-insecure-secret-change-me";
  return new TextEncoder().encode(value);
}

export async function signSession(userId) {
  return new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function setSessionCookie(userId) {
  const token = await signSession(userId);
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

/** Returns the logged-in user row, or null. */
export async function getSessionUser() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const { rows } = await query(
      `SELECT id, name, email, phone FROM users WHERE id = $1`,
      [payload.uid]
    );
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function setAdminCookie() {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export function clearAdminCookie() {
  cookies().set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function isAdmin() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.admin === true;
  } catch {
    return false;
  }
}
