import { test } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertConflictHandled, chooseFirstSlot, clickPrimaryAction, fillVisibleField } from "../../helpers/flows";
import { selectors } from "../../helpers/selectors";
import { attendees, uniqueAttendee } from "../../helpers/testData";

test("prevents a second booking from silently claiming the same slot", async ({ browser }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  try {
    await Promise.all([
      chooseFirstSlot(pageA, "First attendee targets the earliest available slot"),
      chooseFirstSlot(pageB, "Second attendee targets the same earliest available slot")
    ]);

    const firstAttendee = uniqueAttendee(attendees.primary, "edge-double-booking-a");
    await fillVisibleField(pageA, selectors.fields.name, firstAttendee.name);
    await fillVisibleField(pageA, selectors.fields.email, firstAttendee.email);
    await clickPrimaryAction(pageA);

    await fillVisibleField(pageB, selectors.fields.name, "Second Slot Claim");
    await fillVisibleField(pageB, selectors.fields.email, uniqueAttendee(attendees.secondary, "edge-double-booking-b").email);
    await clickPrimaryAction(pageB);

    await assertConflictHandled(pageB);
  } finally {
    await contextA.close();
    await contextB.close();
  }
});
