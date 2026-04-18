import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertManageActionsVisible, bookMeeting, detectPageState } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("books a meeting through the primary Cal.com flow", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  const attendee = uniqueAttendee(attendees.primary, "core-booking");
  await bookMeeting(page, attendee, {
    notes: bookingData.defaultNotes,
    timezone: bookingData.timezones.default,
    userFlow: "Core booking flow for a real Cal.com attendee"
  });

  await assertManageActionsVisible(page);
  expect(await detectPageState(page)).toBe("confirmation");
});

