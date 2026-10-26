import { cloudflareTest } from "@cloudflare/vitest-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, defineProject } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      defineProject({
        plugins: [react()],
        test: {
          name: "client",
          environment: "jsdom",
          include: ["src/client/**/*.test.tsx"],
          setupFiles: ["src/client/test/setup.ts"],
        },
      }),
      defineProject({
        plugins: [
          cloudflareTest({
            wrangler: { configPath: "./wrangler.jsonc" },
          }),
        ],
        test: {
          name: "worker",
          include: ["src/worker/**/*.test.ts"],
        },
      }),
      defineProject({
        test: {
          name: "shared",
          environment: "node",
          include: ["src/shared/**/*.test.ts", "src/db/**/*.test.ts", "scripts/**/*.test.ts"],
        },
      }),
    ],
  },
});
