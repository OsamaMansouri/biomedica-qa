import { test, expect } from "@playwright/test";

import { smoke, STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG } from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("smoke: add to cart opens drawer", () => {
  test("PDP primary ATC then cart shows checkout", { tag: "@smoke" }, async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);
    const slug = (
      process.env.PLAYWRIGHT_TEST_PRODUCT_SLUG || STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG
    ).trim();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);
    await page.getByTestId("qa-pdp-atc-primary").click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(
      dialog.getByRole("heading", { name: ui.cartSheetTitle }),
    ).toBeVisible();
    await expect(dialog.getByTestId("qa-cart-checkout")).toBeVisible();
  });
});
