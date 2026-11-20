import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").replace(/[^\d+]/g, "");
    const password = String(body.password || "");

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      return NextResponse.json(
        { error: "Please enter a valid phone number (10 to 15 digits)." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    let rows;
    try {
      ({ rows } = await query(
        `INSERT INTO users (name, email, phone, password_hash)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, phone`,
        [name, email, phone, hash]
      ));
    } catch (err) {
      if (err && err.code === "23505") {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in instead." },
          { status: 409 }
        );
      }
      throw err;
    }

    await setSessionCookie(rows[0].id);
    return NextResponse.json({ user: rows[0] });
  } catch (err) {
    console.error("register failed", err);
    return NextResponse.json(
      { error: "Could not create the account. " + (err.message || "") },
      { status: 500 }
    );
  }
}
