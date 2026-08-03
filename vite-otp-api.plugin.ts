import type { IncomingMessage, ServerResponse } from "node:http";
import { loadEnv, type Plugin } from "vite";
import type { VercelRequest, VercelResponse } from "@vercel/node";

async function readJsonBody(
  req: IncomingMessage
): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function createVercelRes(res: ServerResponse): VercelResponse {
  let statusCode = 200;
  const headers: Record<string, string> = {};

  const api = {
    status(code: number) {
      statusCode = code;
      return api;
    },
    setHeader(name: string, value: string | number | readonly string[]) {
      headers[name] = String(value);
      return api;
    },
    json(payload: unknown) {
      const body = JSON.stringify(payload);
      res.writeHead(statusCode, {
        ...headers,
        "Content-Type": "application/json",
      });
      res.end(body);
      return api;
    },
    end(chunk?: unknown) {
      res.writeHead(statusCode, headers);
      res.end(chunk == null ? undefined : String(chunk));
      return api;
    },
  };

  return api as unknown as VercelResponse;
}

/**
 * Serves /api/send-otp and /api/verify-otp during `npm run dev`
 * (Vercel serverless handlers are not available under plain Vite).
 */
export function otpApiDevPlugin(mode: string): Plugin {
  return {
    name: "zephyr-otp-api-dev",
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), "");
      for (const [key, value] of Object.entries(env)) {
        process.env[key.replace(/^\uFEFF/, "")] = value;
      }

      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0];
        if (path !== "/api/send-otp" && path !== "/api/verify-otp") {
          next();
          return;
        }

        try {
          const body = await readJsonBody(req);
          const vercelReq = {
            method: req.method,
            body,
            headers: req.headers,
            query: {},
          } as VercelRequest;
          const vercelRes = createVercelRes(res);

          if (path === "/api/send-otp") {
            const { default: handler } = await server.ssrLoadModule(
              "/api/send-otp.ts"
            );
            await handler(vercelReq, vercelRes);
            return;
          }

          const { default: handler } = await server.ssrLoadModule(
            "/api/verify-otp.ts"
          );
          await handler(vercelReq, vercelRes);
        } catch (err) {
          console.error("[otp-api-dev]", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: "Local OTP API failed. Check server logs and .env.",
              })
            );
          }
        }
      });
    },
  };
}
