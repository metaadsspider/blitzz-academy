import Link from "next/link";

export default function NotFound() {
  return (
    <div className="narrow" style={{ textAlign: "center" }}>
      <div className="card">
        <h1>Page not found</h1>
        <p className="sub">That page does not exist, or the course was removed.</p>
        <Link href="/courses" className="btn btn-primary">
          Browse courses
        </Link>
      </div>
    </div>
  );
}
