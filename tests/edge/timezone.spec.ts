import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertBookingStateConsistentAcrossSessions, bookMeeting, captureConfirmationUrl } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("preserves booking integrity when the attendee changes timezone", async ({ browser, page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  const timezone = bookingData.timezones.edge;
  await bookMeeting(page, uniqueAttendee(attendees.primary, "edge-timezone"), {
    notes: bookingData.defaultNotes,
    timezone,
    userFlow: "Book a meeting after changing to a distant timezone"
  });

  const body = await page.locator("body").innerText();
  expect(body).toMatch(new RegExp(timezone.split("/")[1], "i"));

  const confirmationUrl = await captureConfirmationUrl(page);
  await assertBookingStateConsistentAcrossSessions(browser, confirmationUrl);
});

