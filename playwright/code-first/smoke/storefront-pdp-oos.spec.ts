import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { extendedUiStrings } from "../i18n/strings";
import { outOfStockFixtureAvailable, oosProductSlug } from "../utils/catalogApi";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("smoke: PDP out of stock fixture", () => {
  test.beforeAll(async ({ request }) => {
    const available = await outOfStockFixtureAvailable(request);
    test.skip(
      !available,
      `OOS fixture "${oosProductSlug()}" missing or in stock — seed QA/docs/sql/insert-qa-oos-fixture.sql on the API DB`,
    );
  });

  test("Out-of-stock fixture PDP disables add to cart @pdp @smoke", async ({
    page,
  }, testInfo) => {
    const slug = oosProductSlug();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    await expect(page.getByTestId("qa-pdp-inventory")).toHaveText(
      extendedUiStrings(localeFromProject(testInfo)).outOfStock,
    );
    await expect(page.getByTestId("qa-pdp-atc-primary")).toBeDisabled();
  });
});
