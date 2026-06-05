import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import {
  extendedUiStrings,
  STORE_FRONT_E2E_OOS_PRODUCT_SLUG,
} from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: PDP out of stock", () => {
  test("Guest: out-of-stock PDP disables add to cart @pdp @e2e", async ({
    page,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const copy = extendedUiStrings(locale);
    const slug = (
      process.env.PLAYWRIGHT_TEST_OOS_PRODUCT_SLUG?.trim() ||
      STORE_FRONT_E2E_OOS_PRODUCT_SLUG
    ).trim();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    await expect(page.getByTestId("qa-pdp-inventory")).toHaveText(copy.outOfStock);
    await expect(page.getByTestId("qa-pdp-atc-primary")).toBeDisabled();
  });
});
