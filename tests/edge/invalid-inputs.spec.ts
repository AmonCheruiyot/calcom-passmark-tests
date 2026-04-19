import { test, expect } from "@playwright/test";
import { appConfig } from "../../helpers/config";
import { assertValidationErrorsVisible, chooseFirstSlot, fillVisibleField } from "../../helpers/flows";
import { selectors } from "../../helpers/selectors";

test("rejects invalid attendee details without creating a booking", async ({ page }) => {
  test.skip(!appConfig.execution.isReadyForLiveRun, appConfig.execution.missingMessage);

  await chooseFirstSlot(page, "Reach attendee form for invalid input coverage");

  await fillVisibleField(page, selectors.fields.name, "测试用户 𐍈");
  await fillVisibleField(page, selectors.fields.email, "bad@@example..com");
  await fillVisibleField(page, selectors.fields.notes, "A".repeat(1024));
  await page.getByRole("button", { name: selectors.buttons.confirm }).first().click();

  await assertValidationErrorsVisible(page);
  expect(await page.locator("body").innerText()).toContain("invalid");
});

