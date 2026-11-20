import Link from "next/link";

export default function AdminNav({ active }) {
  return (
    <div className="admin-nav">
      <Link href="/admin" className={active === "orders" ? "on" : ""}>
        Orders
      </Link>
      <Link href="/admin/courses" className={active === "courses" ? "on" : ""}>
        Courses
      </Link>
      <Link href="/" target="_blank">
        View site ↗
      </Link>
    </div>
  );
}
