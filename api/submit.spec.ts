import { describe, expect, it, vi } from "vitest";
import submitHandler from "./submit";
import pingHandler from "./ping";

/**
 * Minimal stand-ins for VercelRequest/VercelResponse — the handler only uses
 * method, body, setHeader and the status/json/end helpers.
 */
function makeRes() {
  const res: any = {
    statusCode: 0,
    body: undefined as unknown,
    headers: {} as Record<string, string>,
    setHeader(k: string, v: string) {
      res.headers[k] = v;
      return res;
    },
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
      return res;
    },
    end() {
      return res;
    },
  };
  return res;
}

function makeReq(method: string, body?: unknown) {
  return { method, body } as any;
}

describe("api/submit handler", () => {
  it("answers OPTIONS preflight with 204", async () => {
    const res = makeRes();
    await submitHandler(makeReq("OPTIONS"), res);
    expect(res.statusCode).toBe(204);
  });

  it("rejects GET with a clean 405 JSON (this used to crash the deploy)", async () => {
    const res = makeRes();
    await submitHandler(makeReq("GET"), res);
    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ ok: false, error: "Method not allowed" });
  });

  it("returns 400 with per-field issues for invalid payloads", async () => {
    const res = makeRes();
    await submitHandler(
      makeReq("POST", { variant: "contact", email: "not-an-email", message: "" }),
      res
    );
    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    const paths = res.body.issues.map((i: any) => i.path);
    expect(paths).toContain("name");
    expect(paths).toContain("email");
    expect(paths).toContain("message");
  });

  it("accepts a valid submission with 200 ok (log mode when email is unconfigured)", async () => {
    // Vitest inherits .env.local via Vite — strip the mail vars so the
    // handler takes its deterministic log-only path (no network).
    const saved = {
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
      RECEIVER_EMAIL: process.env.RECEIVER_EMAIL,
    };
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASSWORD;
    delete process.env.RECEIVER_EMAIL;

    try {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const log = vi.spyOn(console, "log").mockImplementation(() => {});

      const res = makeRes();
      await submitHandler(
        makeReq("POST", {
          variant: "enquiry",
          name: "Preeti",
          email: "preeti@example.com",
          phone: "9845908686",
          interest: "Syrups",
          message: "Hello",
        }),
        res
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.delivered).toBe("log");

      warn.mockRestore();
      log.mockRestore();
    } finally {
      Object.assign(process.env, saved);
    }
  }, 10000);
});

describe("api/ping handler", () => {
  it("responds 200 with service info", async () => {
    const res = makeRes();
    await pingHandler(makeReq("GET"), res);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.service).toBe("ideal-foods-api");
    expect(typeof res.body.emailConfigured).toBe("boolean");
  });
});
