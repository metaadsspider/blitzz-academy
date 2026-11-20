import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCourseBySlug, isEnrolled } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { parseLessonBody } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LearnPage({ params, searchParams }) {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/learn/${params.slug}`);

  let course = null;
  try {
    course = await getCourseBySlug(params.slug);
  } catch {
    course = null;
  }
  if (!course) notFound();

  const owned = await isEnrolled(user.id, course.id);
  if (!owned) redirect(`/courses/${course.slug}`);

  const total = course.lessons.length;
  const raw = Number(searchParams?.lesson || 1);
  const index = Math.min(Math.max(Number.isFinite(raw) ? raw : 1, 1), total) - 1;
  const lesson = course.lessons[index];
  const blocks = parseLessonBody(lesson.body);

  return (
    <div className="wrap">
      <div className="learn-grid">
        <nav className="learn-nav">
          <h4>{course.title}</h4>
          <ol>
            {course.lessons.map((l, i) => (
              <li key={i}>
                <Link
                  href={`/learn/${course.slug}?lesson=${i + 1}`}
                  className={i === index ? "active" : ""}
                >
                  {l.title}
                </Link>
              </li>
            ))}
          </ol>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
            <Link href="/dashboard" className="btn btn-outline btn-sm btn-block">
              My learning
            </Link>
          </div>
        </nav>

        <article className="lesson-body">
          <h1>{lesson.title}</h1>
          <p className="lesson-meta">
            Lesson {index + 1} of {total} · {lesson.duration}
          </p>

          {blocks.map((b, i) => {
            if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "pre")
              return (
                <pre key={i}>
                  <code>{b.text}</code>
                </pre>
              );
            return <p key={i}>{b.text}</p>;
          })}

          <div className="lesson-nav">
            {index > 0 ? (
              <Link
                href={`/learn/${course.slug}?lesson=${index}`}
                className="btn btn-outline btn-sm"
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            {index < total - 1 ? (
              <Link
                href={`/learn/${course.slug}?lesson=${index + 2}`}
                className="btn btn-primary btn-sm"
              >
                Next lesson →
              </Link>
            ) : (
              <Link href="/dashboard" className="btn btn-primary btn-sm">
                Finish course
              </Link>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
