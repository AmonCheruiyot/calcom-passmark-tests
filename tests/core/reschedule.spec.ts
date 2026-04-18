import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { bookMeeting, rescheduleMeeting, detectPageState } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("reschedules a booked meeting to a new slot", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await bookMeeting(page, uniqueAttendee(attendees.primary, "core-reschedule"), {
    notes: bookingData.defaultNotes
  });

  await rescheduleMeeting(page);
  expect(await detectPageState(page)).toBe("confirmation");
});

