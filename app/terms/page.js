import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: `Terms of Service — ${SITE.name}`,
  description: "Terms of service, payment terms, no-refund policy and payment fraud policy.",
};

export default function TermsPage() {
  return (
    <div className="wrap legal">
      <p className="eyebrow">Legal</p>
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: 21 November 2026</p>

      <p>
        These terms govern your use of {SITE.name} and the purchase of any course
        from it. By creating an account, or by paying for a course, you accept
        these terms in full. If you do not accept them, do not use the site.
      </p>

      <h2>1. Who we are</h2>
      <p>
        {SITE.name} is an online education service operated from India. You can
        reach us at <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>{" "}
        for any question about these terms, an order, or your account.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must give a real name, a working email address and your own phone number.</li>
        <li>You must be 18 years or older to buy a course.</li>
        <li>One account per person. Accounts are personal and cannot be transferred or sold.</li>
        <li>You are responsible for keeping your password private. Tell us at once if you think someone else has access to your account.</li>
      </ul>

      <h2>3. Courses and access</h2>
      <ul>
        <li>Courses are self-paced written lessons, delivered inside your account.</li>
        <li>On payment, access is granted to your account and remains available to you for the life of the course on this platform.</li>
        <li>We may add, correct or update lesson content at any time. We may retire a course, in which case we will give existing buyers reasonable notice by email.</li>
        <li>Access is for one person. Sharing your login, publishing lesson content, or reselling access is a breach of these terms.</li>
      </ul>

      <h2>4. Prices and payment</h2>
      <ul>
        <li>All prices are in Indian Rupees (INR) and are shown on the course page at the time you buy.</li>
        <li>Payment is accepted by UPI only. You pay the exact amount shown at checkout to the UPI ID displayed there.</li>
        <li>After paying, you enter the UPI reference number (UTR) from your payment app. Your course unlocks once you confirm.</li>
        <li>We record the name, email, phone number and UTR of every order. We may ask you for proof of payment at any time, and you agree to provide it.</li>
        <li>Any bank charges, UPI charges or taxes that apply to your payment are your responsibility.</li>
      </ul>

      <h2>5. No refunds</h2>
      <p>
        <strong>All sales are final.</strong> Course content is digital and is
        delivered to your account the moment you confirm your payment, so it
        cannot be returned or &quot;un-delivered&quot;.
      </p>
      <ul>
        <li>We do not offer refunds, cancellations, partial refunds, credits or exchanges once access has been granted.</li>
        <li>Not finishing a course, changing your mind, finding the level too easy or too hard, or no longer having time to study are not grounds for a refund.</li>
        <li>Buying the same course twice by mistake is not grounds for a refund. Write to us and we will look at the duplicate order.</li>
        <li>Where a refund is required by applicable law, we will comply with the law. Nothing in these terms removes a right you have under mandatory Indian consumer law.</li>
      </ul>

      <h2>6. False payment claims and dishonest complaints</h2>
      <p>
        We give access immediately, in good faith, on the strength of the UTR you
        enter. That trust is a condition of using this service, and abusing it has
        consequences.
      </p>
      <ul>
        <li>
          <strong>False payment reference.</strong> Entering a UTR that does not
          correspond to a real, completed payment to our UPI ID in order to obtain
          a course without paying is a dishonest inducement to deliver goods of
          value. It is a civil wrong and may also be an offence under Indian law,
          including the Indian Penal Code / Bharatiya Nyaya Sanhita provisions on
          cheating and forgery, and the Information Technology Act, 2000.
        </li>
        <li>
          <strong>Knowingly false or malicious complaints.</strong> Making a
          complaint, review, chargeback or dispute that you know to be false, or
          that you make to damage our reputation, is treated the same way.
        </li>
        <li>
          <strong>What we will do.</strong> We may immediately revoke your access
          and close your account. We may recover the value of the course, our
          reasonable legal costs, and any chargeback or dispute fees from you. We
          may report the matter to the police or file a civil suit, and we may
          share the order details (name, email, phone, UTR, IP address) with law
          enforcement or our advisers for that purpose.
        </li>
        <li>
          <strong>What this does not do.</strong> This clause does not stop you
          from raising a genuine problem, asking a question, or complaining to a
          consumer forum or any regulator. It applies only to claims you know to
          be false or that you make in bad faith.
        </li>
      </ul>

      <h2>7. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>copy, record, republish, resell or redistribute any lesson content;</li>
        <li>share your account or let anyone else use it;</li>
        <li>attempt to access another person&apos;s account, our admin area, or our database;</li>
        <li>probe, scan or attempt to break the security of the site;</li>
        <li>use the site for anything unlawful.</li>
      </ul>

      <h2>8. Our content</h2>
      <p>
        All course text, exercises, design and branding on this site belong to{" "}
        {SITE.name} and are protected by copyright. You get a personal,
        non-transferable licence to read the courses you have bought. You do not
        get ownership of the content.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        We may update these terms. The version in force is the one published on
        this page, and the date at the top will change. Terms in force when you
        bought a course continue to govern that purchase.
      </p>

      <h2>10. Limits on our liability</h2>
      <p>
        The site is provided on an &quot;as is&quot; basis. To the extent the law
        allows, our total liability to you for any claim connected with a course
        is limited to the amount you paid for that course. We are not liable for
        indirect or consequential loss, including lost profits, lost opportunities
        or lost data.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the laws of India. Disputes are subject to the
        exclusive jurisdiction of the courts at [YOUR CITY], India.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these terms, an order or a payment:{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
      </p>

      <div className="legal-foot">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/disclaimer">Course Disclaimer</Link>
        <Link href="/">Back to home</Link>
      </div>
    </div>
  );
}
