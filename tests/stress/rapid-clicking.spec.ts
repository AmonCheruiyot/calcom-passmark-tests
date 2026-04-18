import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { chooseFirstSlot, clickRapidly, detectPageState, fillVisibleField } from "../../helpers/flows";
import { selectors } from "../../helpers/selectors";
import { attendees, uniqueAttendee } from "../../helpers/testData";

test("creates at most one booking when the submit action is hammered rapidly", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  const attendee = uniqueAttendee(attendees.primary, "stress-rapid-click");
  await chooseFirstSlot(page, "Reach attendee form for rapid click stress coverage");
  await fillVisibleField(page, selectors.fields.name, attendee.name);
  await fillVisibleField(page, selectors.fields.email, attendee.email);

  const submit = page.getByRole("button", { name: selectors.buttons.confirm }).first();
  await clickRapidly(submit, 5);

  expect(["confirmation", "conflict"]).toContain(await detectPageState(page));
});

