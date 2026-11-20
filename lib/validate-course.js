// Shared validation for the admin course editor.

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateCourse(body) {
  const title = String(body.title || "").trim();
  const slug = String(body.slug || "").trim().toLowerCase();
  if (title.length < 3) return { error: "Title must be at least 3 characters." };
  if (!SLUG.test(slug)) {
    return {
      error: "Slug may only contain lowercase letters, numbers and single hyphens.",
    };
  }
  const price = Number(body.price_inr);
  if (!Number.isInteger(price) || price < 0) {
    return { error: "Price must be a whole number of rupees (0 or more)." };
  }
  const list = Number(body.list_price_inr) || 0;
  const lessons = Array.isArray(body.lessons) ? body.lessons : [];
  const clean = lessons
    .filter((l) => String(l?.title || "").trim() !== "")
    .map((l) => ({
      title: String(l.title).trim(),
      duration: String(l.duration || "").trim(),
      body: String(l.body || ""),
    }));

  return {
    values: {
      title,
      slug,
      subtitle: String(body.subtitle || "").trim(),
      description: String(body.description || "").trim(),
      price_inr: price,
      list_price_inr: Number.isInteger(list) && list >= 0 ? list : 0,
      level: String(body.level || "").trim(),
      duration: String(body.duration || "").trim(),
      accent: /^#[0-9a-fA-F]{6}$/.test(body.accent) ? body.accent : "#14304a",
      icon: String(body.icon || "book").trim() || "book",
      sort_order: Number(body.sort_order) || 0,
      lessons: clean,
    },
  };
}
