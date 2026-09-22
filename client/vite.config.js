import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["framer-motion", "react-markdown", "remark-gfm", "react-syntax-highlighter"],
          "vendor-map": ["leaflet"],
          "vendor-google": ["@react-oauth/google"],
          "vendor-utils": ["axios", "zustand"],
        },
      },
    },
  },
});
