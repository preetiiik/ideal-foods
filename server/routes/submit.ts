import type { Request, Response } from "express";
import {
  processSubmission,
  submissionSchema,
} from "../submit-core";

/**
 * POST /api/submit
 * Handles both contact and enquiry form submissions.
 */
export async function handleSubmit(
  req: Request,
  res: Response
) {
  // Validate incoming form data
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

  try {
    // Send email through the backend
    const result = await processSubmission(parsed.data);

    return res.status(200).json({
      ok: true,
      delivered: result.delivered,
      message: "Your message has been submitted successfully.",
    });
  } catch (error) {
    console.error(
      "[submission] email delivery failed:",
      error
    );

    return res.status(502).json({
      ok: false,
      error:
        "We couldn't send your message right now. Please try again, or email us directly at idealfoods@rediffmail.com.",
    });
  }
}