import nodemailer from "nodemailer";
import { z } from "zod";
import dotenv from "dotenv";

// Honour local overrides (gitignored) on top of the committed `.env`.
// On Vercel/Netlify the dashboard env vars take precedence automatically.
dotenv.config({ path: ".env.local", override: true });

export const submissionSchema = z.object({
  variant: z.enum(["contact", "enquiry"]),
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.email("Enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  interest: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(1, "Message is required").max(4000),
});

export type Submission = z.infer<typeof submissionSchema>;

/** True when real SMTP credentials are present (dummy "your-…" values don't count). */
function smtpConfigured(): boolean {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && !SMTP_USER.includes("your-"));
}

function escapeHtml(v: string): string {
  return v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
}

function row(label: string, value?: string): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:7px 16px 7px 0;font-weight:700;color:#2E1F14;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:7px 0;color:#5C4636;white-space:pre-wrap">${escapeHtml(value)}</td>
  </tr>`;
}

export async function processSubmission(data: Submission): Promise<{ delivered: "email" | "log" }> {
  const submittedAt = new Date().toISOString();

  // Always log — platform logs (Vercel/Netlify dashboard) keep a durable copy
  // of every submission even if the email step fails.
  console.log("[submission]", JSON.stringify({ submittedAt, ...data }));

  if (!smtpConfigured()) {
    console.log("[submission] SMTP not configured yet — recorded in logs only. Set SMTP_* env vars to enable email alerts.");
    return { delivered: "log" };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER as string, pass: process.env.SMTP_PASS as string },
  });

  const isEnquiry = data.variant === "enquiry";
  const subject = isEnquiry
    ? `New enquiry — ${data.name}${data.interest ? ` (${data.interest})` : ""}`
    : `New contact message — ${data.name}`;

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px">
    <h2 style="color:#2E1F14;margin:0 0 4px">${isEnquiry ? "New product enquiry" : "New contact message"}</h2>
    <p style="color:#8a7364;margin:0 0 14px;font-size:13px">idealfoods.example — received ${escapeHtml(new Date(submittedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))} IST</p>
    <table style="border-collapse:collapse;font-size:14px">
      ${row("Name", data.name)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Interest", data.interest)}
      ${row("Message", data.message)}
    </table>
    <p style="color:#8a7364;font-size:12px;margin-top:18px">Reply directly to this email to answer ${escapeHtml(data.name)}.</p>
  </div>`;

  const text = [
    isEnquiry ? "NEW ENQUIRY" : "NEW CONTACT MESSAGE",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone && `Phone: ${data.phone}`,
    data.interest && `Interest: ${data.interest}`,
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({
    from: `"Ideal Foods Website" <${process.env.SMTP_USER}>`,
    to: process.env.ALERT_TO || "idealfoods@rediffmail.com",
    replyTo: data.email,
    subject,
    text,
    html,
  });

  return { delivered: "email" };
}
