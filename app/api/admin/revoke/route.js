import { NextResponse } from "next/server";
import { transaction } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function POST(req) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const body = await req.json();
  const orderId = Number(body.orderId);
  if (!Number.isInteger(orderId)) {
    return NextResponse.json({ error: "Invalid order." }, { status: 400 });
  }

  await transaction(async (client) => {
    const { rows } = await client.query(
      `UPDATE orders SET status = 'revoked' WHERE id = $1 RETURNING user_id, course_id`,
      [orderId]
    );
    if (rows[0]) {
      await client.query(
        `DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2 AND order_id = $3`,
        [rows[0].user_id, rows[0].course_id, orderId]
      );
    }
  });

  return NextResponse.json({ ok: true });
}
