"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm({ next }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create the account.");
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
        <h1>Create your account</h1>
        <p className="sub">
          One account for every course you buy. Already registered?{" "}
          <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}>
            Log in
          </Link>
          .
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={set("name")}
              placeholder="As you would like it on the certificate"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={set("phone")}
              placeholder="10-digit mobile number"
              required
            />
            <div className="hint">
              Used to match your UPI payment to your order.
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={set("password")}
              placeholder="At least 6 characters"
              required
            />
          </div>

          <div className="form-foot">
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Creating account…" : "Create account"}
            </button>
          </div>
        </form>

        <p className="alt-line">
          By registering you agree to our{" "}
          <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>, and to receive
          course-related emails from us.
        </p>
      </div>
    </div>
  );
}
