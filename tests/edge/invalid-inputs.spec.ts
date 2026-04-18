import { test } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertValidationErrorsVisible, fillInvalidAttendeeData } from "../../helpers/flows";

test("rejects invalid attendee details without creating a booking", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await fillInvalidAttendeeData(page);
  await assertValidationErrorsVisible(page);
});

