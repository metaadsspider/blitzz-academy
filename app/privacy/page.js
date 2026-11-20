import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: `Privacy Policy — ${SITE.name}`,
  description: "What personal data we collect, why, and the choices you have.",
};

export default function PrivacyPage() {
  return (
    <div className="wrap legal">
      <p className="eyebrow">Legal</p>
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: 21 November 2026</p>

      <p>
        This policy explains what personal data {SITE.name} collects when you use
        this site, why we collect it, who we share it with, and what you can ask us
        to do with it. It is written to align with the Digital Personal Data
        Protection Act, 2023 (India) and the Information Technology Act, 2000.
      </p>

      <h2>1. What we collect</h2>
      <ul>
        <li>
          <strong>Account details</strong> — your name, email address and phone
          number, and a password stored only as a one-way hash (we never see your
          actual password).
        </li>
        <li>
          <strong>Order details</strong> — which course you bought, the amount, the
          UTR / UPI reference number you enter, and the date and time.
        </li>
        <li>
          <strong>Course activity</strong> — which courses are attached to your
          account. We do not track which lessons you have read.
        </li>
        <li>
          <strong>Technical data</strong> — standard server logs kept by our hosting
          provider, including IP address, browser type and the pages requested.
        </li>
        <li>
          <strong>Cookies</strong> — see section 6.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> collect or store your card number, UPI PIN, bank
        password or any banking credential. Your payment happens inside your own UPI
        app, between you and your bank. We only ever see the reference number you
        choose to type in.
      </p>

      <h2>2. Why we use it</h2>
      <ul>
        <li>To create your account, log you in and keep you logged in.</li>
        <li>To deliver the course you bought and keep it attached to your account.</li>
        <li>To match a payment to your order, and to answer questions about it.</li>
        <li>To send service messages about your order or your access.</li>
        <li>To prevent fraud, abuse and unauthorised access to accounts.</li>
        <li>To meet legal, tax and accounting obligations.</li>
      </ul>
      <p>
        We rely on your consent (given when you create an account) and on the
        necessity of processing to perform the service you asked for.
      </p>

      <h2>3. Who we share it with</h2>
      <ul>
        <li>
          <strong>Hosting</strong> — Vercel, which serves this website and holds
          server logs.
        </li>
        <li>
          <strong>Database</strong> — Neon, which stores the account and order data
          in an encrypted PostgreSQL database.
        </li>
        <li>
          <strong>Your bank and UPI app</strong> — the payment itself, handled
          entirely on your side.
        </li>
        <li>
          <strong>Authorities</strong> — where we are legally required to disclose
          information, or where we are investigating a fraudulent payment claim as
          described in our <Link href="/terms">Terms of Service</Link>.
        </li>
      </ul>
      <p>
        We do not sell your personal data, and we do not share it with advertisers
        or data brokers.
      </p>

      <h2>4. How long we keep it</h2>
      <ul>
        <li>Account data: while your account exists, and afterwards for as long as we need it for legal and accounting records.</li>
        <li>Order and payment records: retained for the period required by Indian tax and company law.</li>
        <li>Server logs: kept briefly by our hosting provider and then discarded.</li>
      </ul>

      <h2>5. Your rights</h2>
      <p>You can ask us to:</p>
      <ul>
        <li>tell you what personal data of yours we hold, and give you a copy;</li>
        <li>correct anything inaccurate;</li>
        <li>delete your account and the personal data in it, where we are not required to keep it;</li>
        <li>withdraw consent for anything that relies on consent.</li>
      </ul>
      <p>
        Write to <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> and
        we will respond within a reasonable time. Note that deleting your account
        also ends your access to any course you have bought, and does not create a
        right to a refund — see the no-refund section of our{" "}
        <Link href="/terms">Terms of Service</Link>.
      </p>
      <p>
        If you are not satisfied with our answer, you may complain to the Data
        Protection Board of India under the Digital Personal Data Protection Act,
        2023.
      </p>

      <h2>6. Cookies</h2>
      <p>We use only what the site needs to work:</p>
      <ul>
        <li>
          <strong>session</strong> — keeps you logged in. Set when you log in,
          valid for 30 days, removed when you log out.
        </li>
        <li>
          <strong>admin_session</strong> — only ever set for the site owner, and
          only after entering the admin password. Valid for 12 hours.
        </li>
      </ul>
      <p>
        Both are httpOnly and cannot be read by scripts in the page. We do not use
        advertising or analytics cookies, so there is nothing to opt out of.
      </p>

      <h2>7. Security</h2>
      <p>
        Passwords are hashed with bcrypt and never stored in readable form. The
        site is served over HTTPS. Database access is restricted to the application.
        No system is perfectly secure, but if a breach affects your data we will
        tell you and the relevant authority as required by law.
      </p>

      <h2>8. Children</h2>
      <p>
        This site is for adults. You must be 18 or older to create an account or buy
        a course, and we do not knowingly collect data from anyone under 18.
      </p>

      <h2>9. Changes</h2>
      <p>
        If this policy changes, the new version appears here with a new date. Where
        a change is significant we will tell you by email.
      </p>

      <h2>10. Contact</h2>
      <p>
        Privacy questions and requests:{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>. Business
        address: [YOUR BUSINESS ADDRESS].
      </p>

      <div className="legal-foot">
        <Link href="/terms">Terms of Service</Link>
        <Link href="/disclaimer">Course Disclaimer</Link>
        <Link href="/">Back to home</Link>
      </div>
    </div>
  );
}
