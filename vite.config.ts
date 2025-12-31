// vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import cssInjectedByJs from "vite-plugin-css-injected-by-js"; // <- the adult in the room

export default defineConfig({
  plugins: [react(), cssInjectedByJs()],
  build: {
    copyPublicDir: false,
    lib: {
      entry: "src/index.ts",
      name: "chronon-timeline",
      fileName: (format) => `chronon-timeline.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-virtuoso"],
    },
  },
});
