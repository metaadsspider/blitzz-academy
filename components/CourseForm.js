"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const blankLesson = () => ({ title: "", duration: "", body: "" });

export default function CourseForm({ course }) {
  const router = useRouter();
  const isNew = !course;

  const [form, setForm] = useState({
    title: course?.title || "",
    slug: course?.slug || "",
    subtitle: course?.subtitle || "",
    description: course?.description || "",
    price_inr: course?.price_inr ?? 999,
    list_price_inr: course?.list_price_inr ?? 0,
    level: course?.level || "Beginner",
    duration: course?.duration || "",
    accent: course?.accent || "#14304a",
    icon: course?.icon || "book",
    sort_order: course?.sort_order ?? 10,
  });

  const [lessons, setLessons] = useState(
    Array.isArray(course?.lessons) && course.lessons.length
      ? course.lessons.map((l) => ({
          title: l.title || "",
          duration: l.duration || "",
          body: l.body || "",
        }))
      : [blankLesson()]
  );

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [okMsg, setOkMsg] = useState("");

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function setLesson(i, key) {
    return (e) =>
      setLessons((ls) => ls.map((l, idx) => (idx === i ? { ...l, [key]: e.target.value } : l)));
  }

  function autoSlug() {
    const s = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setForm((f) => ({ ...f, slug: s }));
  }

  async function save(e) {
    e.preventDefault();
    setError("");
    setOkMsg("");
    setBusy(true);
    try {
      const payload = {
        ...form,
        price_inr: Number(form.price_inr) || 0,
        list_price_inr: Number(form.list_price_inr) || 0,
        sort_order: Number(form.sort_order) || 0,
        lessons: lessons.filter((l) => l.title.trim() !== ""),
      };
      const res = await fetch(
        isNew ? "/api/admin/courses" : `/api/admin/courses/${course.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save the course.");
        setBusy(false);
        return;
      }
      if (isNew) {
        router.push(`/admin/courses/${data.id}`);
      } else {
        setOkMsg("Saved.");
        router.refresh();
      }
      setBusy(false);
    } catch {
      setError("Network error while saving.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="course-form">
      {error && <div className="alert alert-error">{error}</div>}
      {okMsg && <div className="alert alert-ok">{okMsg}</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 className="form-h">Course details</h2>

        <div className="grid-2">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" value={form.title} onChange={set("title")} required />
          </div>
          <div className="field">
            <label htmlFor="slug">URL slug</label>
            <input
              id="slug"
              value={form.slug}
              onChange={set("slug")}
              placeholder="python-from-zero"
              required
            />
            <div className="hint">
              Appears in the address: /courses/<strong>{form.slug || "your-slug"}</strong>
              {" "}
              <button type="button" className="copy-btn" onClick={autoSlug}>
                Build from title
              </button>
            </div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="subtitle">One-line subtitle</label>
          <input id="subtitle" value={form.subtitle} onChange={set("subtitle")} />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={set("description")}
          />
        </div>

        <div className="grid-3">
          <div className="field">
            <label htmlFor="price">Price (₹)</label>
            <input
              id="price"
              type="number"
              min="0"
              value={form.price_inr}
              onChange={set("price_inr")}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="listprice">Was (₹)</label>
            <input
              id="listprice"
              type="number"
              min="0"
              value={form.list_price_inr}
              onChange={set("list_price_inr")}
            />
            <div className="hint">0 hides the strikethrough price.</div>
          </div>
          <div className="field">
            <label htmlFor="sort">Order</label>
            <input
              id="sort"
              type="number"
              value={form.sort_order}
              onChange={set("sort_order")}
            />
            <div className="hint">Lower numbers show first.</div>
          </div>
        </div>

        <div className="grid-3">
          <div className="field">
            <label htmlFor="level">Level</label>
            <input id="level" value={form.level} onChange={set("level")} />
          </div>
          <div className="field">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              value={form.duration}
              onChange={set("duration")}
              placeholder="6 hours"
            />
          </div>
          <div className="field">
            <label htmlFor="accent">Accent colour</label>
            <input
              id="accent"
              type="color"
              value={form.accent}
              onChange={set("accent")}
              style={{ height: 44, padding: 4 }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="form-h">Lessons ({lessons.length})</h2>
        <p className="hint" style={{ marginTop: -8, marginBottom: 18 }}>
          Leave a blank line between paragraphs. Start a line with <code>## </code>
          to make a subheading. Code blocks render automatically.
        </p>

        {lessons.map((lesson, i) => (
          <div className="lesson-editor" key={i}>
            <div className="lesson-editor-head">
              <strong>Lesson {i + 1}</strong>
              <button
                type="button"
                className="copy-btn"
                onClick={() => setLessons((ls) => ls.filter((_, idx) => idx !== i))}
                disabled={lessons.length === 1}
              >
                Remove
              </button>
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Title</label>
                <input value={lesson.title} onChange={setLesson(i, "title")} />
              </div>
              <div className="field">
                <label>Duration</label>
                <input
                  value={lesson.duration}
                  onChange={setLesson(i, "duration")}
                  placeholder="20 min"
                />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Body</label>
              <textarea
                rows={8}
                value={lesson.body}
                onChange={setLesson(i, "body")}
                placeholder={"What this lesson covers.\n\n## A subheading\n\nMore detail here."}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => setLessons((ls) => [...ls, blankLesson()])}
        >
          + Add lesson
        </button>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Saving…" : isNew ? "Create course" : "Save changes"}
        </button>
        <a href="/admin/courses" className="btn btn-outline">
          Back to list
        </a>
      </div>
    </form>
  );
}
