import QRCode from "qrcode";

/**
 * Build a standard UPI intent link. Every UPI app (GPay, PhonePe, Paytm,
 * BHIM, bank apps) understands this format.
 */
export function buildUpiLink({ amount, note, txnRef }) {
  const pa = process.env.UPI_ID || "yourname@upi";
  const pn = process.env.UPI_NAME || "Course Payment";
  const params = new URLSearchParams({
    pa,
    pn,
    am: Number(amount).toFixed(2),
    cu: "INR",
    tn: note || "Course purchase",
  });
  if (txnRef) params.set("tr", txnRef);
  return `upi://pay?${params.toString()}`;
}

export async function upiQrDataUrl(upiLink) {
  return QRCode.toDataURL(upiLink, {
    width: 460,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#14304a", light: "#ffffff" },
  });
}

/** UTR / UPI reference: 8-22 letters or digits, as banks print it. */
export function cleanUtr(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function isValidUtr(value) {
  return /^[A-Z0-9]{8,22}$/.test(cleanUtr(value));
}
