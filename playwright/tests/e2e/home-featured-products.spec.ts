import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { extendedUiStrings } from "../i18n/strings";
import { openStorefrontHome, waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: home featured products", () => {
  test("Guest: home featured section lists product links @home @e2e", async ({ page }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const copy = extendedUiStrings(locale);

    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    const featured = page.getByTestId("qa-home-featured");
    if ((await featured.count()) === 0) {
      test.skip(true, "no storefront_featured products on home");
    }

    await expect(
      featured.getByRole("heading", { name: copy.featuredTitle, level: 2 }),
    ).toBeVisible();
    await expect(featured.locator('a[href*="/product/"]').first()).toBeVisible();
  });
});
