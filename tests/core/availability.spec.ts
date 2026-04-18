import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { openBookingPage, runPassmarkFlow } from "../../helpers/flows";

test("shows real availability before attendee details are entered", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await openBookingPage(page);
  await runPassmarkFlow(
    page,
    "Validate visible availability on the Cal.com booking page",
    [
      { description: "Open the booking page and inspect availability for the earliest selectable date" },
      { description: "Choose that date without submitting a booking" }
    ],
    [
      {
        assertion:
          "The page shows bookable time slots for the chosen date and clearly distinguishes them from unavailable options."
      }
    ]
  );

  const body = await page.locator("body").innerText();
  expect(body.toLowerCase()).toMatch(/time|slot|available|select/i);
});

