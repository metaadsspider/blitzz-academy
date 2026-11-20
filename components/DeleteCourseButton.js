"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteCourseButton({ id, title, buyers }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    const warning =
      buyers > 0
        ? `"${title}" has ${buyers} buyer(s). Deleting is blocked while orders exist — the server will refuse.`
        : `Delete "${title}"? This cannot be undone.`;
    if (!confirm(warning)) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not delete the course.");
      }
      router.refresh();
    } catch {
      alert("Network error while deleting.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className="copy-btn" onClick={remove} disabled={busy}>
      {busy ? "…" : "Delete"}
    </button>
  );
}
