import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import { z } from "zod";

/**
 * POST /api/submit — contact + enquiry form endpoint for the DEPLOYED site.
 *
 * Deliberately SELF-CONTAINED: no imports from ../server — serverless
 * bundlers handle node_modules imports reliably, but relative ESM imports
 * across directories crash at cold start (the earlier FUNCTION_INVOCATION_FAILED).
 * The validation rules and email template mirror server/submit-core.ts so
 * local dev and production behave identically.
 *
 * Required Vercel env vars (Project Settings → Environment Variables):
 *   EMAIL_USER      — Gmail address that sends the alerts
 *   EMAIL_PASSWORD  — Gmail App Password (not the login password)
 *   RECEIVER_EMAIL  — inbox that receives the submissions
 */

const submissionSchema = z.object({
  variant: z.enum(["contact", "enquiry"]),

  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name is too long"),

  email: z
    .email("Enter a valid email")
    .max(200, "Email is too long"),

  phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long")
    .optional()
    .default(""),

  interest: z
    .string()
    .trim()
    .max(80, "Interest is too long")
    .optional()
    .default(""),

  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(4000, "Message is too long"),
});

type Submission = z.infer<typeof submissionSchema>;

function emailConfigured() {
  return Boolean(
    process.env.EMAIL_USER &&
      process.env.EMAIL_PASSWORD &&
      process.env.RECEIVER_EMAIL
  );
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char] ?? char
  );
}

function row(label: string, value?: string) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:7px 16px 7px 0;font-weight:700;color:#2E1F14;white-space:nowrap;vertical-align:top;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:7px 0;color:#5C4636;white-space:pre-wrap;">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

async function deliverByEmail(data: Submission, submittedAt: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.verify();

  const isEnquiry = data.variant === "enquiry";

  const subject = isEnquiry
    ? `New enquiry — ${data.name}${data.interest ? ` (${data.interest})` : ""}`
    : `New contact message — ${data.name}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;">
      <h2 style="color:#2E1F14;margin:0 0 4px;">
        ${isEnquiry ? "New product enquiry" : "New contact message"}
      </h2>
      <p style="color:#8a7364;margin:0 0 14px;font-size:13px;">
        Ideal Food Products — received
        ${escapeHtml(
          new Date(submittedAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })
        )}
        IST
      </p>
      <table style="border-collapse:collapse;font-size:14px;width:100%;">
        ${row("Name", data.name)}
        ${row("Email", data.email)}
        ${row("Phone", data.phone)}
        ${row("Interest", data.interest)}
        ${row("Message", data.message)}
      </table>
      <p style="color:#8a7364;font-size:12px;margin-top:18px;">
        Reply directly to this email to answer ${escapeHtml(data.name)}.
      </p>
    </div>
  `;

  const text = [
    isEnquiry ? "NEW ENQUIRY" : "NEW CONTACT MESSAGE",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : "",
    data.interest ? `Interest: ${data.interest}` : "",
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  const info = await transporter.sendMail({
    from: `"Ideal Foods Website" <${process.env.EMAIL_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    replyTo: data.email,
    subject,
    text,
    html,
  });

  console.log("[submission] Email sent successfully:", info.messageId);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Basic CORS so the function also works if the site is ever served
  // from a different origin than the API.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const parsed = submissionSchema.safeParse(req.body);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      ok: false,
      error: "Please check the form fields and try again.",
      issues,
    });
  }

  const submittedAt = new Date().toISOString();

  // Always log the validated submission so it is retrievable from the
  // Vercel function logs even if email delivery is not configured yet.
  console.log("[submission]", JSON.stringify({ submittedAt, ...parsed.data }));

  if (!emailConfigured()) {
    console.warn(
      "[submission] EMAIL_USER/EMAIL_PASSWORD/RECEIVER_EMAIL not set; submission logged only."
    );
    return res.status(200).json({
      ok: true,
      delivered: "log",
      message: "Your message has been submitted successfully.",
    });
  }

  try {
    await deliverByEmail(parsed.data, submittedAt);

    return res.status(200).json({
      ok: true,
      delivered: "email",
      message: "Your message has been submitted successfully.",
    });
  } catch (error) {
    console.error("[submission] email delivery failed:", error);

    return res.status(502).json({
      ok: false,
      error:
        "We couldn't send your message right now. Please try again, or email us directly at idealfoods@rediffmail.com.",
    });
  }
}
