import { test } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertPageState, bookMeeting, cancelMeeting } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("keeps cancellation state consistent across refresh and browser history", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await bookMeeting(page, uniqueAttendee(attendees.primary, "regression-cancel"), {
    notes: bookingData.defaultNotes
  });

  await cancelMeeting(page);
  await page.reload({ waitUntil: "domcontentloaded" });
  await assertPageState(page, "cancellation");

  await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => undefined);
  await assertPageState(page, "cancellation");
});

