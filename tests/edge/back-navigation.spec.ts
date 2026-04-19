import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { chooseFirstSlot, detectPageState } from "../../helpers/flows";

test("survives repeated back-button navigation without reaching a false confirmation", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await chooseFirstSlot(page, "Move into attendee form and then navigate backward");

  for (let i = 0; i < 5; i++) {
    await page.goBack({ waitUntil: "domcontentloaded" });
  }

  const state = await detectPageState(page);
  expect(["booking-form", "unknown"]).toContain(state);
});

