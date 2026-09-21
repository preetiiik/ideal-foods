import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  processSubmission,
  submissionSchema,
} from "../server/submit-core";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
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

  try {
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