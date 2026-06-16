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
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     * 10000 milliseconds = 15 seconds
     */
    timeout: 15 * 1000,
  },
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
      use: {
        browserName: "chromium",
        headless: config.headless,
      },
    },
    {
      name: "firefox",
      use: {
        browserName: "firefox",
        headless: config.headless,
      },
    },
    {
      name: "webkit",
      use: {
        browserName: "webkit",
        headless: config.headless,
      },
    },
  ],
});
