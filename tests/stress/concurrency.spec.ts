import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { bookMeeting, detectPageState } from "../../helpers/flows";
import { attendees, bookingData, uniqueAttendee } from "../../helpers/testData";

test("handles near-concurrent booking attempts gracefully", async ({ browser }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  const contexts = await Promise.all([browser.newContext(), browser.newContext(), browser.newContext()]);
  const pages = await Promise.all(contexts.map((context) => context.newPage()));

  try {
    await Promise.allSettled(
      pages.map((page, index) =>
        bookMeeting(page, uniqueAttendee(attendees.primary, `stress-concurrency-${index + 1}`), {
          notes: bookingData.stressNotes,
          userFlow: `Concurrent booking attempt ${index + 1}`
        })
      )
    );

    const states = await Promise.all(pages.map((page) => detectPageState(page)));
    const successful = states.filter((state) => state === "confirmation").length;
    expect(successful).toBeGreaterThanOrEqual(1);
    expect(successful).toBeLessThanOrEqual(pages.length);
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
  }
});

