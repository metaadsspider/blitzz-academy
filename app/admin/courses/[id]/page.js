import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import CourseForm from "@/components/CourseForm";

export const dynamic = "force-dynamic";

export default async function AdminCourseEditPage({ params }) {
  if (!(await isAdmin())) redirect("/admin");

  const isNew = params.id === "new";
  let course = null;

  if (!isNew) {
    const id = Number(params.id);
    if (!Number.isInteger(id)) notFound();
    const { rows } = await query(
      `SELECT id, slug, title, subtitle, description, price_inr, list_price_inr,
              level, duration, lessons, accent, icon, sort_order
         FROM courses WHERE id = $1`,
      [id]
    );
    course = rows[0] || null;
    if (!course) notFound();
  }

  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <div className="dash-head">
        <p className="eyebrow">
          <Link href="/admin/courses">← All courses</Link>
        </p>
        <h1>{isNew ? "New course" : course.title}</h1>
        <p>
          {isNew
            ? "Fill in the details, then add your lessons below."
            : "Edit anything here. Saving updates the live course immediately."}
        </p>
      </div>

      <AdminNav active="courses" />

      <CourseForm course={course} />
    </div>
  );
}
