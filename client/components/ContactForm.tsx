import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const INTERESTS = ["Syrups", "Pickles", "Both", "Distributorship", "Bulk / institutional order"];

/** Field limits shared by the UI and the backend schema. */
const LIMITS = { name: 80, email: 120, phone: 15, message: 1200 };

/** Letters, spaces, dots, apostrophes and hyphens only — no digits/symbols/scripts. */
const NAME_RE = /^[A-Za-z][A-Za-z .'-]*$/;
/** Digits only, 7–15 chars (loose international, no +/spaces/dashes). */
const PHONE_RE = /^[0-9]{7,15}$/;
/** Exactly one @, no spaces, and a sensible user@domain.tld shape. */
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/**
 * Shared enquiry/contact form. On /contact it shows Name/Email/Message (as per
 * the reference site); on /enquiry it adds phone + interest fields for
 * bulk/distributorship enquiries.
 */
export default function ContactForm({ variant }: { variant: "contact" | "enquiry" }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delivered, setDelivered] = useState<"email" | "log">("email");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: INTERESTS[0],
    message: "",
  });

  /** Strip anything that doesn't belong in each field as the user types. */
  const sanitize = (k: keyof typeof form, raw: string): string => {
    switch (k) {
      case "name":
        return raw.replace(/[^A-Za-z .'-]/g, "").slice(0, LIMITS.name);
      case "phone":
        return raw.replace(/[^0-9]/g, "").slice(0, LIMITS.phone);
      case "email":
        return raw.replace(/\s/g, "").slice(0, LIMITS.email);
      case "message":
        return raw.slice(0, LIMITS.message);
      default:
        return raw;
    }
  };

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [k]: sanitize(k, e.target.value) }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    else if (!NAME_RE.test(form.name.trim())) errs.name = "Name can only contain letters.";
    if (!form.email.trim()) errs.email = "Please enter your email.";
    else if ((form.email.match(/@/g) ?? []).length !== 1 || !EMAIL_RE.test(form.email.trim()))
      errs.email = "Enter a valid email like name@example.com.";
    if (form.phone && !PHONE_RE.test(form.phone)) errs.phone = "Phone must be 7–15 digits (numbers only).";
    if (!form.message.trim()) errs.message = "Please write a short message.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!validate()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant, ...form }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.ok) {
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }
      setDelivered(body.delivered === "log" ? "log" : "email");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div
        className="flex flex-col items-center rounded-3xl bg-white/85 px-8 py-14 text-center"
        style={{ border: "1.5px solid rgba(107,191,122,0.55)", boxShadow: "0 18px 44px rgba(64,42,30,0.10)" }}
      >
        <CheckCircle2 size={52} strokeWidth={1.5} style={{ color: "#2F6B4F" }} />
        <h3 className="display-font mt-4" style={{ fontSize: 28, textTransform: "uppercase" }}>
          Message sent!
        </h3>
        <p className="body-ink mt-2" style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 380 }}>
          Thank you, {form.name || "friend"}. Our team will get back to you shortly at{" "}
          {form.email || "your email"}.
        </p>
        {delivered === "log" && (
          <p className="mt-3" style={{ fontSize: 12, lineHeight: 1.6, maxWidth: 380, color: "#8a7364" }}>
            (Email alerts aren't configured yet — your message is safely recorded.)
          </p>
 )}
        <button className="btn-outline-gold mt-6" onClick={() => setSent(false)}>
          Send another message
        </button>
      </div>
    );
  }

  const FieldError = ({ k }: { k: string }) =>
    fieldErrors[k] ? (
      <p className="mt-1.5" style={{ fontSize: 12, color: "#C2477F", lineHeight: 1.4 }}>
        {fieldErrors[k]}
      </p>
    ) : null;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl bg-white/85 p-6 sm:p-8"
      style={{ border: "1.5px solid rgba(64,42,30,0.12)", boxShadow: "0 18px 44px rgba(64,42,30,0.10)" }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#5C4636" }}>
            Name
          </label>
          <input
            id="cf-name"
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Your full name"
            maxLength={LIMITS.name}
            className="field-input mt-2"
          />
          <FieldError k="name" />
        </div>
        <div>
          <label htmlFor="cf-email" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#5C4636" }}>
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            required
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            maxLength={LIMITS.email}
            className="field-input mt-2"
          />
          <FieldError k="email" />
        </div>
      </div>

      {variant === "enquiry" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-phone" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#5C4636" }}>
              Phone
            </label>
            <input
              id="cf-phone"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={set("phone")}
              placeholder="9845908686"
              maxLength={LIMITS.phone}
              className="field-input mt-2"
            />
            <FieldError k="phone" />
          </div>
          <div>
            <label htmlFor="cf-interest" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#5C4636" }}>
              I'm interested in
            </label>
            <select id="cf-interest" value={form.interest} onChange={set("interest")} className="field-input mt-2">
              {INTERESTS.map((i) => (
                <option key={i} value={i} style={{ color: "#2E1F14" }}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="cf-message" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#5C4636" }}>
          Message
        </label>
        <textarea
          id="cf-message"
          required
          rows={variant === "enquiry" ? 5 : 4}
          value={form.message}
          onChange={set("message")}
          placeholder={variant === "enquiry" ? "Tell us quantities, city and timeline…" : "How can we help?"}
          maxLength={LIMITS.message}
          className="field-input mt-2"
          style={{ resize: "vertical" }}
        />
        <FieldError k="message" />
      </div>

      {error && (
        <p
          className="mt-4 rounded-xl"
          style={{
            border: "1px solid rgba(194,71,127,0.4)",
            backgroundColor: "rgba(194,71,127,0.08)",
            color: "#A03068",
            fontSize: 13,
            lineHeight: 1.6,
            padding: "10px 14px",
          }}
          role="alert"
        >
          {error}
        </p>
      )}

      {/* <button type="submit" className="btn-solid-gold mt-6" disabled={sending} style={{ width: variant === "enquiry" ? "100%" : undefined, opacity: sending ? 0.7 : 1, cursor: sending ? "wait" : "pointer" }}>
        {sending ? "Sending…" : variant === "enquiry" ? "Send Enquiry" : "Submit"}
      </button> */}
      <button
  type="submit"
  className="btn-solid-gold mt-6"
  disabled={sending}
  style={{
    opacity: sending ? 0.7 : 1,
    cursor: sending ? "wait" : "pointer",
  }}
>
  {sending
    ? "Sending…"
    : variant === "enquiry"
      ? "Send Enquiry"
      : "Submit"}
</button>
    </form>
  );
}
