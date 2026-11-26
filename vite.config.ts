import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    // Pinned like the admin (5174) and farmer (5175) apps: under the root
    // `npm run dev` a port that drifted would collide with theirs.
    port: 5173,
    strictPort: true,
    // The app calls "/api" in development (see src/redux-store/apiSlice.ts);
    // this forwards it to localMart-BEE, so the browser never makes a
    // cross-origin request and no CORS entry is needed for the dev port.
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
