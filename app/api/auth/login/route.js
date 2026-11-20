import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
    }

    const { rows } = await query(
      `SELECT id, name, email, phone, password_hash FROM users WHERE email = $1`,
      [email]
    );
    const user = rows[0];
    const ok = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!ok) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    await setSessionCookie(user.id);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error("login failed", err);
    return NextResponse.json(
      { error: "Could not log you in. " + (err.message || "") },
      { status: 500 }
    );
  }
}
