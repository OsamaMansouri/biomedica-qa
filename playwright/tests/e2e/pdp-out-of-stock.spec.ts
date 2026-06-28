import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { extendedUiStrings } from "../i18n/strings";
import { oosProductSlug } from "../utils/catalogApi";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: PDP out of stock", () => {
  test("Guest: out-of-stock PDP disables add to cart @pdp @e2e", async ({
    page,
  }, testInfo) => {
    const copy = extendedUiStrings(localeFromProject(testInfo));
    const slug = oosProductSlug();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    if (!(await page.getByTestId("qa-pdp-inventory").isVisible())) {
      test.skip(
        true,
        `OOS fixture "${slug}" not on storefront — create in admin (published, stock 0)`,
      );
    }

    await expect(page.getByTestId("qa-pdp-inventory")).toHaveText(copy.outOfStock);
    await expect(page.getByTestId("qa-pdp-atc-primary")).toBeDisabled();
  });
});
