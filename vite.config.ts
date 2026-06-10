import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base must match the GitHub repo name — the site is served from
// https://jackjames-cs.github.io/wc26-sweepstakes/
export default defineConfig({
  base: "/wc26-sweepstakes/",
  plugins: [react(), tailwindcss()],
});
