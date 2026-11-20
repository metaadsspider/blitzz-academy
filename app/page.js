import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import { getCourses, isEnrolled } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { SITE, CURRENCY } from "@/lib/site";

export const dynamic = "force-dynamic";

async function loadData() {
  try {
    const courses = await getCourses();
    return { courses, error: null };
  } catch (err) {
    return { courses: [], error: err.message };
  }
}

export default async function HomePage() {
  const { courses, error } = await loadData();
  const user = await getSessionUser().catch(() => null);

  const enrolled = new Set();
  if (user) {
    for (const c of courses) {
      if (await isEnrolled(user.id, c.id)) enrolled.add(c.id);
    }
  }

  const cheapest = courses.length
    ? Math.min(...courses.map((c) => c.price_inr))
    : null;

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">Online Courses · Learn at your pace</p>
            <h1>Skills you can use on Monday morning.</h1>
            <p className="hero-lead">
              {SITE.description}
            </p>
            <div className="hero-cta">
              <Link href="/courses" className="btn btn-primary">
                Browse courses
              </Link>
              <Link href="/register" className="btn btn-outline">
                Create free account
              </Link>
            </div>
            <ul className="hero-points">
              <li>Lifetime access</li>
              <li>Pay by UPI</li>
              <li>Access unlocked instantly</li>
              {cheapest !== null && (
                <li>
                  Courses from {CURRENCY}
                  {cheapest.toLocaleString("en-IN")}
                </li>
              )}
            </ul>
          </div>

          <aside className="hero-card">
            <div className="hero-card-head">What every course includes</div>
            <ul>
              <li>
                <span>Written lessons, no filler</span>
                <span>Self-paced</span>
              </li>
              <li>
                <span>Exercises with real data</span>
                <span>Each lesson</span>
              </li>
              <li>
                <span>Lifetime access</span>
                <span>One payment</span>
              </li>
              <li>
                <span>Pay by UPI, any app</span>
                <span>Instant unlock</span>
              </li>
              <li>
                <span>Email support</span>
                <span>Reply in 1 day</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="rule" />
            <h2>Courses</h2>
            <p>
              Four focused courses. Each one is a complete path from the first
              lesson to something you can show for it.
            </p>
          </div>

          {error ? (
            <div className="alert alert-error">
              The course catalogue could not load. {error}
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
      </section>

      <section className="section section-alt" id="how">
        <div className="wrap">
          <div className="section-head">
            <div className="rule" />
            <h2>How it works</h2>
            <p>Three steps, no waiting for anyone to approve your payment.</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-num">STEP 01</div>
              <h3>Create your account</h3>
              <p>
                Name, email, phone and a password. Takes under a minute and it
                is how we keep your courses attached to you.
              </p>
            </div>
            <div className="step">
              <div className="step-num">STEP 02</div>
              <h3>Pay by UPI</h3>
              <p>
                Scan the QR at checkout with any UPI app, or tap to open it on
                your phone. The exact amount is already filled in.
              </p>
            </div>
            <div className="step">
              <div className="step-num">STEP 03</div>
              <h3>Enter the UTR</h3>
              <p>
                Paste the reference number your UPI app shows and confirm. The
                course unlocks immediately, in the same second.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="rule" />
            <h2>Why people stay</h2>
            <p>Nothing here is decorative. This is what you actually get.</p>
          </div>

          <div className="feature-grid">
            <div className="feature">
              <h3>Written for reading</h3>
              <p>
                Lessons are text you can skim, search and come back to. No
                two-hour video you have to scrub through to find one answer.
              </p>
            </div>
            <div className="feature">
              <h3>One payment, lifetime access</h3>
              <p>
                No subscription. Buy a course once and it stays in your account,
                including any lesson added later.
              </p>
            </div>
            <div className="feature">
              <h3>Instant unlock</h3>
              <p>
                Your UTR is recorded with your order and the course opens right
                away. No email round trip, no waiting for approval.
              </p>
            </div>
            <div className="feature">
              <h3>Practice that is not toy data</h3>
              <p>
                Exercises use spreadsheets, APIs and files the way work actually
                hands them to you: messy, incomplete, and due tomorrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="faq">
        <div className="wrap faq">
          <div className="section-head">
            <div className="rule" />
            <h2>Questions</h2>
          </div>

          <details open>
            <summary>Which UPI apps can I use?</summary>
            <p>
              Any of them: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, or your
              bank's own app. The QR is a standard UPI code, so if the app can
              scan, it will work.
            </p>
          </details>

          <details>
            <summary>Where do I find the UTR?</summary>
            <p>
              Open the UPI app, tap the payment you just made, and copy the
              reference or UTR number. It is 12 digits for most banks and starts
              with the bank's code. Paste it at checkout exactly as shown.
            </p>
          </details>

          <details>
            <summary>What happens after I enter the UTR?</summary>
            <p>
              Your order is saved with the reference number and the course is
              added to your account immediately. Open My Learning and start
              lesson one. We keep the UTR on file for reconciliation.
            </p>
          </details>

          <details>
            <summary>Can I get a refund?</summary>
            <p>
              Write to {SITE.supportEmail} within 7 days of purchase with your
              order reference and we will sort it out. Refund requests are
              handled over email so there is a written record for both sides.
            </p>
          </details>

          <details>
            <summary>Do I get a certificate?</summary>
            <p>
              Yes. Finish every lesson in a course and a completion certificate
              with your name, the course title and the date appears in My
              Learning.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
