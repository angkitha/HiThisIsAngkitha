import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages project site: https://angkitha.github.io/HiThisIsAngkitha/
  base: "/HiThisIsAngkitha/",
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
