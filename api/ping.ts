import type { VercelRequest, VercelResponse } from "@vercel/node";

/** GET /api/ping — liveness check for the deployed API functions. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  return res.status(200).json({
    ok: true,
    service: "ideal-foods-api",
    time: new Date().toISOString(),
    emailConfigured: Boolean(
      process.env.EMAIL_USER &&
        process.env.EMAIL_PASSWORD &&
        process.env.RECEIVER_EMAIL
    ),
  });
}
