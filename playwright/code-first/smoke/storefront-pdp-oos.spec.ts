import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { extendedUiStrings, STORE_FRONT_E2E_OOS_PRODUCT_SLUG } from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("smoke: PDP out of stock fixture", () => {
  test("Out-of-stock fixture PDP disables add to cart @pdp @smoke", async ({
    page,
  }, testInfo) => {
    const slug =
      process.env.PLAYWRIGHT_TEST_OOS_PRODUCT_SLUG?.trim() ||
      STORE_FRONT_E2E_OOS_PRODUCT_SLUG;

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    await expect(page.getByTestId("qa-pdp-inventory")).toHaveText(
      extendedUiStrings(localeFromProject(testInfo)).outOfStock,
    );
    await expect(page.getByTestId("qa-pdp-atc-primary")).toBeDisabled();
  });
});
