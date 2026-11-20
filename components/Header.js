import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { SITE } from "@/lib/site";

export default async function Header() {
  let user = null;
  try {
    user = await getSessionUser();
  } catch {
    user = null;
  }

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">B</span>
          <span className="brand-text">
            <strong>{SITE.name}</strong>
            <em>Online Courses</em>
          </span>
        </Link>

        <nav className="nav">
          <Link href="/courses">Courses</Link>
          <Link href="/#how">How it works</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                My Learning
              </Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="btn btn-outline btn-sm">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
