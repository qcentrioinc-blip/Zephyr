import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { otpApiDevPlugin } from "./vite-otp-api.plugin";
import type { Plugin } from "vite";

/** Filenames use literal `+`; some clients request `%2B` and Vite then serves index.html. */
function decodePlusInPublicUrls(): Plugin {
  return {
    name: "decode-plus-in-public-urls",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url?.includes("%2B") || req.url?.includes("%2b")) {
          req.url = req.url.replace(/%2B/gi, "+");
        }
        next();
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

  return {
    base: "/",
    publicDir: "public",
    plugins: [decodePlusInPublicUrls(), react(), tailwindcss(), otpApiDevPlugin(mode)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
