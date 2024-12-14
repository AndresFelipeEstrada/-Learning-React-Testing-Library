import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTest.ts"],
    coverage: {
      exclude: [
        "**/*.config.ts",
        "**/*.config.js",
        "**/*.types.ts",
        "**/*d.",
        "**/types",
        "**/App.tsx",
        "**/main.tsx",
      ],
    },
  },
});
