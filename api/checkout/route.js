import { NextResponse } from "next/server";
import { query, getCourseBySlug, isEnrolled } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { buildUpiLink, upiQrDataUrl } from "@/lib/upi";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }

    const body = await req.json();
    const slug = String(body.slug || "");
    const course = await getCourseBySlug(slug);
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    if (await isEnrolled(user.id, course.id)) {
      return NextResponse.json(
        { error: "You already own this course.", slug: course.slug, alreadyOwned: true },
        { status: 409 }
      );
    }

    // Reuse an open order for this user and course so the reference stays stable.
    const existing = await query(
      `SELECT id, amount FROM orders
        WHERE user_id = $1 AND course_id = $2 AND status = 'pending'
        ORDER BY id DESC LIMIT 1`,
      [user.id, course.id]
    );

    let orderId;
    let amount;
    if (existing.rows.length > 0) {
      orderId = existing.rows[0].id;
      amount = course.price_inr;
      if (Number(existing.rows[0].amount) !== amount) {
        await query(`UPDATE orders SET amount = $1 WHERE id = $2`, [amount, orderId]);
      }
    } else {
      const inserted = await query(
        `INSERT INTO orders (user_id, course_id, amount, name, email, phone, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending')
         RETURNING id`,
        [user.id, course.id, course.price_inr, user.name, user.email, user.phone]
      );
      orderId = inserted.rows[0].id;
      amount = course.price_inr;
    }

    const upiLink = buildUpiLink({
      amount,
      note: `${course.title} #${orderId}`,
      txnRef: `ORD${orderId}`,
    });
    const qr = await upiQrDataUrl(upiLink);

    return NextResponse.json({
      orderId,
      amount,
      upiLink,
      qr,
      upiId: process.env.UPI_ID || "yourname@upi",
      payeeName: process.env.UPI_NAME || "Course Payment",
    });
  } catch (err) {
    console.error("checkout failed", err);
    return NextResponse.json(
      { error: "Could not start checkout. " + (err.message || "") },
      { status: 500 }
    );
  }
}
