import type { IncomingMessage, ServerResponse } from "node:http";
import { processSubmission, submissionSchema } from "../server/submit-core";

/**
 * Vercel serverless function — POST /api/submit.
 * Shares the exact validation + email logic with the Express dev/Netlify route
 * (server/submit-core.ts), so dev and production behave identically.
 */
export default async function handler(
  req: IncomingMessage & { method?: string; body?: unknown },
  res: ServerResponse & { status(code: number): unknown; json(body: unknown): void },
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const parsed = submissionSchema.safeParse(req.body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
    return res.status(400).json({ ok: false, error: "Please check the form fields and try again.", issues });
  }

  try {
    const result = await processSubmission(parsed.data);
    return res.json({ ok: true, delivered: result.delivered });
  } catch (err) {
    console.error("[submission] email delivery failed:", err);
    return res.status(502).json({
      ok: false,
      error: "We couldn't send your message right now. Please try again, or email us directly at idealfoods@rediffmail.com.",
    });
  }
}
