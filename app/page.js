import Link from "next/link";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { CURRENCY } from "@/lib/site";
import AdminNav from "@/components/AdminNav";
import DeleteCourseButton from "@/components/DeleteCourseButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Courses — Admin" };

export default async function AdminCoursesPage() {
  if (!(await isAdmin())) redirect("/admin");

  let rows = [];
  let error = null;
  try {
    const res = await query(
      `SELECT c.id, c.slug, c.title, c.price_inr, c.list_price_inr, c.level,
              c.duration, c.lessons, c.sort_order,
              (SELECT count(*)::int FROM enrollments e WHERE e.course_id = c.id) AS buyers
         FROM courses c
        ORDER BY c.sort_order ASC, c.id ASC`
    );
    rows = res.rows;
  } catch (err) {
    error = err.message;
  }

  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <div className="dash-head">
        <div className="rule" />
        <h1>Courses</h1>
        <p>Add a course, change a price, edit lessons. Changes go live instantly.</p>
      </div>

      <AdminNav active="courses" />

      {error && <div className="alert alert-error">Could not load courses. {error}</div>}

      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/courses/new" className="btn btn-primary">
          + New course
        </Link>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Price</th>
              <th>Was</th>
              <th>Lessons</th>
              <th>Buyers</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={`/admin/courses/${c.id}`} style={{ fontWeight: 600 }}>
                    {c.title}
                  </Link>
                  <div style={{ color: "var(--ink-3)" }}>
                    {c.level} · {c.duration}
                  </div>
                </td>
                <td className="mono">{c.slug}</td>
                <td>
                  {CURRENCY}
                  {Number(c.price_inr).toLocaleString("en-IN")}
                </td>
                <td style={{ color: "var(--ink-3)" }}>
                  {c.list_price_inr > 0
                    ? CURRENCY + Number(c.list_price_inr).toLocaleString("en-IN")
                    : "—"}
                </td>
                <td>{(c.lessons || []).length}</td>
                <td>{c.buyers}</td>
                <td>{c.sort_order}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Link href={`/admin/courses/${c.id}`} className="copy-btn">
                    Edit
                  </Link>{" "}
                  <DeleteCourseButton id={c.id} title={c.title} buyers={c.buyers} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && !error && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 28, color: "var(--ink-3)" }}>
                  No courses yet. Click “New course” to add the first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
