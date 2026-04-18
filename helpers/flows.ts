import { expect, Locator, Page } from "@playwright/test";
import { runSteps } from "passmark";
import { appConfig } from "./config";
import { selectors } from "./selectors";
import type { Attendee } from "./testData";

export type FlowStep = {
  description: string;
  data?: Record<string, string>;
};

export type FlowAssertion = {
  assertion: string;
};

export type BookingPageState =
  | "booking-form"
  | "confirmation"
  | "cancellation"
  | "reschedule"
  | "conflict"
  | "unknown";

export async function runPassmarkFlow(
  page: Page,
  userFlow: string,
  steps: FlowStep[],
  assertions: FlowAssertion[]
): Promise<void> {
  await runSteps({
    page,
    userFlow,
    steps,
    assertions,
    expect
  });
}

export async function openBookingPage(page: Page): Promise<void> {
  await page.goto(appConfig.calcom.bookingUrl, { waitUntil: "domcontentloaded" });
}

export async function chooseFirstSlot(page: Page, userFlow = "Choose earliest available Cal.com slot"): Promise<void> {
  await runPassmarkFlow(
    page,
    userFlow,
    [
      { description: `Open the Cal.com booking page at ${appConfig.calcom.bookingUrl}` },
      { description: "Choose the earliest date with an available time slot" },
      { description: "Choose the first available time slot on that date" }
    ],
    [
      {
        assertion:
          "The attendee details form is open and ready for booking submission."
      }
    ]
  );
}

export async function bookMeeting(
  page: Page,
  attendee: Attendee,
  options?: { notes?: string; timezone?: string; userFlow?: string }
): Promise<void> {
  const steps: FlowStep[] = [
    { description: `Open the Cal.com booking page at ${appConfig.calcom.bookingUrl}` },
    { description: "Choose the earliest date with an available time slot" },
    { description: "Choose the first available time slot on that date" }
  ];

  if (options?.timezone) {
    steps.push({
      description: "Set the booking timezone before submitting attendee details",
      data: { timezone: options.timezone }
    });
  }

  steps.push({
    description: "Fill the attendee name",
    data: { value: attendee.name }
  });
  steps.push({
    description: "Fill the attendee email address",
    data: { value: attendee.email }
  });

  if (options?.notes) {
    steps.push({
      description: "Fill any notes or additional booking information",
      data: { value: options.notes }
    });
  }

  steps.push({ description: "Submit the booking form to confirm the meeting" });

  await runPassmarkFlow(
    page,
    options?.userFlow || "Book a Cal.com meeting",
    steps,
    [
      {
        assertion:
          "The booking finishes on a confirmation state with event details visible and the attendee can manage the booking."
      }
    ]
  );

  await assertPageState(page, "confirmation");
}

export async function cancelMeeting(page: Page): Promise<void> {
  await runPassmarkFlow(
    page,
    "Cancel an existing Cal.com meeting",
    [
      { description: "Use the booking management controls on this page" },
      { description: "Cancel the meeting and confirm the cancellation if a confirmation step appears" }
    ],
    [
      {
        assertion:
          "The booking is cancelled and the page clearly shows a cancelled state rather than an active booking."
      }
    ]
  );

  await assertPageState(page, "cancellation");
}

export async function rescheduleMeeting(page: Page): Promise<void> {
  await runPassmarkFlow(
    page,
    "Reschedule an existing Cal.com meeting",
    [
      { description: "Use the booking management controls on this page" },
      { description: "Start the reschedule flow" },
      { description: "Choose a different date or time than the current selection" },
      { description: "Submit the rescheduled booking" }
    ],
    [
      {
        assertion:
          "The reschedule completes successfully and the page ends on a fresh booking confirmation for the updated time."
      }
    ]
  );

  await assertPageState(page, "confirmation");
}

export async function captureConfirmationUrl(page: Page): Promise<string> {
  await assertPageState(page, "confirmation");
  return page.url();
}

export async function fillInvalidAttendeeData(page: Page): Promise<void> {
  await chooseFirstSlot(page, "Reach attendee form for invalid input coverage");
  await fillVisibleField(page, selectors.fields.name, "");
  await fillVisibleField(page, selectors.fields.email, "invalid-email");
  await clickPrimaryAction(page);
}

export async function fillVisibleField(page: Page, candidateSelectors: string[], value: string): Promise<void> {
  const locator = await firstExistingLocator(
    page,
    candidateSelectors.map((selector) => page.locator(selector).first())
  );
  await locator.fill(value);
}

export async function clickPrimaryAction(page: Page): Promise<void> {
  const button = page.getByRole("button", { name: selectors.buttons.confirm }).first();
  await expect(button).toBeVisible();
  await button.click();
}

export async function clickRapidly(locator: Locator, count: number): Promise<void> {
  await expect(locator).toBeVisible();
  await Promise.all(Array.from({ length: count }, () => locator.click()));
}

export async function detectPageState(page: Page): Promise<BookingPageState> {
  const body = (await page.locator("body").innerText()).toLowerCase();
  const url = page.url().toLowerCase();

  if (selectors.patterns.cancellation.test(body)) {
    return "cancellation";
  }

  if (selectors.patterns.conflict.test(body)) {
    return "conflict";
  }

  if (selectors.patterns.confirmation.test(body) || /booking\/|success|confirmed/.test(url)) {
    return "confirmation";
  }

  if (selectors.patterns.reschedule.test(body) || /resched/.test(url)) {
    return "reschedule";
  }

  const hasEmailField = await page.locator(selectors.fields.email.join(",")).count();
  if (hasEmailField > 0) {
    return "booking-form";
  }

  return "unknown";
}

export async function assertPageState(page: Page, expected: BookingPageState): Promise<void> {
  await expect
    .poll(async () => detectPageState(page), {
      timeout: 20_000,
      message: `Expected Cal.com page state to become ${expected}`
    })
    .toBe(expected);
}

export async function assertManageActionsVisible(page: Page): Promise<void> {
  const body = await page.locator("body").innerText();
  expect(body).toMatch(selectors.patterns.confirmation);

  const cancelButton = page.getByRole("button", { name: selectors.buttons.cancel }).first();
  const cancelLink = page.getByRole("link", { name: selectors.buttons.cancel }).first();
  const rescheduleButton = page.getByRole("button", { name: selectors.buttons.reschedule }).first();
  const rescheduleLink = page.getByRole("link", { name: selectors.buttons.reschedule }).first();

  const counts = await Promise.all([
    cancelButton.count(),
    cancelLink.count(),
    rescheduleButton.count(),
    rescheduleLink.count()
  ]);

  expect(counts.some((count) => count > 0)).toBeTruthy();
}

export async function assertConflictHandled(page: Page): Promise<void> {
  const state = await detectPageState(page);
  expect(["conflict", "booking-form"]).toContain(state);
  const body = await page.locator("body").innerText();
  expect(body.toLowerCase()).toMatch(selectors.patterns.conflict);
}

export async function assertValidationErrorsVisible(page: Page): Promise<void> {
  const body = await page.locator("body").innerText();
  expect(body.toLowerCase()).toMatch(selectors.patterns.validation);
  await assertPageState(page, "booking-form");
}

export async function assertConfirmationVisibleInAnotherSession(page: Page, confirmationUrl: string): Promise<void> {
  await page.goto(confirmationUrl, { waitUntil: "domcontentloaded" });
  await assertPageState(page, "confirmation");
}

export async function attemptPastTimeSelection(page: Page): Promise<void> {
  await runPassmarkFlow(
    page,
    "Try to select a time that has already passed",
    [
      { description: `Open the Cal.com booking page at ${appConfig.calcom.bookingUrl}` },
      { description: "Look for a date or time slot that is already in the past for the current timezone" },
      { description: "Attempt to select that past date or time if the UI presents it" }
    ],
    [
      {
        assertion:
          "The system does not allow a past time to be booked and keeps the user from reaching a valid confirmation on a passed slot."
      }
    ]
  );
}

export async function assertNoPastSlotBooking(page: Page): Promise<void> {
  const state = await detectPageState(page);
  expect(state).not.toBe("confirmation");

  const disabledPastIndicators = await page
    .locator('[aria-disabled="true"], [disabled], [data-past="true"]')
    .count();

  const body = (await page.locator("body").innerText()).toLowerCase();
  const hasGuardrailLanguage =
    /past|unavailable|not available|cannot book|choose another time/.test(body);

  expect(disabledPastIndicators > 0 || hasGuardrailLanguage || state === "booking-form" || state === "unknown").toBeTruthy();
}

async function firstExistingLocator(page: Page, locators: Locator[]): Promise<Locator> {
  for (const locator of locators) {
    if ((await locator.count()) > 0) {
      return locator;
    }
  }

  throw new Error(`None of the fallback locators resolved on ${page.url()}`);
}
