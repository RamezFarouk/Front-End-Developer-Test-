import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "", // Empty string means relative paths for assets, crucial for WordPress
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false, // Combine all CSS into one file for easier WP enqueuing
    rollupOptions: {
      output: {
        entryFileNames: "assets/index.js",
        assetFileNames: "assets/[name].[ext]", // Simplify file names without hashes for easier static reference in WP demo
      },
    },
  },
});
