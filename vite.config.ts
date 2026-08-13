import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { otpApiDevPlugin } from "./vite-otp-api.plugin";

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
    plugins: [react(), tailwindcss(), otpApiDevPlugin(mode)],
  };
});
