import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Form preview mode (src/lib/preview.ts) is allowed on Vercel preview
    // deployments, never on production. Vercel sets VERCEL_ENV during builds.
    __FORM_PREVIEW_ALLOWED__: JSON.stringify(process.env.VERCEL_ENV === "preview"),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
