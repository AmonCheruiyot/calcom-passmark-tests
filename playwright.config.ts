import { defineConfig, devices } from "@playwright/test";
import { appConfig } from "./helpers/config";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 120_000,
  reporter: [
    ["html", { open: "never", outputFolder: "reports/test-results/html-report" }],
    ["list"]
  ],
  use: {
    baseURL: appConfig.calcom.baseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 30_000,
    navigationTimeout: 45_000,
    viewport: { width: 1440, height: 1080 }
  },
  outputDir: "reports/test-results/artifacts",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});

