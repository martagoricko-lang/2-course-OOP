import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        object2: resolve(import.meta.dirname, "object2.html"),
        object3: resolve(import.meta.dirname, "object3.html"),
      },
    },
  },
});
