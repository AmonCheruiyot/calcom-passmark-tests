import { test } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { bookMeeting, cancelMeeting } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("cancels an existing meeting from the confirmation flow", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await bookMeeting(page, uniqueAttendee(attendees.primary, "core-cancel"), {
    notes: bookingData.defaultNotes
  });

  await cancelMeeting(page);
});

