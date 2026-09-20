import type { Request, Response } from "express";
import { processSubmission, submissionSchema } from "../submit-core";

/** POST /api/submit — contact + enquiry form submissions. */
export async function handleSubmit(req: Request, res: Response) {
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
