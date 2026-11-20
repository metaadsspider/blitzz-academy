import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug, isEnrolled } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { CURRENCY } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  try {
    const course = await getCourseBySlug(params.slug);
    if (!course) return { title: "Course not found" };
    return { title: `${course.title} — Blitzz Academy`, description: course.subtitle };
  } catch {
    return { title: "Course — Blitzz Academy" };
  }
}

export default async function CourseDetailPage({ params }) {
  let course = null;
  try {
    course = await getCourseBySlug(params.slug);
  } catch {
    course = null;
  }
  if (!course) notFound();

  const user = await getSessionUser().catch(() => null);
  const owned = user ? await isEnrolled(user.id, course.id) : false;
  const save = course.list_price_inr - course.price_inr;

  return (
    <div className="wrap">
      <div className="detail-grid">
        <div className="detail">
          <p className="eyebrow">{course.level}</p>
          <h1>{course.title}</h1>
          <p className="lead">{course.subtitle}</p>

          <div className="meta-row">
            <span>{course.duration}</span>
            <span>{course.lessons.length} lessons</span>
            <span>Lifetime access</span>
            <span>Certificate on completion</span>
          </div>

          <h2>About this course</h2>
          <p>{course.description}</p>

          <h2 style={{ marginTop: 32 }}>Course content</h2>
          <ul className="lesson-list">
            {course.lessons.map((lesson, i) => (
              <li key={i}>
                <span className="lesson-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{lesson.title}</strong>
                  <small>{lesson.duration}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="buy-box">
          <div className="price">
            <strong>
              {CURRENCY}
              {course.price_inr.toLocaleString("en-IN")}
            </strong>
            {course.list_price_inr > course.price_inr && (
              <span className="was">
                {CURRENCY}
                {course.list_price_inr.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {save > 0 && (
            <p className="save">
              You save {CURRENCY}
              {save.toLocaleString("en-IN")} today
            </p>
          )}

          {owned ? (
            <Link href={`/learn/${course.slug}`} className="btn btn-primary btn-block">
              Go to course
            </Link>
          ) : (
            <Link
              href={user ? `/checkout/${course.slug}` : `/register?next=/checkout/${course.slug}`}
              className="btn btn-gold btn-block"
            >
              Buy now
            </Link>
          )}

          <ul className="buy-list">
            <li>Pay by UPI, any app</li>
            <li>Course unlocks the moment you confirm</li>
            <li>All {course.lessons.length} lessons included</li>
            <li>Lifetime access, no renewal</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
