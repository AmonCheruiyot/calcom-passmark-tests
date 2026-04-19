import { test } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import {
  assertCancellationPersistsAcrossSessions,
  assertBookingStateConsistentAcrossSessions,
  bookMeeting,
  cancelMeeting,
  captureConfirmationUrl
} from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("handles mixed booking and cancellation operations across sessions", async ({ browser, page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await bookMeeting(page, uniqueAttendee(attendees.primary, "stress-mixed-operations"), {
    notes: bookingData.stressNotes,
    userFlow: "Book a meeting before mixed session operations"
  });

  const confirmationUrl = await captureConfirmationUrl(page);
  await assertBookingStateConsistentAcrossSessions(browser, confirmationUrl);

  const cancelContext = await browser.newContext();
  const verifyContext = await browser.newContext();
  const cancelPage = await cancelContext.newPage();
  const verifyPage = await verifyContext.newPage();

  try {
    await cancelPage.goto(confirmationUrl, { waitUntil: "domcontentloaded" });
    await verifyPage.goto(confirmationUrl, { waitUntil: "domcontentloaded" });

    await Promise.all([
      cancelMeeting(cancelPage),
      verifyPage.reload({ waitUntil: "domcontentloaded" })
    ]);

    await assertCancellationPersistsAcrossSessions(browser, confirmationUrl);
  } finally {
    await cancelContext.close();
    await verifyContext.close();
  }
});
