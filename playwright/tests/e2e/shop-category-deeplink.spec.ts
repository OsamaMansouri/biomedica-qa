import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import {
  E2E_SHOP_BAIN_CATEGORY_SLUG,
  e2eShopBainCategoryLabel,
  shopUiStrings,
  smoke,
} from "../i18n/strings";
import { firstShopCard, waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: shop category deep link", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Guest: shop?category=bain loads filtered grid @shop @e2e", async ({
    page,
  }, testInfo) => {
    const categoryLabel = e2eShopBainCategoryLabel(localeFromProject(testInfo));

    await page.goto(`shop?category=${E2E_SHOP_BAIN_CATEGORY_SLUG}`, {
      waitUntil: "domcontentloaded",
    });
    await waitForStorefrontNotLoading(page);

    await expect(page).toHaveURL(new RegExp(`category=${E2E_SHOP_BAIN_CATEGORY_SLUG}`));
    await expect(firstShopCard(page)).toBeVisible({ timeout: 30_000 });
    await expect(
      page.getByRole("link", { name: categoryLabel, exact: true }).first(),
    ).toBeVisible();
  });

  test("Guest: shop card add to cart opens cart drawer @shop @cart @e2e", async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);

    await page.goto("shop", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);
    const card = firstShopCard(page);
    await expect(card).toBeVisible({ timeout: 30_000 });

    await card.hover();
    await card.getByTestId("qa-atc").click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: ui.cartSheetTitle })).toBeVisible();
    await expect(dialog.getByTestId("qa-cart-checkout")).toBeVisible();
  });
});
