import { test, expect } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { localeFromProject } from "../i18n/locale";
import { checkoutStrings } from "../i18n/strings";
import {
  addDefaultProductFromPdp,
  openCheckoutFromCart,
} from "../utils/cartFlow";

test.describe("E2E: checkout validation", () => {
  test("Guest: checkout blocks submit when required address fields are empty @checkout @validation @e2e", async ({
    page,
  }, testInfo) => {
    const copy = checkoutStrings(localeFromProject(testInfo));

    await addDefaultProductFromPdp(page);
    await openCheckoutFromCart(page);

    const submit = page.getByTestId("qa-checkout-submit");
    await expect(submit).toBeEnabled({ timeout: SLOW_UI_TIMEOUT_MS });

    await submit.click();

    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByTestId("qa-field-error-checkout-email")).toHaveText(
      copy.validationEmailRequired,
    );
  });

  test("Guest: invalid email shows inline error on blur @checkout @validation @e2e", async ({
    page,
  }, testInfo) => {
    const copy = checkoutStrings(localeFromProject(testInfo));

    await addDefaultProductFromPdp(page);
    await openCheckoutFromCart(page);

    await page.getByTestId("qa-checkout-email").fill("not-an-email");
    await page.getByPlaceholder(copy.placeholders.firstName).click();

    const emailError = page.getByTestId("qa-field-error-checkout-email");
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText(copy.validationEmailInvalid);

    await page.getByTestId("qa-checkout-submit").click();
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page).not.toHaveURL(/thank-you/);
  });

  test("Guest: invalid phone shows inline error on blur @checkout @validation @e2e", async ({
    page,
  }, testInfo) => {
    const copy = checkoutStrings(localeFromProject(testInfo));

    await addDefaultProductFromPdp(page);
    await openCheckoutFromCart(page);

    await page.getByTestId("qa-checkout-phone").fill("123");
    await page.getByPlaceholder(copy.placeholders.firstName).click();

    const phoneError = page.getByTestId("qa-field-error-checkout-phone");
    await expect(phoneError).toBeVisible();
    await expect(phoneError).toHaveText(copy.validationPhoneInvalid);

    await page.getByTestId("qa-checkout-submit").click();
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page).not.toHaveURL(/thank-you/);
  });
});
