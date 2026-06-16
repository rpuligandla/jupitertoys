import { defineConfig } from "@playwright/test";

const config = {
  baseURL: process.env.BASE_URL || "http://jupiter.cloud.planittesting.com/",
  timeout: parseInt(process.env.TIMEOUT || "30000"),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  headless: process.env.HEADLESS !== "false",
};

export default defineConfig({
  testDir: "./src/tests",
  testMatch: "**/*.spec.ts",
  timeout: config.timeout,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: config.retries,
  workers: config.workers,
  reporter: [["html", { outputFolder: "./playwright-report" }], ["list"]],
  use: {
    baseURL: config.baseURL,
    trace: "on",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10000,
    locale: "en-US",
  },
  projects: [
    {
      name: "chromium",
      use: { headless: config.headless },
    },
  ],
});
