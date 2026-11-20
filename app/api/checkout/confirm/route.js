import { NextResponse } from "next/server";
import { transaction } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { cleanUtr, isValidUtr } from "@/lib/upi";

export const dynamic = "force-dynamic";

/**
 * Records the UTR and grants access immediately.
 *
 * As specified for this build, the payment is NOT verified against the bank
 * before access is given. The UTR is stored on the order so you can reconcile
 * later from /admin. See README -> "Payment risk" before going live.
 */
export async function POST(req) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }

    const body = await req.json();
    const orderId = Number(body.orderId);
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").replace(/[^\d+]/g, "");
    const utr = cleanUtr(body.utr);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json({ error: "Invalid order." }, { status: 400 });
    }
    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (!isValidUtr(utr)) {
      return NextResponse.json(
        { error: "That UTR does not look right. It should be 8 to 22 letters or digits." },
        { status: 400 }
      );
    }

    const result = await transaction(async (client) => {
      const { rows } = await client.query(
        `SELECT o.id, o.user_id, o.course_id, o.status, c.slug
           FROM orders o JOIN courses c ON c.id = o.course_id
          WHERE o.id = $1 FOR UPDATE`,
        [orderId]
      );
      const order = rows[0];
      if (!order) return { error: "Order not found.", status: 404 };
      if (order.user_id !== user.id) return { error: "This order is not yours.", status: 403 };

      if (order.status !== "paid") {
        await client.query(
          `UPDATE orders
              SET name = $1, email = $2, phone = $3, utr = $4,
                  status = 'paid', confirmed_at = now()
            WHERE id = $5`,
          [name, email, phone, utr, orderId]
        );
      }

      await client.query(
        `INSERT INTO enrollments (user_id, course_id, order_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, course_id) DO NOTHING`,
        [user.id, order.course_id, orderId]
      );

      return { slug: order.slug };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true, slug: result.slug });
  } catch (err) {
    console.error("confirm failed", err);
    return NextResponse.json(
      { error: "Could not confirm the payment. " + (err.message || "") },
      { status: 500 }
    );
  }
}
