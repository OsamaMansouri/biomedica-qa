import { test, expect } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { checkoutCopy } from "../utils/checkoutFlow";
import {
  addDefaultProductFromPdp,
  openCheckoutFromCart,
} from "../utils/cartFlow";

test.describe("smoke: checkout promo", () => {
  test("Guest: promo field and apply CTA visible and clickable @checkout @promo @smoke", async ({
    page,
  }, testInfo) => {
    const copy = checkoutCopy(testInfo);

    await addDefaultProductFromPdp(page);
    await openCheckoutFromCart(page);

    const input = page.getByTestId("qa-checkout-promo-input");
    const apply = page.getByTestId("qa-checkout-promo-apply");

    await expect(input).toBeVisible({ timeout: SLOW_UI_TIMEOUT_MS });
    await expect(input).toBeEnabled();
    await expect(input).toHaveAttribute("placeholder", copy.discountPlaceholder);

    await expect(apply).toBeVisible();
    await expect(apply).toBeEnabled();

    await input.fill("SMOKE-CLICK");
    await apply.click();

    await expect(page.getByTestId("qa-checkout-promo-error")).toBeVisible({
      timeout: SLOW_UI_TIMEOUT_MS,
    });
    await expect(page.getByTestId("qa-checkout-promo-error")).toHaveText(
      copy.discountInvalid,
    );
  });
});
