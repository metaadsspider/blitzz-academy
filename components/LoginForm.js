"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm({ next }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not log you in.");
        setBusy(false);
        return;
      }
      router.push(next && next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <div className="narrow">
      <div className="card">
        <h1>Welcome back</h1>
        <p className="sub">
          New here?{" "}
          <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`}>
            Create an account
          </Link>
          .
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={set("password")}
              required
            />
          </div>

          <div className="form-foot">
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Logging in…" : "Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
