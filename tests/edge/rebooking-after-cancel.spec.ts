import { test } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import {
  assertBookingStateConsistentAcrossSessions,
  assertCancellationPersistsAcrossSessions,
  bookMeeting,
  cancelMeeting,
  captureConfirmationUrl
} from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("allows a new booking after immediate cancellation without ghost state", async ({ browser, page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await bookMeeting(page, uniqueAttendee(attendees.primary, "edge-rebook-after-cancel"), {
    notes: bookingData.defaultNotes,
    userFlow: "Create and cancel a booking before rebooking"
  });

  const cancellationPageUrl = page.url();
  await cancelMeeting(page);
  await assertCancellationPersistsAcrossSessions(browser, cancellationPageUrl);

  const secondContext = await browser.newContext();
  const secondPage = await secondContext.newPage();

  try {
    await bookMeeting(secondPage, uniqueAttendee(attendees.secondary, "edge-rebook-after-cancel"), {
      notes: bookingData.defaultNotes,
      userFlow: "Rebook after cancelling a previous meeting"
    });

    const confirmationUrl = await captureConfirmationUrl(secondPage);
    await assertBookingStateConsistentAcrossSessions(browser, confirmationUrl);
  } finally {
    await secondContext.close();
  }
});
