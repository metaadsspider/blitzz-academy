import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { validateCourse } from "@/lib/validate-course";

export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { error, values } = validateCourse(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const { rows } = await query(
      `INSERT INTO courses
         (slug, title, subtitle, description, price_inr, list_price_inr,
          level, duration, lessons, accent, icon, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12)
       RETURNING id`,
      [
        values.slug,
        values.title,
        values.subtitle,
        values.description,
        values.price_inr,
        values.list_price_inr,
        values.level,
        values.duration,
        JSON.stringify(values.lessons),
        values.accent,
        values.icon,
        values.sort_order,
      ]
    );
    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (err) {
    if (err && err.code === "23505") {
      return NextResponse.json(
        { error: "A course with that slug already exists. Pick another." },
        { status: 409 }
      );
    }
    console.error("create course failed", err);
    return NextResponse.json(
      { error: "Could not create the course. " + (err.message || "") },
      { status: 500 }
    );
  }
}
