import { test, expect } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import {
  addDefaultProductFromPdp,
  openCheckoutFromCart,
} from "../utils/cartFlow";

test.describe("E2E: checkout shipping methods", () => {
  test("Guest: checkout lists shipping methods after address quote @checkout @e2e", async ({
    page,
  }) => {
    await addDefaultProductFromPdp(page);
    await openCheckoutFromCart(page);

    const shipping = page.locator('input[name="shipping-method"]');
    await expect(shipping.first()).toBeVisible({ timeout: SLOW_UI_TIMEOUT_MS });
    expect(await shipping.count()).toBeGreaterThan(0);
  });

  test("Guest: checkout can select alternate shipping method @checkout @e2e", async ({
    page,
  }) => {
    await addDefaultProductFromPdp(page);
    await openCheckoutFromCart(page);

    const shipping = page.locator('input[name="shipping-method"]');
    await expect(shipping.first()).toBeVisible({ timeout: SLOW_UI_TIMEOUT_MS });
    test.skip((await shipping.count()) < 2, "Only one shipping method quoted");

    await shipping.nth(1).check();
    await expect(shipping.nth(1)).toBeChecked();
  });
});
