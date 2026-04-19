import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";
import { appConfig } from "../../helpers/config";

test("golden path booking demo - AI executes natural language steps", async ({ page }) => {
  test.skip(!appConfig.execution.demoMode, "This test only runs in demo mode");

  await runSteps({
    page,
    userFlow: "Book a meeting with a user on Cal.com using available time slots",
    steps: [
      {
        description: `Navigate to the Cal.com booking page at ${appConfig.calcom.bookingUrl}`
      },
      {
        description: "Select the first available time slot from today's date"
      },
      {
        description: "Fill the attendee name field with 'Demo User'"
      },
      {
        description: "Fill the attendee email field with 'demo@qa.local'"
      },
      {
        description: "Submit the booking form to confirm the meeting"
      }
    ],
    assertions: [
      {
        assertion: "The booking confirmation page is displayed with success message"
      },
      {
        assertion: "Confirmation details show the booked meeting information"
      }
    ],
    expect
  });
});