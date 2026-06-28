import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { shopUiStrings } from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";
import {
  expectPricesSorted,
  readShopCardPricesMad,
  selectShopSort,
  type ShopPriceSort,
} from "../utils/shopSort";

test.describe("E2E: shop sort by price", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const sort of ["price-asc", "price-desc"] as const satisfies ShopPriceSort[]) {
    test(`Guest: sort ${sort} orders product cards on shop grid @shop @e2e`, async ({ page }, testInfo) => {
      const locale = localeFromProject(testInfo);
      const shop = shopUiStrings(locale);
      const sortLabel =
        sort === "price-asc" ? shop.sortPriceAsc : shop.sortPriceDesc;

      await page.goto("shop", { waitUntil: "domcontentloaded" });
      await waitForStorefrontNotLoading(page);
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.locator("main article").first()).toBeVisible({
        timeout: 30_000,
      });

      await selectShopSort(page, sort, sortLabel);
      await waitForStorefrontNotLoading(page);

      const prices = await readShopCardPricesMad(page);
      expectPricesSorted(prices, sort);
    });
  }
});
