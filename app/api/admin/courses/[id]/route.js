import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { validateCourse } from "@/lib/validate-course";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid course." }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { error, values } = validateCourse(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const { rows } = await query(
      `UPDATE courses SET
         slug = $1, title = $2, subtitle = $3, description = $4,
         price_inr = $5, list_price_inr = $6, level = $7, duration = $8,
         lessons = $9::jsonb, accent = $10, icon = $11, sort_order = $12
       WHERE id = $13
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
        id,
      ]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    if (err && err.code === "23505") {
      return NextResponse.json(
        { error: "Another course already uses that slug." },
        { status: 409 }
      );
    }
    console.error("update course failed", err);
    return NextResponse.json(
      { error: "Could not save the course. " + (err.message || "") },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid course." }, { status: 400 });
  }

  try {
    const { rows } = await query(
      `SELECT count(*)::int AS n FROM orders WHERE course_id = $1`,
      [id]
    );
    if (rows[0].n > 0) {
      return NextResponse.json(
        {
          error:
            "This course has orders against it, so it cannot be deleted. Change its price or details instead — deleting would erase your sales records.",
        },
        { status: 409 }
      );
    }
    const del = await query(`DELETE FROM courses WHERE id = $1 RETURNING id`, [id]);
    if (del.rows.length === 0) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("delete course failed", err);
    return NextResponse.json(
      { error: "Could not delete the course. " + (err.message || "") },
      { status: 500 }
    );
  }
}
