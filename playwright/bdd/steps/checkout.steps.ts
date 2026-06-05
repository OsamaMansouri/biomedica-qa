import { expect } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { checkoutStrings } from "../i18n/strings";
import { completeGuestCodOrder, goToCheckoutWithDefaultProduct } from "../utils/checkoutFlow";
import { Given, When, Then } from "./fixtures";
import { bddLocale, bddSmoke } from "./helpers";

Given("I have a product in checkout", async ({ page }) => {
  await goToCheckoutWithDefaultProduct(page);
});

When("I select the second shipping method", async ({ page }) => {
  const methods = page.locator('input[name="shipping-method"]');
  const count = await methods.count();
  if (count < 2) return;
  await methods.nth(1).check();
});

When("I submit checkout without filling required fields", async ({ page }) => {
  const submit = page.getByTestId("qa-checkout-submit");
  await expect(submit).toBeEnabled({ timeout: SLOW_UI_TIMEOUT_MS });
  await submit.click();
});

When("I enter an invalid checkout email and leave the field", async ({ page, $testInfo }) => {
  const copy = checkoutStrings(bddLocale($testInfo));
  await page.getByTestId("qa-checkout-email").fill("not-an-email");
  await page.getByPlaceholder(copy.placeholders.firstName).click();
});

When(
  "I complete a guest COD order from the default product",
  async ({ page, $testInfo }) => {
    $testInfo.setTimeout(180_000);
    await completeGuestCodOrder(page, bddLocale($testInfo));
  },
);

Then("shipping method options are listed", async ({ page }) => {
  const methods = page.locator('input[name="shipping-method"]');
  await expect(methods.first()).toBeVisible({ timeout: SLOW_UI_TIMEOUT_MS });
  expect(await methods.count()).toBeGreaterThan(0);
});

Then("the second shipping method is checked", async ({ page }) => {
  const methods = page.locator('input[name="shipping-method"]');
  if ((await methods.count()) < 2) return;
  await expect(methods.nth(1)).toBeChecked();
});

Then(
  "checkout remains on the form with email required error",
  async ({ page, $testInfo }) => {
    const copy = checkoutStrings(bddLocale($testInfo));
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByTestId("qa-field-error-checkout-email")).toHaveText(
      copy.validationEmailRequired,
    );
  },
);

Then("I see the checkout email validation error", async ({ page, $testInfo }) => {
  const copy = checkoutStrings(bddLocale($testInfo));
  const emailError = page.getByTestId("qa-field-error-checkout-email");
  await expect(emailError).toBeVisible();
  await expect(emailError).toHaveText(copy.validationEmailInvalid);
});

Then("checkout does not reach thank you", async ({ page }) => {
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page).not.toHaveURL(/thank-you/);
});

Then("I see the order thank-you page with a reference", async ({ page, $testInfo }) => {
  const copy = checkoutStrings(bddLocale($testInfo));
  await expect(page).toHaveURL(/thank-you/);
  await expect(page.getByTestId("qa-thank-you-title")).toHaveText(copy.thankYouTitle);
  await expect(page).toHaveURL(/[?&]ref=/);
  const refParam = new URL(page.url()).searchParams.get("ref")?.trim() ?? "";
  expect(refParam.length).toBeGreaterThan(0);
  await expect(page.getByTestId("qa-thank-you-reference")).toContainText(refParam);
});

Then("the checkout page shows empty cart guidance", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  await expect(
    page.getByRole("heading", { name: ui.checkoutTitle, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText(ui.emptyCheckoutLine)).toBeVisible();
  await expect(
    page.getByRole("link", { name: ui.continueShopping }),
  ).toBeVisible();
});
