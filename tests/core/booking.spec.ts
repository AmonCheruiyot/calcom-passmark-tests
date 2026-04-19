import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertBookingStateConsistentAcrossSessions, assertManageActionsVisible, bookMeeting, captureConfirmationUrl, detectPageState } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("books a meeting through the primary Cal.com flow", async ({ browser, page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  const attendee = uniqueAttendee(attendees.primary, "core-booking");
  await bookMeeting(page, attendee, {
    notes: bookingData.defaultNotes,
    timezone: bookingData.timezones.default,
    userFlow: "Core booking flow for a real Cal.com attendee"
  });

  await assertManageActionsVisible(page);
  expect(await detectPageState(page)).toBe("confirmation");

  const confirmationUrl = await captureConfirmationUrl(page);
  await assertBookingStateConsistentAcrossSessions(browser, confirmationUrl);
});

