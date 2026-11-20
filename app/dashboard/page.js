import Link from "next/link";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { CURRENCY } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "My learning — Blitzz Academy" };

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard");

  let rows = [];
  let error = null;
  try {
    const res = await query(
      `SELECT c.id, c.slug, c.title, c.subtitle, c.duration, c.lessons,
              c.accent, e.created_at AS enrolled_at, o.utr, o.amount
         FROM enrollments e
         JOIN courses c ON c.id = e.course_id
         LEFT JOIN orders o ON o.id = e.order_id
        WHERE e.user_id = $1
        ORDER BY e.created_at DESC`,
      [user.id]
    );
    rows = res.rows;
  } catch (err) {
    error = err.message;
  }

  return (
    <div className="wrap">
      <div className="dash-head">
        <div className="rule" />
        <h1>Hello, {user.name.split(" ")[0]}</h1>
        <p>{user.email}</p>
      </div>

      {error && <div className="alert alert-error">Could not load your courses. {error}</div>}

      {rows.length === 0 && !error ? (
        <div className="empty">
          <h2>No courses yet</h2>
          <p>Pick a course, pay by UPI, and it appears here the moment you confirm.</p>
          <Link href="/courses" className="btn btn-primary" style={{ marginTop: 12 }}>
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="section" style={{ paddingTop: 24 }}>
          <div className="course-grid">
            {rows.map((c) => (
              <article className="course-card" key={c.id}>
                <div className="course-bar" style={{ background: c.accent }} />
                <div className="course-body">
                  <div className="course-top">
                    <span className="course-level">Enrolled</span>
                    {c.utr && <span className="course-off">UTR {c.utr}</span>}
                  </div>
                  <h3>
                    <Link href={`/learn/${c.slug}`}>{c.title}</Link>
                  </h3>
                  <p className="course-sub">{c.subtitle}</p>
                  <p className="course-meta">
                    {c.lessons.length} lessons · {c.duration}
                  </p>
                  <div className="course-foot">
                    <div className="price">
                      <strong>
                        {CURRENCY}
                        {Number(c.amount || 0).toLocaleString("en-IN")}
                      </strong>
                      <s style={{ textDecoration: "none", fontSize: 12 }}>
                        paid
                      </s>
                    </div>
                    <Link href={`/learn/${c.slug}`} className="btn btn-primary btn-sm">
                      Continue
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
