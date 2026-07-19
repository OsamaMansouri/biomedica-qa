import { test, expect } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import {
  addDefaultProductFromPdp,
  openCheckoutFromCart,
} from "../utils/cartFlow";
import {
  applyPromoAtCheckout,
  checkoutCopy,
  fillCheckoutGuestAddress,
  removePromoAtCheckout,
  requireTestPromoCode,
  selectFirstShippingMethod,
  waitForCheckoutTotalReady,
} from "../utils/checkoutFlow";

test.describe("E2E: checkout promo", () => {
  test.describe.configure({ timeout: 180_000 });

  test("Guest: valid promo reduces checkout total @checkout @promo @e2e", async ({
    page,
  }, testInfo) => {
    const promoCode = requireTestPromoCode();

    await addDefaultProductFromPdp(page);
    await openCheckoutFromCart(page);

    const totalBefore = await waitForCheckoutTotalReady(page);
    await applyPromoAtCheckout(page, promoCode);
    const totalAfter = await waitForCheckoutTotalReady(page);

    expect(totalAfter).toBeLessThan(totalBefore);
    await expect(page.getByTestId("qa-checkout-promo-applied")).toContainText(
      promoCode.toUpperCase(),
    );
    await expect(page.getByTestId("qa-checkout-promo-discount")).toContainText(
      /[\d]/,
    );
  });

  test("Guest: invalid promo shows error, total unchanged @checkout @promo @validation @e2e", async ({
    page,
  }, testInfo) => {
    const copy = checkoutCopy(testInfo);

    await addDefaultProductFromPdp(page);
    await openCheckoutFromCart(page);

    const totalBefore = await waitForCheckoutTotalReady(page);

    await page.getByTestId("qa-checkout-promo-input").fill("INVALID-QA-E2E-XXXX");
    await page.getByTestId("qa-checkout-promo-apply").click();

    await expect(page.getByTestId("qa-checkout-promo-error")).toBeVisible({
      timeout: SLOW_UI_TIMEOUT_MS,
    });
    await expect(page.getByTestId("qa-checkout-promo-error")).toHaveText(
      copy.discountInvalid,
    );
    await expect(page.getByTestId("qa-checkout-promo-applied")).toHaveCount(0);

    const totalAfter = await waitForCheckoutTotalReady(page);
    expect(totalAfter).toBe(totalBefore);
  });

  test("Guest: remove promo restores total @checkout @promo @e2e", async ({
    page,
  }) => {
    const promoCode = requireTestPromoCode();

    await addDefaultProductFromPdp(page);
    await openCheckoutFromCart(page);

    const totalBefore = await waitForCheckoutTotalReady(page);
    await applyPromoAtCheckout(page, promoCode);
    const totalDiscounted = await waitForCheckoutTotalReady(page);
    expect(totalDiscounted).toBeLessThan(totalBefore);

    await removePromoAtCheckout(page);
    const totalRestored = await waitForCheckoutTotalReady(page);
    expect(totalRestored).toBe(totalBefore);
  });

  test("Guest: COD order with promo reaches thank-you with lower total @checkout @promo @checkout-cod @e2e @skip", async ({
    page,
  }, testInfo) => {
    const copy = checkoutCopy(testInfo);
    const promoCode = requireTestPromoCode();

    await addDefaultProductFromPdp(page);
    await openCheckoutFromCart(page);

    const totalBefore = await waitForCheckoutTotalReady(page);
    await applyPromoAtCheckout(page, promoCode);
    const totalWithPromo = await waitForCheckoutTotalReady(page);
    expect(totalWithPromo).toBeLessThan(totalBefore);

    await fillCheckoutGuestAddress(page, copy);
    await selectFirstShippingMethod(page);

    const placeOrder = page.getByTestId("qa-checkout-submit");
    await expect(placeOrder).toBeEnabled({ timeout: SLOW_UI_TIMEOUT_MS });
    await placeOrder.click();

    await expect(page).toHaveURL(/thank-you/, { timeout: SLOW_UI_TIMEOUT_MS });
    await expect(page.getByTestId("qa-thank-you-title")).toHaveText(
      copy.thankYouTitle,
    );

    const refParam = new URL(page.url()).searchParams.get("ref")?.trim() ?? "";
    expect(refParam.length).toBeGreaterThan(0);
    await expect(page.getByTestId("qa-thank-you-reference")).toContainText(
      refParam,
    );
  });
});
