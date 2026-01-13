import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build", // CRA's default build output
  },
  test: {
    globals: true, // Optional: if you want global APIs like describe, test, etc.
    environment: "jsdom",
    coverage: {
      // Include covered and uncovered files matching this pattern:
      include: ["packages/**/src/**.{js,jsx,ts,tsx}"],

      // Exclusion is applied for the files that match include pattern above
      // No need to define root level *.config.ts files or node_modules, as we didn't add those in include
      exclude: ["**/some-pattern/**"],
    },
  },
});
