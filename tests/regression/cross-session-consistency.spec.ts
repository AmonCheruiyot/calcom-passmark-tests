import { test } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertConfirmationVisibleInAnotherSession, captureConfirmationUrl, bookMeeting } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("shows the same confirmed booking state across separate browser sessions", async ({ browser }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  try {
    await bookMeeting(pageA, uniqueAttendee(attendees.primary, "regression-cross-session"), {
      notes: bookingData.defaultNotes
    });

    const confirmationUrl = await captureConfirmationUrl(pageA);
    await assertConfirmationVisibleInAnotherSession(pageB, confirmationUrl);
  } finally {
    await contextA.close();
    await contextB.close();
  }
});

