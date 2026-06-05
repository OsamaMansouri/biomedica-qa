import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import {
  E2E_SHOP_BAIN_CATEGORY_SLUG,
  e2eShopBainCategoryLabel,
  shopUiStrings,
} from "../i18n/strings";
import { fetchShopLastPage } from "../utils/catalogApi";
import {
  expectPricesSorted,
  readShopCardPricesMad,
  selectShopSort,
} from "../utils/shopSort";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: shop pagination and filter state", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Guest: page 2 keeps sort in URL and reloads product grid @shop @e2e", async ({
    page,
    request,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const shop = shopUiStrings(locale);
    const lastPage = await fetchShopLastPage(request);
    test.skip(lastPage < 2, "catalog has fewer than 2 shop pages");

    await page.goto("shop?sort=price-asc", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    const firstSlugPage1 = await page
      .locator("main article")
      .first()
      .locator('a[href*="/product/"]')
      .first()
      .getAttribute("href");

    await Promise.all([
      page.waitForURL(/[?&]page=2(?:&|$)/, { waitUntil: "commit" }),
      page.getByRole("link", { name: shop.pagingNext }).click(),
    ]);
    await waitForStorefrontNotLoading(page);

    await expect(page).toHaveURL(/sort=price-asc/);
    await expect(page).toHaveURL(/page=2/);

    const firstSlugPage2 = await page
      .locator("main article")
      .first()
      .locator('a[href*="/product/"]')
      .first()
      .getAttribute("href");
    expect(firstSlugPage2).not.toBe(firstSlugPage1);
  });

  test("Guest: Bain category filter and price ascending keep URL params @shop @e2e", async ({
    page,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const shop = shopUiStrings(locale);
    const categoryLabel = e2eShopBainCategoryLabel(locale);

    await page.goto("shop", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    await page.getByRole("button", { name: shop.showFilters }).click();
    const filterSheet = page.getByRole("dialog").filter({
      has: page.getByRole("heading", { name: shop.browseBy }),
    });
    const browseNav = filterSheet.getByRole("navigation", {
      name: shop.browseBy,
    });
    const bainLink = browseNav
      .locator(`a[href*="category=${E2E_SHOP_BAIN_CATEGORY_SLUG}"]`)
      .first();
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

    await selectShopSort(page, "price-asc", shop.sortPriceAsc);
    await waitForStorefrontNotLoading(page);

    await expect(page).toHaveURL(
      new RegExp(
        `[?&]category=${E2E_SHOP_BAIN_CATEGORY_SLUG}.*sort=price-asc|sort=price-asc.*category=${E2E_SHOP_BAIN_CATEGORY_SLUG}`,
      ),
    );

    const prices = await readShopCardPricesMad(page);
    expectPricesSorted(prices, "price-asc");

    await expect(
      page.getByRole("link", { name: categoryLabel, exact: true }).first(),
    ).toBeVisible();
  });
});
