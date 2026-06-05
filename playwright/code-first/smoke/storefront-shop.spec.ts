import { test, expect } from "@playwright/test";



import { localeFromProject } from "../i18n/locale";

import { productUiStrings, shopUiStrings } from "../i18n/strings";

import { firstShopCard, waitForStorefrontNotLoading } from "../utils/openApp";



test.describe("smoke: shop", () => {

  test("Shop listing loads @shop @smoke", async ({ page }) => {

    await page.goto("shop", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("main")).toBeVisible();

  });



  test("Shop grid first product card links to PDP @shop @smoke", async ({ page }) => {

    await page.goto("shop", { waitUntil: "domcontentloaded" });

    await waitForStorefrontNotLoading(page);



    const link = firstShopCard(page).locator('a[href*="/product/"]').first();

    await expect(link).toBeVisible();

    await expect(link).toHaveAttribute("href", /\/product\//);

  });



  test("Shop filter sheet opens from toolbar @shop @smoke", async ({ page }, testInfo) => {

    const shop = shopUiStrings(localeFromProject(testInfo));

    await page.goto("shop", { waitUntil: "domcontentloaded" });

    await waitForStorefrontNotLoading(page);



    await page.getByRole("button", { name: shop.showFilters }).click();

    await expect(page.getByRole("heading", { name: shop.browseBy })).toBeVisible();

  });

});



test.describe("smoke: shop card add to cart (desktop)", () => {

  test.use({ viewport: { width: 1440, height: 900 } });



  test("Shop card shows add to cart on hover @shop @cart @smoke", async ({ page }, testInfo) => {

    const product = productUiStrings(localeFromProject(testInfo));

    await page.goto("shop", { waitUntil: "domcontentloaded" });

    await waitForStorefrontNotLoading(page);



    const card = firstShopCard(page);

    await expect(card).toBeVisible({ timeout: 30_000 });

    await card.hover();



    const atc = card.getByTestId("qa-atc");

    await expect(atc).toBeVisible();

    await expect(atc).toHaveAttribute("aria-label", product.addToCartIconAria);

  });

});


