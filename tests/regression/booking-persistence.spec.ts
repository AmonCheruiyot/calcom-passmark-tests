import { test } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertManageActionsVisible, assertPageState, bookMeeting } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("keeps a confirmed booking stable after refresh", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await bookMeeting(page, uniqueAttendee(attendees.primary, "regression-persistence"), {
    notes: bookingData.defaultNotes
  });

  await page.reload({ waitUntil: "domcontentloaded" });
  await assertPageState(page, "confirmation");
  await assertManageActionsVisible(page);
});

