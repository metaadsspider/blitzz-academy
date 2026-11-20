"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrdersTable({ rows }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);

  async function revoke(orderId) {
    if (!confirm("Revoke access for this order and remove the course from the buyer?")) return;
    setBusyId(orderId);
    try {
      const res = await fetch("/api/admin/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not revoke this order.");
      }
      router.refresh();
    } catch {
      alert("Network error while revoking.");
    } finally {
      setBusyId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button type="button" className="btn btn-outline btn-sm" onClick={logout}>
          Sign out of admin
        </button>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Buyer</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Amount</th>
              <th>UTR</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="mono">#{r.id}</td>
                <td>{r.created}</td>
                <td>
                  <div>{r.name}</div>
                  <div style={{ color: "var(--ink-3)" }}>{r.email}</div>
                </td>
                <td className="mono">{r.phone}</td>
                <td>{r.course}</td>
                <td>₹{Number(r.amount).toLocaleString("en-IN")}</td>
                <td className="mono">{r.utr || "—"}</td>
                <td>
                  <span className={r.status === "paid" ? "tag tag-paid" : "tag tag-pending"}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.status !== "revoked" && (
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() => revoke(r.id)}
                      disabled={busyId === r.id}
                    >
                      {busyId === r.id ? "…" : "Revoke"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 28, color: "var(--ink-3)" }}>
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
