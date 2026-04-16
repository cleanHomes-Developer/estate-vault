import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    testTimeout: 30000,
    // Default to node; component tests override with @vitest-environment jsdom
    environment: "node",
    environmentMatchGlobs: [
      ["__tests__/components/**", "jsdom"],
      ["__tests__/pages/**", "jsdom"],
      ["__tests__/api/**", "node"],
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
