// ---------------------------------------------------------------------------
// The course catalogue. Everything here is inserted into the database the
// first time the site runs. Change prices, titles and lessons freely.
// To add a course, copy one block and give it a new `slug`.
// ---------------------------------------------------------------------------

export const COURSES = [
  {
    slug: "python-from-zero",
    title: "Python Programming from Zero",
    subtitle: "Go from never having written code to building real tools.",
    description:
      "A calm, practical introduction to Python. You write your first line in lesson one and finish with a working program that reads files, talks to a web API and saves a report. No prior experience assumed, no jargon left unexplained.",
    price_inr: 1499,
    list_price_inr: 3999,
    level: "Beginner",
    duration: "6 hours",
    accent: "#14304a",
    icon: "py",
    sort_order: 1,
    lessons: [
      {
        title: "How a program actually runs",
        duration: "18 min",
        body: `Python reads your file from top to bottom and does what each line says. That is the whole model, and it is worth holding on to: there is no hidden step.

## Your first program

Open any editor, save a file called hello.py, and put one line in it:

print("Hello, world")

Run it from a terminal with python hello.py. The word print is a function: a named block of code that Python already knows, which you call by putting brackets after it. Whatever you put inside the brackets gets shown on screen.

## Values and names

A value is a piece of data: the number 42, the text "delhi", the answer True. A name (also called a variable) is a label you stick on a value so you can use it later:

price = 1499
title = "Python Programming"
discounted = True

The equals sign means "make this name point at this value". It is not a comparison. Comparisons use == and they ask a question rather than store anything.

## Try this

Make three names of your own: a number, a piece of text, and a true/false value. Print all three. Then change one of them and print it again. That single exercise removes most of the fear people bring to their first week of programming.`,
      },
      {
        title: "Numbers, text and the small traps",
        duration: "22 min",
        body: `Python has a small set of built-in types and you will meet four of them constantly: int for whole numbers, float for decimals, str for text, and bool for True or False.

## Arithmetic that behaves

Addition, subtraction and multiplication work as you expect. Division is the one that catches people:

7 / 2 gives 3.5
7 // 2 gives 3 (floor division, drops the remainder)
7 % 2 gives 1 (the remainder itself)

The % operator is more useful than it looks. It answers "is this number even" and "does this value fit in pages of ten".

## Building text

You join text with + but that gets clumsy. Use an f-string instead:

name = "Yashu"
print(f"{name} bought a course for {1499} rupees")

Anything inside the braces is evaluated and dropped into the sentence. This is the single most used feature in day-to-day Python.

## The trap

Text and numbers do not mix. "3" + 3 raises a TypeError, because Python will not guess what you meant. Convert deliberately: int("3") or str(3). When a program crashes on a type error, look for a value that came from a form, a file or an API, because those always arrive as text.`,
      },
      {
        title: "Making decisions and repeating work",
        duration: "24 min",
        body: `Programs get interesting when they branch and loop.

## if, elif, else

if total > 2000:
    shipping = 0
elif total > 1000:
    shipping = 49
else:
    shipping = 99

Python uses indentation to know what belongs inside the branch. Four spaces is the convention. Mixed tabs and spaces is the most common beginner error and the message is confusing, so pick spaces and stay with them.

## Loops over things

for item in cart:
    print(item)

The for loop asks the collection for its next value until it runs out. You rarely need an index. When you do need one, use enumerate:

for position, item in enumerate(cart, start=1):
    print(position, item)

## while, used carefully

while balance > 0:
    balance -= withdrawal

A while loop repeats as long as a condition holds. Every while loop must change something that affects its condition, or it runs forever. If a program seems frozen, this is usually why.`,
      },
      {
        title: "Functions that you will reuse",
        duration: "26 min",
        body: `A function is a named block of code with inputs and one output. It is how you stop copy-pasting.

def gst(amount, rate=0.18):
    return round(amount * rate, 2)

Two things to notice. rate has a default, so gst(1000) works without passing it. And return hands the answer back to whoever called it; print only shows it. A function that prints instead of returning is hard to test and hard to reuse.

## Scope

Names created inside a function disappear when it finishes. That is a feature: you can use i inside ten different functions without them interfering.

## Small is good

A function that fits on one screen is a function you can read in a year. When one grows past about twenty lines, look for the natural split. Naming it well matters more than the code: calculate_invoice_total says what it does; process2 does not.

## Try this

Write a function called price_with_gst that takes a price and returns the price plus 18% GST, rounded to two decimals. Call it three times with different values and print each result.`,
      },
      {
        title: "Lists, dictionaries and the data you will meet",
        duration: "28 min",
        body: `Almost every real program is a loop over a list of dictionaries. Get comfortable with these two and the rest follows.

## Lists keep order

courses = ["Python", "Web", "Excel"]
courses.append("Marketing")
first = courses[0]
last = courses[-1]

Slicing takes a range: courses[1:3] gives items at positions 1 and 2. The end position is exclusive, which is a rule worth memorising once.

## Dictionaries look things up by name

order = {"id": 1042, "amount": 1499, "status": "paid"}
order["status"] gives "paid"
order.get("coupon", "none") returns "none" when the key is missing instead of crashing

Use .get when a key might not exist. Direct square brackets are correct only when you are certain.

## Together

for course in courses:
    print(course["title"], course["price_inr"])

This shape, a loop over records printing or transforming fields, is most of what business code does. List comprehensions shorten it:

titles = [c["title"] for c in courses if c["price_inr"] < 2000]

Read that right to left: take each course, keep the cheap ones, take the title.`,
      },
      {
        title: "Files, errors and a program worth keeping",
        duration: "30 min",
        body: `The last step turns exercises into tools.

## Reading and writing files

with open("orders.csv", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

The with block closes the file even if something inside fails. Always use it.

## Handling errors instead of crashing

try:
    amount = int(user_input)
except ValueError:
    amount = 0

Catch the specific error you expect, not everything. A bare except hides real bugs, including ones you would want to see.

## The project

Write a script that reads orders.csv with columns id,email,amount, keeps only rows above 1000, sums the amounts, and writes a one-line summary to report.txt. It uses a file, a loop, a condition, a number and a function. That is the whole beginner syllabus in one exercise, and it is genuinely useful at work.`,
      },
    ],
  },
  {
    slug: "fullstack-web-bootcamp",
    title: "Full-Stack Web Development Bootcamp",
    subtitle: "HTML, CSS, JavaScript, React and a database, built into one app.",
    description:
      "Build and deploy a real web application from an empty folder. You learn the browser layer, the server layer and the database layer in the order you will actually use them, ending with a deployed project on your own domain.",
    price_inr: 3499,
    list_price_inr: 7999,
    level: "Beginner to Intermediate",
    duration: "14 hours",
    accent: "#1f5f4e",
    icon: "web",
    sort_order: 2,
    lessons: [
      {
        title: "How the web works, without hand-waving",
        duration: "20 min",
        body: `When you type an address, your browser resolves a name to an IP address, opens a TCP connection, sends an HTTP request, and renders whatever comes back. Every debugging skill you will build rests on that sentence.

## The request

GET /courses HTTP/1.1
Host: example.com

A request has a method (what you want done), a path (what you want it done to), headers (metadata) and sometimes a body. GET asks for something. POST sends something new. PUT and PATCH change. DELETE removes.

## The response

HTTP/1.1 200 OK
Content-Type: text/html

The status code is the first thing to read when something breaks. 2xx worked, 3xx moved, 4xx is your mistake, 5xx is the server's. A 404 on a page you expect is usually a path typo, not a missing file.

## Where the work happens

Static files are sent as they sit on disk. Anything dynamic needs a server: code that reads a database, checks a login, or builds a page per user. That server is what you are learning to write.`,
      },
      {
        title: "HTML that means something",
        duration: "24 min",
        body: `HTML describes structure, not appearance. Use the element that describes what the thing is and styling becomes easy; use divs for everything and you fight the page forever.

## The skeleton

Every page has one main, one h1, and headings in order. Skip that and screen readers, search engines and your own future self all suffer.

<main>
  <h1>Courses</h1>
  <article>
    <h2>Python from Zero</h2>
    <p>Six hours, twenty-four lessons.</p>
  </article>
</main>

## Forms are the front door

<form method="post" action="/api/orders">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>
  <button type="submit">Buy</button>
</form>

The label's for attribute must match the input's id. This is not decoration: tapping the label focuses the field, and screen readers announce it.

## Links and buttons are not interchangeable

A link goes somewhere. A button does something. Using a div with a click handler breaks keyboard access and the browser's own history. Pick the element by meaning.`,
      },
      {
        title: "CSS layout you can reason about",
        duration: "28 min",
        body: `Two layout systems cover nearly everything: flexbox for one dimension, grid for two.

## Flexbox

.row { display: flex; gap: 16px; align-items: center; }

Flex lays children along one axis. gap replaces a pile of margins. align-items controls the cross axis, justify-content the main axis.

## Grid

.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }

That one line gives a responsive card grid with no media queries: as many columns as fit, each at least 260px.

## The box model, in one breath

Every element has content, padding, border and margin, in that order. box-sizing: border-box makes width include padding and border, which is what you almost always want:

*, *::before, *::after { box-sizing: border-box; }

## Responsive without guessing

Design at 360px first. If it works there it will work wider; the reverse is rarely true. Test by dragging the window, not by trusting a media query you wrote blind.`,
      },
      {
        title: "JavaScript: the parts you actually use",
        duration: "32 min",
        body: `Modern JavaScript is smaller than its reputation.

## Values and functions

const price = 1499;
function withGst(amount) { return Math.round(amount * 1.18); }

Use const by default and let only when a value genuinely changes. Arrow functions are shorter and keep the surrounding this:

const withGst = (amount) => Math.round(amount * 1.18);

## Arrays

const titles = courses.filter((c) => c.price < 2000).map((c) => c.title);

filter keeps items, map transforms them, reduce collapses them. These three cover most list work.

## Async, plainly

async function loadCourses() {
  const res = await fetch("/api/courses");
  if (!res.ok) throw new Error("Could not load courses");
  return res.json();
}

await pauses this function until the promise settles. It does not block the page. Always check res.ok: fetch does not throw on a 404 or 500, and silently treating an error page as data is a classic bug.

## Events

button.addEventListener("click", () => { ... });

Handle the event, change state, let the DOM catch up. When something does not update, log the value you think changed; it usually did not.`,
      },
      {
        title: "React: components and state",
        duration: "34 min",
        body: `A React component is a function that returns markup. State is data that, when changed, re-renders the component.

## The smallest useful component

function Price({ amount }) {
  return <p className="price">{new Intl.NumberFormat("en-IN").format(amount)}</p>;
}

Props flow down. A component cannot change its own props; that is the point.

## State

const [open, setOpen] = useState(false);

Calling setOpen triggers a re-render with the new value. Never mutate state directly: items.push(x) changes the array without telling React. Create a new one instead: setItems([...items, x]).

## Effects, sparingly

useEffect runs after render. Use it to fetch data or subscribe to something outside React, and give it the dependencies it reads:

useEffect(() => { loadCourses(); }, []);

An empty array means run once. Leave the array out and it runs after every render, which is how infinite loops get written.

## Lists need keys

items.map((item) => <li key={item.id}>{item.title}</li>)

A stable key lets React match items across renders. An index as key breaks as soon as the list reorders.`,
      },
      {
        title: "A database, a deploy and a domain",
        duration: "30 min",
        body: `The last lesson connects the pieces and puts them online.

## Talking to a database

SELECT id, title, price_inr FROM courses WHERE price_inr < $1

Always pass values as parameters, never by pasting them into the string. String building is how SQL injection happens, and it is not a theoretical risk.

## Environment variables

Secrets live in the environment, not the code. Locally in .env.local, in production in your host's dashboard. If a key is committed to git, rotate it; deleting the commit does not un-leak it.

## Deploy

Push to GitHub, import the repository on Vercel, add your environment variables, deploy. Every later push redeploys automatically. Your project gets a your-app.vercel.app address immediately and you can attach your own domain in Settings.

## The habit that matters

Ship small. One feature, deployed, checked on a phone, then the next. Big-bang launches teach you nothing until the very end.`,
      },
    ],
  },
  {
    slug: "digital-marketing-masterclass",
    title: "Digital Marketing Masterclass",
    subtitle: "Get found, get clicks, get customers, and measure it honestly.",
    description:
      "A working marketer's course: search, social, email and paid ads, taught around one small budget and one real funnel. Every module ends with a number you can check in your own analytics.",
    price_inr: 1999,
    list_price_inr: 4999,
    level: "Beginner",
    duration: "8 hours",
    accent: "#8a3b2e",
    icon: "chart",
    sort_order: 3,
    lessons: [
      {
        title: "Start with the customer, not the channel",
        duration: "20 min",
        body: `Most marketing fails before any ad runs, because nobody wrote down who they are talking to.

## One paragraph, five answers

Who is this for, what problem do they have, what do they use today, why is that not good enough, and what does success look like for them? Answer those in a paragraph and you have a positioning statement you can actually write copy from.

## Channels come after

Search suits demand that already exists. Social suits attention you can interrupt. Email suits people who already know you. Choosing a channel before knowing the problem is how budgets disappear.

## The measurement you will need

Decide now what one conversion is: a purchase, a signup, a reply. Everything else is a supporting metric. If you cannot name one, no dashboard will help.`,
      },
      {
        title: "SEO without the myths",
        duration: "26 min",
        body: `Search engines want to show the page that best answers the query. Everything that works follows from that sentence.

## Keyword intent

"buy running shoes online" and "how to choose running shoes" are different jobs. A product page cannot serve the second one. Match the page type to the intent, then write.

## The page that ranks

One clear topic per page. The phrase the searcher typed appears in the title, the first paragraph and at least one heading, written naturally. Real answers to the real question, longer than the competition only if it needs to be.

## Technical basics that actually block you

Pages must load fast, work on a phone, and be reachable by links. A page nothing links to is invisible. Add a sitemap, keep URLs readable, and never block crawlers by accident in robots.txt.

## What to ignore

Keyword density targets, secret tricks, buying links. They either do nothing or cost you the site.`,
      },
      {
        title: "Content that earns attention",
        duration: "24 min",
        body: `Content works when it is specific, useful and made for one reader.

## The three formats that carry most results

A how-to that solves one exact problem. A comparison that helps someone choose. A teardown or case note that shows your thinking with real numbers. Everything else is optional.

## Structure beats cleverness

Put the answer in the first two lines, then the detail. People scan, then decide whether to read. A long introduction that delays the answer loses most readers before the useful part.

## Cadence you can keep

One solid piece a week beats five thin ones, and it is sustainable. Consistency compounds because readers and search engines both learn what to expect from you.

## Repurpose deliberately

A long piece becomes a short video, three social posts and one email. Do not rewrite from scratch; cut the same idea for each surface.`,
      },
      {
        title: "Paid ads on a small budget",
        duration: "28 min",
        body: `Paid is the fastest way to learn whether your message works. Spend to learn, then scale what proved itself.

## Structure

One campaign per objective, a few tightly themed ad sets, two or three creatives each. Narrow targeting beats broad guessing when the budget is small.

## The numbers

Cost per click, click-through rate, conversion rate, cost per acquisition. Know your break-even cost per acquisition before you spend a rupee: if a sale earns you 800 in margin, anything above that is a loss, however good the traffic looks.

## Creative is the lever

The image and the first line do more than any bidding tweak. Test the promise, not the button colour. Change one thing at a time or you learn nothing.

## Kill fast, scale slow

Give a test enough spend for a real signal, often a few hundred rupees and a couple of days, then stop the losers without sentiment. Raise budget on winners in steps so learning does not reset.`,
      },
    ],
  },
  {
    slug: "excel-and-data-analysis",
    title: "Excel & Data Analysis for Work",
    subtitle: "Clean messy data, build reports, and answer questions fast.",
    description:
      "The spreadsheet skills that get used every week: lookups, pivots, cleaning, and charts that say one thing clearly. Built for people who inherit other people's spreadsheets.",
    price_inr: 999,
    list_price_inr: 2499,
    level: "Beginner",
    duration: "5 hours",
    accent: "#5a4b8a",
    icon: "table",
    sort_order: 4,
    lessons: [
      {
        title: "Structure first, formulas second",
        duration: "18 min",
        body: `A messy sheet cannot be rescued by clever formulas. Fix the shape first.

## The rules

One table per sheet. One header row, no merged cells. One fact per column, one record per row. No blank rows inside data and no totals mixed in with records. Follow these and every tool you own starts working.

## Text that should be numbers

Numbers stored as text do not sum. Check the alignment: text sits left by default, numbers right. Convert with Data, Text to Columns, or VALUE() when it is a formula problem.

## Dates are numbers

A date is a count of days since a fixed point. That is why subtracting two dates gives a number of days, and why a date imported as text breaks every calculation downstream.

## Keep a raw copy

Never clean the only copy. Work on a duplicate sheet named raw, and do all transformations on another. When a number looks wrong later, you can go back.`,
      },
      {
        title: "Lookups that do not break",
        duration: "22 min",
        body: `VLOOKUP is the classic and it has one flaw: it breaks when a column is inserted. XLOOKUP (or INDEX with MATCH) does not.

## The modern way

=XLOOKUP(A2, Customers!A:A, Customers!C:C, "not found")

Find the value in the first range, return the matching value from the third, show the fourth when nothing matches. The not-found argument is not optional in good practice: a blank result hides errors.

## The older way, safely

=INDEX(Customers!C:C, MATCH(A2, Customers!A:A, 0))

The zero at the end means exact match. Leave it out and Excel assumes sorted data, then returns quietly wrong answers, which is worse than an error.

## Why yours returns N/A

Trailing spaces, numbers stored as text, a value that exists in both sheets but with different casing. Wrap the lookup key in TRIM(), and check the type of both sides before blaming the formula.`,
      },
      {
        title: "Pivot tables and the questions they answer",
        duration: "26 min",
        body: `A pivot table is a group-by you can drag. It answers most "what is happening in this data" questions in under a minute.

## The build

Select the table, Insert, PivotTable. Rows get the thing you are grouping by (region, month, product). Values get the number you are summing (revenue). Columns split it further only when you need the extra dimension.

## Right-click does the work

Show Values As gives percent of total, running total, difference from previous. Grouping a date field by month or quarter is one right-click and saves a column of formulas.

## Refresh is not automatic

A pivot does not see new rows until you refresh. If a report looks stale, this is nearly always why. Right-click, Refresh, or refresh all on open.

## When a pivot is the wrong tool

If you need the result to update inside another formula, or to live in a fixed cell for a dashboard, use SUMIFS instead. Pivots are for exploring; formulas are for building.`,
      },
      {
        title: "Charts and reports people read",
        duration: "24 min",
        body: `A chart has one job: make one comparison obvious in three seconds.

## Pick by question

Change over time is a line. Comparison across categories is a bar. Part of a whole is a single stacked bar, not a pie with nine slices. If the question is "which is biggest", sort the bar chart, always.

## Remove everything that is not data

Gridlines, borders, a legend for one series, the title "Chart 1". Every mark that is not carrying information is competing with the marks that are. Label directly where you can.

## Numbers need context

A line that rises 2% and a line that rises 200% look identical until you fix the axis. Start bar charts at zero; say so when a line chart does not.

## The one-page report

Question at the top, one chart, three sentences of what it means, and the number that decides the next action. Anything longer is a document, not a report, and will not be read on a Monday.`,
      },
    ],
  },
];
