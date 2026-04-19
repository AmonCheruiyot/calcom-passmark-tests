import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";

test("basic page load test", async ({ page }) => {
  console.log('Testing URL:', appConfig.calcom.bookingUrl);

  // Simple navigation with basic timeout
  await page.goto(appConfig.calcom.bookingUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Just check if we got some HTML content
  const content = await page.content();
  expect(content.length).toBeGreaterThan(100);

  // Check the title
  const title = await page.title();
  console.log('Page title:', title);
  expect(title).toBeTruthy();

  // Take a screenshot
  await page.screenshot({ path: 'basic-load-test.png', fullPage: true });
});