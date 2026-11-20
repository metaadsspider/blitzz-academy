import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: `Course Disclaimer — ${SITE.name}`,
  description: "What our courses are, and what they are not.",
};

export default function DisclaimerPage() {
  return (
    <div className="wrap legal">
      <p className="eyebrow">Legal</p>
      <h1>Course Disclaimer</h1>
      <p className="legal-updated">Last updated: 21 November 2026</p>

      <h2>1. Educational purpose only</h2>
      <p>
        Every course on {SITE.name} is provided for general education and skill
        building. It is teaching material, not a service, consultation or
        professional engagement, and buying a course does not create any
        client, adviser or employment relationship between us.
      </p>

      <h2>2. No guarantee of results</h2>
      <p>
        We do not promise that you will pass an exam, get a job, win a client, earn
        any particular amount, or achieve any specific outcome. What you get out of
        a course depends on your own effort, your background and factors outside our
        control. Any example, case study or number used in a lesson is illustrative
        of a technique — it is not a prediction of your results.
      </p>

      <h2>3. Not professional advice</h2>
      <p>
        Nothing in these courses is financial, investment, legal, tax, medical or
        psychological advice. Do not act on something you read in a lesson in place
        of advice from a qualified professional who knows your situation. For
        anything with real consequences, consult a licensed practitioner.
      </p>

      <h2>4. Accuracy and change</h2>
      <p>
        We write carefully and check our material, but software, tools, prices,
        platform rules and laws change. A lesson that was accurate when written may
        become out of date. We are not liable for errors or for decisions you take
        based on course content. If you spot a mistake, tell us and we will correct
        it.
      </p>

      <h2>5. Third-party names and tools</h2>
      <p>
        Courses mention products, companies and tools such as Python, React, Excel,
        Google, Meta and others. Those names belong to their owners. Mentioning them
        does not mean we are affiliated with, endorsed by or sponsored by them, and
        we are not responsible for their behaviour, pricing or availability.
      </p>

      <h2>6. External links</h2>
      <p>
        Some lessons link to websites we do not control. We include them because
        they were useful when we wrote the lesson. We are not responsible for their
        content or their privacy practices.
      </p>

      <h2>7. Your own data and systems</h2>
      <p>
        If an exercise asks you to work with files, accounts or systems, use your own
        or ones you are permitted to use. Never run course code against production
        systems, customer data or anything you do not own. You are responsible for
        your own backups and for any consequences of what you run on your machine.
      </p>

      <h2>8. Limits on liability</h2>
      <p>
        To the extent the law allows, {SITE.name} is not liable for indirect or
        consequential loss arising from use of the course material, including lost
        profits, lost data or lost opportunities. Our total liability for any claim
        connected with a course is limited to the amount you paid for that course.
        Nothing here limits a right you have under mandatory Indian consumer law.
      </p>

      <h2>9. Questions</h2>
      <p>
        Not sure whether a course suits you before buying? Ask first:{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>. We would
        rather answer a question than have you buy the wrong course — purchases are
        final, as set out in our <Link href="/terms">Terms of Service</Link>.
      </p>

      <div className="legal-foot">
        <Link href="/terms">Terms of Service</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/">Back to home</Link>
      </div>
    </div>
  );
}
