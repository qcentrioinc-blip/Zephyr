import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { otpApiDevPlugin } from "./vite-otp-api.plugin";
import type { Plugin } from "vite";

const PUBLIC_ASSET_PREFIXES = ["/product-images/", "/packaging/"] as const;

const MIME_BY_EXT: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

/** Decode each path segment the way publicAssetSrc encodes it. */
function decodeAssetPathname(pathname: string): string {
  return pathname
    .split("/")
    .map((segment) => {
      if (!segment) return segment;
      try {
        return decodeURIComponent(segment.replace(/%2B/gi, "+"));
      } catch {
        return segment.replace(/%2B/gi, "+");
      }
    })
    .join("/");
}

/**
 * Vite dev: encoded commas (%2C) and ampersands (%26) in /product-images paths
 * (e.g. "Hair, Skin & Nails") fall through to index.html. Serve the file directly.
 */
function serveEncodedPublicAssets(publicRoot: string): Plugin {
  return {
    name: "serve-encoded-public-assets",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url;
        if (!rawUrl || (req.method !== "GET" && req.method !== "HEAD")) return next();
        if (!PUBLIC_ASSET_PREFIXES.some((prefix) => rawUrl.startsWith(prefix))) {
          return next();
        }

        const q = rawUrl.indexOf("?");
        const pathname = decodeAssetPathname(q === -1 ? rawUrl : rawUrl.slice(0, q));
        const filePath = path.join(publicRoot, pathname);

        if (!filePath.startsWith(publicRoot + path.sep)) return next();
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return next();

        const ext = path.extname(filePath).toLowerCase();
        res.setHeader("Content-Type", MIME_BY_EXT[ext] ?? "application/octet-stream");
        res.setHeader("Cache-Control", "public, max-age=0");

        if (req.method === "HEAD") {
          res.end();
          return;
        }

        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
}

function applyEnv(mode: string) {
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    const cleanKey = key.replace(/^\uFEFF/, "");
    process.env[cleanKey] = value;
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  applyEnv(mode);
  const publicRoot = path.resolve(__dirname, "public");

  return {
    base: "/",
    publicDir: "public",
    plugins: [
      serveEncodedPublicAssets(publicRoot),
      react(),
      tailwindcss(),
      otpApiDevPlugin(mode),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
