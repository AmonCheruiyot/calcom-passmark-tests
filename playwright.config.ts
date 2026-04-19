import dotenv from "dotenv";
import path from "path";
import { configure } from "passmark";
import { defineConfig, devices } from "@playwright/test";
import { appConfig } from "./helpers/config";

dotenv.config({ path: path.resolve(__dirname, ".env") });

configure({
  ai: {
    gateway: "openrouter",
    model: process.env.OPENROUTER_MODEL || appConfig.ai.openRouterModel,
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: process.env.OPENROUTER_BASE_URL || appConfig.ai.openRouterBaseUrl,
    httpReferer: process.env.OPENROUTER_HTTP_REFERER || appConfig.ai.openRouterHttpReferer,
    appTitle: process.env.OPENROUTER_APP_TITLE || appConfig.ai.openRouterAppTitle
  }
});

const isDemoMode = appConfig.execution.demoMode;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: isDemoMode ? false : true,
  forbidOnly: !!process.env.CI,
  retries: isDemoMode ? 0 : (process.env.CI ? 1 : 0),
  workers: isDemoMode ? 1 : (process.env.CI ? 2 : undefined),
  timeout: isDemoMode ? 180_000 : 120_000,
  reporter: [
    ["html", { open: "never", outputFolder: "reports/test-results/html-report" }],
    ["list"]
  ],
  use: {
    baseURL: appConfig.calcom.baseUrl,
    trace: "retain-on-failure",
    screenshot: isDemoMode ? "on" : "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: isDemoMode ? 45_000 : 30_000,
    navigationTimeout: isDemoMode ? 60_000 : 45_000,
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

