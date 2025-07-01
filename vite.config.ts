/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true, // use global test/expect without import
    environment: "jsdom", // simulate browser environment
    setupFiles: "./src/setupTests.ts", // optional, for jest-dom matchers setup
  },
});
