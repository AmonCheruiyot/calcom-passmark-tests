import { test } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertPageState, bookMeeting, cancelMeeting, rescheduleMeeting } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("keeps system state consistent through booking, rescheduling, and cancellation", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await bookMeeting(page, uniqueAttendee(attendees.primary, "core-full-lifecycle"), {
    notes: bookingData.defaultNotes,
    userFlow: "Create the initial booking for full lifecycle validation"
  });

  await rescheduleMeeting(page);
  await assertPageState(page, "confirmation");

  await cancelMeeting(page);
  await assertPageState(page, "cancellation");
});

