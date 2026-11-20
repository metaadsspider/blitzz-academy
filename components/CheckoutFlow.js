"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const money = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function CheckoutFlow({ slug, title, amount, user }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    utr: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(data.error || "Could not start checkout.");
          return;
        }
        setOrder(data);
      } catch {
        if (!cancelled) setLoadError("Network error while preparing the payment.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(order.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function confirm(e) {
    e.preventDefault();
    setError("");

    const utr = form.utr.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (utr.length < 8) {
      setError("Enter the full UTR / reference number from your UPI app (at least 8 characters).");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid phone number with at least 10 digits.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId, ...form, utr }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not confirm the payment.");
        setBusy(false);
        return;
      }
      router.push(`/learn/${data.slug}`);
      router.refresh();
    } catch {
      setError("Network error. Your UTR was not saved — please try again.");
      setBusy(false);
    }
  }

  if (loadError) {
    return (
      <div className="narrow">
        <div className="alert alert-error">{loadError}</div>
      </div>
    );
  }

  return (
    <div className="checkout-grid">
      <section className="pay-panel">
        <h2>1. Pay {money(amount)} by UPI</h2>
        <p className="pay-to">
          Scan this with any UPI app — GPay, PhonePe, Paytm, BHIM or your bank app.
        </p>

        <div className="qr-wrap">
          {order ? (
            <img src={order.qr} alt="UPI payment QR code" width={240} height={240} />
          ) : (
            <div
              style={{
                width: 240,
                height: 240,
                display: "grid",
                placeItems: "center",
                color: "var(--ink-3)",
                fontSize: 13,
              }}
            >
              Preparing QR…
            </div>
          )}
          <div className="amount-big">{money(amount)}</div>
          <div className="qr-apps">Amount is fixed. Do not edit it in your app.</div>
        </div>

        {order && (
          <>
            <div className="upi-line">
              <span>{order.upiId}</span>
              <button type="button" className="copy-btn" onClick={copyUpi}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="qr-apps" style={{ marginTop: 10 }}>
              Paying to {order.payeeName}
            </p>
            <a
              href={order.upiLink}
              className="btn btn-gold btn-block"
              style={{ marginTop: 14 }}
            >
              Open UPI app on this phone
            </a>
          </>
        )}

        <ol className="steps-mini">
          <li>Pay the exact amount shown above.</li>
          <li>Open the payment in your UPI app and copy the UTR / reference number.</li>
          <li>Paste it in the form and press confirm. The course unlocks at once.</li>
        </ol>
      </section>

      <section className="pay-panel">
        <h2>2. Confirm your purchase</h2>

        <div className="order-summary">
          <div className="row">
            <span>Course</span>
            <span style={{ textAlign: "right" }}>{title}</span>
          </div>
          <div className="row">
            <span>Payment method</span>
            <span>UPI</span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span>{money(amount)}</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={confirm} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" value={form.name} onChange={set("name")} required />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={set("email")}
              required
            />
            <div className="hint">Your receipt and course updates go here.</div>
          </div>

          <div className="field">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={set("phone")}
              required
            />
            <div className="hint">The number you paid from, if possible.</div>
          </div>

          <div className="field">
            <label htmlFor="utr">UTR / UPI reference number</label>
            <input
              id="utr"
              value={form.utr}
              onChange={set("utr")}
              placeholder="e.g. 412345678901"
              autoComplete="off"
              spellCheck={false}
              style={{ fontFamily: "ui-monospace, Menlo, monospace", letterSpacing: "0.06em" }}
              required
            />
            <div className="hint">
              12 digits for most banks. Find it in the payment details inside your UPI app.
            </div>
          </div>

          <div className="form-foot">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={busy || !order}
            >
              {busy ? "Confirming…" : "Confirm payment & get access"}
            </button>
          </div>
        </form>

        <p className="qr-apps" style={{ marginTop: 14, textAlign: "left" }}>
          Access is granted as soon as you confirm. Your order keeps the UTR on record,
          so keep the payment in your app until the course opens.
        </p>
      </section>
    </div>
  );
}
