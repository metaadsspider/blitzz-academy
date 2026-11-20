# Blitzz Academy — online course store

A complete, deployable course-selling site: landing page, catalogue, accounts,
UPI QR checkout with UTR confirmation, instant course access, and an admin
orders page. Built on Next.js 14 (App Router) and PostgreSQL, ready for Vercel.

---

## What is included

| Area | What it does |
| --- | --- |
| `/` | Classic marketing homepage: hero, courses, how it works, FAQ |
| `/courses` | Full catalogue |
| `/courses/[slug]` | Sales page with lesson list and buy button |
| `/register`, `/login` | Email + password accounts (bcrypt, JWT in an httpOnly cookie) |
| `/checkout/[slug]` | UPI QR for the exact amount, name / email / phone form, UTR box |
| `/learn/[slug]` | Lesson reader, locked until the course is bought |
| `/dashboard` | "My learning" — every course the buyer owns |
| `/admin` | Orders list with UTR, status and a Revoke button |

---

## 1. Run it locally

You need Node 20+ and a Postgres database (Neon, Supabase, or local Postgres).

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                    # http://localhost:3000
```

Tables and the four sample courses are created automatically on the first
request — there is no migration step and no seed command to remember.

### Environment variables

| Key | What it is |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. Neon gives you one on signup. |
| `AUTH_SECRET` | Long random string that signs the login cookie. `openssl rand -base64 32` |
| `UPI_ID` | Your UPI ID, e.g. `yourname@okhdfcbank`. The QR is built from this. |
| `UPI_NAME` | Name shown in the buyer's UPI app. |
| `ADMIN_PASSWORD` | Password for `/admin`. |

---

## 2. Deploy to Vercel

1. **Create the database.** Go to [neon.com](https://neon.com), create a free
   project, and copy the connection string (it looks like
   `postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require`).
   Vercel's own Postgres from the Marketplace works the same way.
2. **Push the code to GitHub.**
   ```bash
   git init && git add . && git commit -m "Course store"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. **Import on Vercel.** [vercel.com/new](https://vercel.com/new) → pick the
   repo → framework is detected as Next.js → **Deploy**. No build settings to
   change.
4. **Add the environment variables** in Vercel → Project → Settings →
   Environment Variables (all five from the table above), then redeploy from
   the Deployments tab. Without `DATABASE_URL` the pages show an error banner
   instead of courses, so this step is not optional.
5. **Open your site** at `https://your-project.vercel.app`. The first visit
   creates the tables and inserts the four courses.

### Your own domain on Vercel

Project → Settings → Domains → Add, type your domain, then copy the DNS records
Vercel shows into your registrar (an `A` record for the root, a `CNAME` for
`www`). HTTPS is issued automatically once DNS resolves.

---

## 3. How the payment flow works

1. Buyer logs in and opens `/checkout/<course>`.
2. The server creates an order row and builds a standard UPI link:
   `upi://pay?pa=<UPI_ID>&pn=<UPI_NAME>&am=<price>&cu=INR&tr=ORD<orderId>`
   That link is rendered as a QR code, and as an "Open UPI app" button for
   phones. Any UPI app can pay it.
3. Buyer pays, copies the UTR / reference number, and submits the form with
   their name, email, phone and UTR.
4. `POST /api/checkout/confirm` writes the UTR onto the order, marks it `paid`,
   and inserts an enrollment row **in the same transaction**. The course opens
   immediately — no approval step, exactly as requested.

### Payment risk — read this before going live

As specified, **the UTR is recorded but never verified against the bank**. Anyone
who types eight or more characters into the UTR box gets the course for free.
That is a real, exploitable hole, and on a public site it will be found.

What is already in place to limit the damage:

- Every order keeps the UTR, name, email and phone, so you can reconcile
  against your bank statement later.
- `/admin` lists every order and has a **Revoke** button that marks the order
  `revoked` and removes the buyer's access in one click.
- Each order is tied to one logged-in account, so abuse is traceable rather
  than anonymous.

If you later want real verification, the smallest change is a payment
aggregator that returns a signed webhook (Razorpay, Cashfree, PhonePe PG). That
replaces step 2 and 3 with a hosted checkout, and the enrollment insert in
`app/api/checkout/confirm/route.js` is where the webhook would call instead.

---

## 4. Changing the catalogue

Edit `lib/courses-data.js` — title, price, lessons, accents. Seeding uses
`ON CONFLICT (slug) DO NOTHING`, so **changes only apply to courses that do not
exist yet**. After the site has run once, either:

- edit the row in the database (`UPDATE courses SET price_inr = 1999 WHERE slug = 'python-from-zero'`), or
- delete the row and let the seed re-insert it on the next request.

Brand name, tagline and support email live in `lib/site.js`.

---

## 5. Project map

```
app/
  page.js                     homepage
  courses/page.js             catalogue
  courses/[slug]/page.js      sales page
  login/, register/           auth screens
  dashboard/page.js           my learning
  learn/[slug]/page.js        lesson reader (gated)
  checkout/[slug]/page.js     checkout screen
  admin/page.js               orders + revoke
  api/auth/{register,login,logout}/route.js
  api/checkout/route.js       creates order + QR
  api/checkout/confirm/route.js  saves UTR, grants access
  api/admin/{login,revoke}/route.js
components/                   header, footer, cards, forms, checkout flow
lib/
  db.js                       pool, schema creation, seed
  auth.js                     cookie sessions, admin session
  upi.js                      UPI link, QR image, UTR validation
  courses-data.js             the catalogue
  site.js                     brand settings
  format.js                   lesson text -> headings/code/paragraphs
app/globals.css               all styling
```

---

## 6. Tested behaviour

The flow was run end to end against a real PostgreSQL 16 instance: register,
duplicate-email rejection, login, wrong password, order creation, QR/link
contents, order reuse, short-UTR rejection, confirm → immediate access, lesson
gating for an unbought course, logged-out redirect, admin login, admin order
list, revoke → access removed.
