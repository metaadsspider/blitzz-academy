import CourseCard from "@/components/CourseCard";
import { getCourses, isEnrolled } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "All courses — Blitzz Academy" };

export default async function CoursesPage() {
  let courses = [];
  let error = null;
  try {
    courses = await getCourses();
  } catch (err) {
    error = err.message;
  }

  const user = await getSessionUser().catch(() => null);
  const enrolled = new Set();
  if (user) {
    for (const c of courses) {
      if (await isEnrolled(user.id, c.id)) enrolled.add(c.id);
    }
  }

  return (
    <div className="wrap">
      <div className="dash-head">
        <div className="rule" />
        <h1>All courses</h1>
        <p>
          Buy once, keep access for life. Every course is self-paced and written
          to be read.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 28 }}>
        {error ? (
          <div className="alert alert-error">
            The catalogue could not load. {error}
          </div>
        ) : (
          <div className="course-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                enrolled={enrolled.has(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
