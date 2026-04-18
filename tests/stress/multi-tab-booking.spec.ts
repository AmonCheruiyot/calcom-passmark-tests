import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { bookMeeting, chooseFirstSlot, detectPageState } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("keeps booking state coherent across two tabs sharing one browser session", async ({ context }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  const firstTab = await context.newPage();
  const secondTab = await context.newPage();

  await chooseFirstSlot(firstTab, "Open the booking flow in tab one");
  await secondTab.goto(appConfig.calcom.bookingUrl, { waitUntil: "domcontentloaded" });

  await bookMeeting(firstTab, uniqueAttendee(attendees.primary, "stress-multi-tab"), {
    notes: bookingData.stressNotes
  });

  await secondTab.reload({ waitUntil: "domcontentloaded" });
  expect(["booking-form", "unknown"]).toContain(await detectPageState(secondTab));
});

