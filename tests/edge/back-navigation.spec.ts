import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { chooseFirstSlot, detectPageState } from "../../helpers/flows";

test("handles browser back navigation without ending in a broken booking state", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await chooseFirstSlot(page, "Move into attendee form and then navigate backward");
  await page.goBack({ waitUntil: "domcontentloaded" });

  const state = await detectPageState(page);
  expect(["booking-form", "unknown"]).toContain(state);
});

