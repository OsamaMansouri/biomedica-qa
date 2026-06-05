import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { extendedUiStrings } from "../i18n/strings";
import { defaultProductSlug } from "../utils/cartFlow";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: PDP cross-sell", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Guest: cross-sell excludes current product and opens another PDP @pdp @e2e", async ({
    page,
  }, testInfo) => {
    const copy = extendedUiStrings(localeFromProject(testInfo));
    const slug = defaultProductSlug();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    const section = page.getByTestId("qa-pdp-cross-sell");
    test.skip((await section.count()) === 0, "No cross-sell block for this product");

    await expect(
      section.getByRole("heading", { name: copy.crossSellTitle, level: 2 }),
    ).toBeVisible();

    const cardLink = section.locator('a[href*="/product/"]').first();
    await expect(cardLink).toBeVisible();
    await expect(cardLink).not.toHaveAttribute("href", new RegExp(`/product/${slug}`));

    await cardLink.click();
    await waitForStorefrontNotLoading(page);
    await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).not.toHaveURL(new RegExp(`/product/${slug}(?:/|$)`));
  });
});
