import { test } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertNoPastSlotBooking, attemptPastTimeSelection } from "../../helpers/flows";

test("does not allow a booking to be created on a past time slot", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await attemptPastTimeSelection(page);
  await assertNoPastSlotBooking(page);
});

