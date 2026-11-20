import Link from "next/link";
import { CURRENCY } from "@/lib/site";

export default function CourseCard({ course, enrolled }) {
  const off =
    course.list_price_inr > course.price_inr
      ? Math.round(
          ((course.list_price_inr - course.price_inr) / course.list_price_inr) * 100
        )
      : 0;

  return (
    <article className="course-card">
      <div className="course-bar" style={{ background: course.accent }} />
      <div className="course-body">
        <div className="course-top">
          <span className="course-level">{course.level}</span>
          {off > 0 && <span className="course-off">{off}% off</span>}
        </div>
        <h3>
          <Link href={`/courses/${course.slug}`}>{course.title}</Link>
        </h3>
        <p className="course-sub">{course.subtitle}</p>
        <p className="course-meta">
          {course.duration} · {course.lessons.length} lessons
        </p>

        <div className="course-foot">
          <div className="price">
            <strong>
              {CURRENCY}
              {course.price_inr.toLocaleString("en-IN")}
            </strong>
            {course.list_price_inr > course.price_inr && (
              <s>
                {CURRENCY}
                {course.list_price_inr.toLocaleString("en-IN")}
              </s>
            )}
          </div>
          {enrolled ? (
            <Link href={`/learn/${course.slug}`} className="btn btn-primary btn-sm">
              Continue
            </Link>
          ) : (
            <Link href={`/courses/${course.slug}`} className="btn btn-outline btn-sm">
              View course
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
