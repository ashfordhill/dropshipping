import { defineConfig, devices } from "@playwright/test";

const previewUrl = "http://127.0.0.1:8787";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: previewUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "mobile",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: {
    command: "npm run build && npm run preview -- --port 8787 --host 127.0.0.1",
    url: previewUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
