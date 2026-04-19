import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import {
  assertBookingPersistedAfterReload,
  bookMeeting,
  chooseFirstSlot,
  detectPageState,
  openBookingPage
} from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("remains recoverable when refreshed at slot selection, form entry, and confirmation stages", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await openBookingPage(page);
  await page.reload({ waitUntil: "domcontentloaded" });
  expect(["booking-form", "unknown"]).toContain(await detectPageState(page));

  await chooseFirstSlot(page, "Select a slot then refresh before attendee details are entered");
  await page.reload({ waitUntil: "domcontentloaded" });
  expect(["booking-form", "reschedule", "unknown"]).toContain(await detectPageState(page));

  await bookMeeting(page, uniqueAttendee(attendees.primary, "edge-refresh-stages"), {
    notes: bookingData.defaultNotes,
    userFlow: "Book after refreshing at multiple stages"
  });
  await assertBookingPersistedAfterReload(page, "confirmation");
});
