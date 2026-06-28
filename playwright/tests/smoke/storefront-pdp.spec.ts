import { test, expect } from "@playwright/test";



import { localeFromProject } from "../i18n/locale";

import { productUiStrings, smoke } from "../i18n/strings";

import { defaultProductSlug } from "../utils/cartFlow";

import { waitForStorefrontNotLoading } from "../utils/openApp";



test.describe("smoke: PDP", () => {

  test("Default product PDP shows add to cart @pdp @smoke", async ({ page }) => {

    await page.goto(`product/${defaultProductSlug()}`, { waitUntil: "domcontentloaded" });

    const addToCart = page.getByTestId("qa-pdp-atc-primary");

    await expect(addToCart).toBeVisible();

    await expect(addToCart).toBeEnabled();

  });



  test("PDP shows title price and gallery image @pdp @smoke", async ({ page }) => {

    await page.goto(`product/${defaultProductSlug()}`, { waitUntil: "domcontentloaded" });

    await waitForStorefrontNotLoading(page);



    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await expect(page.locator("main").getByRole("img").first()).toBeVisible();

    await expect(page.locator("main .tabular-nums").first()).toBeVisible();

  });



  test("PDP breadcrumb links home and shop @pdp @smoke", async ({ page }, testInfo) => {

    const ui = smoke(testInfo);

    await page.goto(`product/${defaultProductSlug()}`, { waitUntil: "domcontentloaded" });



    const crumb = page.getByRole("navigation", { name: "Breadcrumb" });

    await expect(crumb.getByRole("link", { name: ui.navHome })).toBeVisible();

    await expect(crumb.getByRole("link", { name: ui.navShop })).toBeVisible();

  });



  test("PDP reviews link opens reviews section @pdp @smoke", async ({ page }, testInfo) => {

    const product = productUiStrings(localeFromProject(testInfo));

    await page.goto(`product/${defaultProductSlug()}`, { waitUntil: "domcontentloaded" });



    await page.getByRole("link", { name: product.seeReviews }).click();

    await expect(page.locator("#reviews")).toBeVisible();

    await expect(

      page.locator("#reviews").getByRole("heading", { name: product.reviewsTitle, level: 2 }),

    ).toBeVisible();

  });

});


