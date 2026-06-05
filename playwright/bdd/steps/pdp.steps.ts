import { expect } from "@playwright/test";

import {
  extendedUiStrings,
  productUiStrings,
  STORE_FRONT_E2E_OOS_PRODUCT_SLUG,
} from "../i18n/strings";
import {
  addDefaultProductFromPdp,
  cartLineQty,
  defaultProductSlug,
} from "../utils/cartFlow";
import { waitForStorefrontNotLoading } from "../utils/openApp";
import { useMobileViewport } from "../utils/viewport";
import { Given, When, Then } from "./fixtures";
import { bddLocale, bddSmoke } from "./helpers";

Given("I open the default product page", async ({ page }) => {
  const slug = defaultProductSlug();
  await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);
});

Given("I open the default product page on mobile", async ({ page }) => {
  await useMobileViewport(page);
  const slug = defaultProductSlug();
  await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);
});

Given("I open an out-of-stock product page", async ({ page }) => {
  await page.goto(`product/${STORE_FRONT_E2E_OOS_PRODUCT_SLUG}`, {
    waitUntil: "domcontentloaded",
  });
  await waitForStorefrontNotLoading(page);
});

Given("I open a product page that does not exist", async ({ page }) => {
  await page.goto("product/this-slug-does-not-exist-qa-e2e", {
    waitUntil: "domcontentloaded",
  });
  await waitForStorefrontNotLoading(page);
});

Given("I add the default product to cart from PDP", async ({ page }) => {
  await addDefaultProductFromPdp(page);
});

When("I click add to cart on the PDP", async ({ page }) => {
  await page.getByTestId("qa-pdp-atc-primary").click();
});

When("I click see reviews on the PDP", async ({ page, $testInfo }) => {
  const copy = productUiStrings(bddLocale($testInfo));
  await page.getByRole("link", { name: copy.seeReviews }).click();
});

When("I tap the sticky add to cart bar", async ({ page }) => {
  await page.getByTestId("qa-pdp-atc-sticky").click();
});

When("I open the first cross-sell product link", async ({ page, $testInfo }) => {
  const section = page.getByTestId("qa-pdp-cross-sell");
  if ((await section.count()) === 0) {
    $testInfo.skip(true, "No cross-sell block for this product");
  }
  await section.locator('a[href*="/product/"]').first().click();
  await waitForStorefrontNotLoading(page);
});

Then("add to cart is visible and enabled on the PDP", async ({ page }) => {
  const atc = page.getByTestId("qa-pdp-atc-primary");
  await expect(atc).toBeVisible();
  await expect(atc).toBeEnabled();
});

Then("the PDP shows title price and gallery image", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("main").getByRole("img").first()).toBeVisible();
  await expect(page.locator("main .tabular-nums").first()).toBeVisible();
});

Then("the PDP breadcrumb links home and shop", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  const crumb = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(crumb.getByRole("link", { name: ui.navHome })).toBeVisible();
  await expect(crumb.getByRole("link", { name: ui.navShop })).toBeVisible();
});

Then("the reviews section is visible", async ({ page, $testInfo }) => {
  const copy = productUiStrings(bddLocale($testInfo));
  await expect(page.locator("#reviews")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: copy.reviewsTitle, level: 2 }),
  ).toBeVisible();
});

Then(
  "add to cart is disabled and inventory shows out of stock",
  async ({ page, $testInfo }) => {
    const copy = extendedUiStrings(bddLocale($testInfo));
    await expect(page.getByTestId("qa-pdp-atc-primary")).toBeDisabled();
    await expect(page.getByTestId("qa-pdp-inventory")).toContainText(copy.outOfStock);
  },
);

Then("I see the product not-found page", async ({ page, $testInfo }) => {
  const copy = extendedUiStrings(bddLocale($testInfo));
  await expect(
    page.getByRole("heading", { name: copy.notFoundTitle, level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: copy.notFoundShopCta }),
  ).toBeVisible();
});

Then("the cross-sell section shows related product cards", async ({ page, $testInfo }) => {
  const copy = extendedUiStrings(bddLocale($testInfo));
  const slug = defaultProductSlug();
  const section = page.getByTestId("qa-pdp-cross-sell");
  if ((await section.count()) === 0) return;
  await expect(
    section.getByRole("heading", { name: copy.crossSellTitle, level: 2 }),
  ).toBeVisible();
  const cardLink = section.locator('a[href*="/product/"]').first();
  await expect(cardLink).toBeVisible();
  await expect(cardLink).not.toHaveAttribute("href", new RegExp(`/product/${slug}`));
});

Then("I am on a different product page", async ({ page }) => {
  const slug = defaultProductSlug();
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page).not.toHaveURL(new RegExp(`/product/${slug}(?:/|$)`));
});

Then("the cart shows one unit of the product", async ({ page }) => {
  const slug = defaultProductSlug();
  await expect(cartLineQty(page, slug)).toHaveText("1");
});
