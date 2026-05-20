import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import {
  E2E_SHOP_BAIN_CATEGORY_SLUG,
  e2eShopBainCategoryLabel,
  shopUiStrings,
  smoke,
} from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: shop → Bain filter → PDP → cart", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Bain in filter sheet → shop URL → first product → category above title → add to cart", async ({
    page,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const categoryLabel = e2eShopBainCategoryLabel(locale);
    const ui = smoke(testInfo);
    const shop = shopUiStrings(locale);

    await page.goto("shop", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);
    await expect(page.getByRole("main")).toBeVisible();

    await page.getByRole("button", { name: shop.showFilters }).click();
    const filterSheet = page.getByRole("dialog").filter({
      has: page.getByRole("heading", { name: shop.browseBy }),
    });
    await expect(
      filterSheet.getByRole("heading", { name: shop.browseBy }),
    ).toBeVisible();

    const browseNav = filterSheet.getByRole("navigation", {
      name: shop.browseBy,
    });

    const bainByHref = browseNav
      .locator(`a[href*="category=${E2E_SHOP_BAIN_CATEGORY_SLUG}"]`)
      .first();
    const bainByLabel = browseNav.getByRole("link", {
      name: categoryLabel,
      exact: true,
    });
    const bainLink = (await bainByHref.count()) > 0 ? bainByHref : bainByLabel;

    await expect(bainLink).toBeVisible({ timeout: 15_000 });
    await Promise.all([
      page.waitForURL(
        new RegExp(`[?&]category=${E2E_SHOP_BAIN_CATEGORY_SLUG}(?:&|$)`),
        { waitUntil: "commit" },
      ),
      bainLink.click(),
    ]);
    await waitForStorefrontNotLoading(page);

    await expect(page.locator("main article").first()).toBeVisible({
      timeout: 30_000,
    });
    const firstProduct = page
      .locator("main article")
      .first()
      .getByRole("link")
      .first();
    await Promise.all([
      page.waitForURL(/\/product\//, { waitUntil: "commit" }),
      firstProduct.click(),
    ]);
    await waitForStorefrontNotLoading(page);

    const main = page.getByRole("main");
    const productTitle = main.getByRole("heading", { level: 1 });
    await expect(productTitle).toBeVisible();
    const categoryEyebrow = productTitle.locator(
      "xpath=preceding-sibling::a[1]",
    );
    await expect(categoryEyebrow).toHaveText(categoryLabel);
    await expect(categoryEyebrow).toHaveAttribute(
      "href",
      new RegExp(`category=${E2E_SHOP_BAIN_CATEGORY_SLUG}`),
    );

    await page.getByTestId("qa-pdp-atc-primary").click();
    const cartSheet = page.getByRole("dialog");
    await expect(
      cartSheet.getByRole("heading", { name: ui.cartSheetTitle }),
    ).toBeVisible();
    await expect(cartSheet.getByTestId("qa-cart-checkout")).toBeVisible();
  });
});
