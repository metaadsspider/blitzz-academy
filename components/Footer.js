import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <div className="brand brand-footer">
            <span className="brand-mark">B</span>
            <span className="brand-text">
              <strong>{SITE.name}</strong>
              <em>Online Courses</em>
            </span>
          </div>
          <p className="footer-note">{SITE.tagline}</p>
        </div>

        <div>
          <h4>Learn</h4>
          <ul>
            <li>
              <Link href="/courses">All courses</Link>
            </li>
            <li>
              <Link href="/dashboard">My learning</Link>
            </li>
            <li>
              <Link href="/register">Create account</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Support</h4>
          <ul>
            <li>
              <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
            </li>
            <li>
              <Link href="/#faq">Payment help</Link>
            </li>
          </ul>

          <h4 style={{ marginTop: 22 }}>Legal</h4>
          <ul>
            <li>
              <Link href="/terms">Terms &amp; Refunds</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/disclaimer">Disclaimer</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Payment</h4>
          <p className="footer-note">
            UPI only. Scan the QR at checkout, pay, then enter your UTR to unlock
            the course immediately.
          </p>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </span>
        <span className="stamp">
          v{SITE.version} · {SITE.buildDate}
        </span>
      </div>
    </footer>
  );
}
