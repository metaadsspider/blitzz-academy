import { NextResponse } from "next/server";
import { setAdminCookie, clearAdminCookie } from "@/lib/auth";

export async function POST(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set in the environment." },
      { status: 500 }
    );
  }

  let password = "";
  const type = req.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    password = String(body.password || "");
  } else {
    const form = await req.formData();
    password = String(form.get("password") || "");
  }

  if (password !== expected) {
    return NextResponse.redirect(new URL("/admin?error=1", req.url), { status: 303 });
  }

  await setAdminCookie();
  return NextResponse.redirect(new URL("/admin", req.url), { status: 303 });
}

export async function DELETE() {
  clearAdminCookie();
  return NextResponse.json({ ok: true });
}
