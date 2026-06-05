import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { extendedUiStrings } from "../i18n/strings";
import { outOfStockFixtureAvailable, oosProductSlug } from "../utils/catalogApi";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: PDP out of stock", () => {
  test.beforeAll(async ({ request }) => {
    const available = await outOfStockFixtureAvailable(request);
    test.skip(
      !available,
      `OOS fixture "${oosProductSlug()}" missing or in stock — seed QA/docs/sql/insert-qa-oos-fixture.sql on the API DB`,
    );
  });

  test("Guest: out-of-stock PDP disables add to cart @pdp @e2e", async ({
    page,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const copy = extendedUiStrings(locale);
    const slug = oosProductSlug();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    await expect(page.getByTestId("qa-pdp-inventory")).toHaveText(copy.outOfStock);
    await expect(page.getByTestId("qa-pdp-atc-primary")).toBeDisabled();
  });
});
