import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { chooseFirstSlot, detectPageState, fillVisibleField } from "../../helpers/flows";
import { selectors } from "../../helpers/selectors";

test("stays recoverable when the browser refreshes after a slot is selected", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await chooseFirstSlot(page, "Reach Cal.com attendee form then refresh mid-flow");
  await fillVisibleField(page, selectors.fields.name, "Refresh Mid Flow");
  await page.reload({ waitUntil: "domcontentloaded" });

  const state = await detectPageState(page);
  expect(["booking-form", "reschedule"]).toContain(state);
});

