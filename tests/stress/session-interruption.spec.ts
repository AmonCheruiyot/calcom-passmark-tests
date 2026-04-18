import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { chooseFirstSlot, detectPageState, fillVisibleField } from "../../helpers/flows";
import { selectors } from "../../helpers/selectors";
import { attendees, uniqueAttendee } from "../../helpers/testData";

test("recovers cleanly when a booking session is interrupted and reopened", async ({ browser }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  const context = await browser.newContext();
  const page = await context.newPage();
  const attendee = uniqueAttendee(attendees.primary, "stress-session-interrupt");

  try {
    await chooseFirstSlot(page, "Start a booking flow and interrupt the browser session before submit");
    await fillVisibleField(page, selectors.fields.name, attendee.name);
    await fillVisibleField(page, selectors.fields.email, attendee.email);

    await page.close();

    const reopenedPage = await context.newPage();
    await reopenedPage.goto(appConfig.calcom.bookingUrl, { waitUntil: "domcontentloaded" });

    const state = await detectPageState(reopenedPage);
    expect(["booking-form", "unknown"]).toContain(state);

    const body = (await reopenedPage.locator("body").innerText()).toLowerCase();
    expect(body).not.toMatch(/confirmed|scheduled successfully|you are booked/);
  } finally {
    await context.close();
  }
});

