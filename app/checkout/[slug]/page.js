import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCourseBySlug, isEnrolled } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import CheckoutFlow from "@/components/CheckoutFlow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout — Blitzz Academy" };

export default async function CheckoutPage({ params }) {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/checkout/${params.slug}`);

  let course = null;
  try {
    course = await getCourseBySlug(params.slug);
  } catch {
    course = null;
  }
  if (!course) notFound();

  const owned = await isEnrolled(user.id, course.id);
  if (owned) redirect(`/learn/${course.slug}`);

  return (
    <div className="wrap">
      <div className="dash-head">
        <p className="eyebrow">
          <Link href={`/courses/${course.slug}`}>← Back to course</Link>
        </p>
        <h1>Checkout</h1>
        <p>Pay by UPI, then confirm with your UTR to unlock the course.</p>
      </div>

      <CheckoutFlow
        slug={course.slug}
        title={course.title}
        amount={course.price_inr}
        user={{ name: user.name, email: user.email, phone: user.phone }}
      />
    </div>
  );
}
