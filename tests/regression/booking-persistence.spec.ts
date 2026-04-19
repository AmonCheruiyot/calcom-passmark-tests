import { test } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertBookingStateConsistentAcrossSessions, assertManageActionsVisible, assertBookingPersistedAfterReload, bookMeeting, captureConfirmationUrl } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("keeps a confirmed booking stable after refresh", async ({ browser, page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await bookMeeting(page, uniqueAttendee(attendees.primary, "regression-persistence"), {
    notes: bookingData.defaultNotes
  });

  await assertBookingPersistedAfterReload(page, "confirmation");
  await assertManageActionsVisible(page);

  const confirmationUrl = await captureConfirmationUrl(page);
  await assertBookingStateConsistentAcrossSessions(browser, confirmationUrl);
});

