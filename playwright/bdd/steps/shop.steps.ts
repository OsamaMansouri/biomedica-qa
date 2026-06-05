import { expect } from "@playwright/test";

import {
  E2E_SHOP_BAIN_CATEGORY_SLUG,
  e2eShopBainCategoryLabel,
  shopUiStrings,
} from "../i18n/strings";
import { fetchShopLastPage } from "../utils/catalogApi";
import { firstShopCard, waitForStorefrontNotLoading } from "../utils/openApp";
import {
  expectPricesSorted,
  readShopCardPricesMad,
  selectShopSort,
} from "../utils/shopSort";
import { useDesktopViewport } from "../utils/viewport";
import { Given, When, Then } from "./fixtures";
import { bddLocale, bddSmoke } from "./helpers";
import { scenarioState } from "./scenarioState";

Given("the shop catalog has at least 2 pages", async () => {
  // Catalog check runs in When/Then steps via fetchShopLastPage.
});

When("I hover the first shop card and click add to cart", async ({ page, $testInfo }) => {
  await useDesktopViewport(page);
  const card = firstShopCard(page);
  await expect(card).toBeVisible({ timeout: 30_000 });
  await card.hover();
  await card.getByTestId("qa-atc").click();
});

When("I filter by Bain open first product and add to cart", async ({ page, $testInfo }) => {
  await useDesktopViewport(page);
  const locale = bddLocale($testInfo);
  const categoryLabel = e2eShopBainCategoryLabel(locale);
  const shop = shopUiStrings(locale);
  const ui = bddSmoke($testInfo);

  await page.goto("shop", { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);

  await page.getByRole("button", { name: shop.showFilters }).click();
  const filterSheet = page.getByRole("dialog").filter({
    has: page.getByRole("heading", { name: shop.browseBy }),
  });
  const browseNav = filterSheet.getByRole("navigation", { name: shop.browseBy });
  const bainByHref = browseNav
    .locator(`a[href*="category=${E2E_SHOP_BAIN_CATEGORY_SLUG}"]`)
    .first();
  const bainByLabel = browseNav.getByRole("link", { name: categoryLabel, exact: true });
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

  const firstProduct = page.locator("main article").first().getByRole("link").first();
  await Promise.all([
    page.waitForURL(/\/product\//, { waitUntil: "commit" }),
    firstProduct.click(),
  ]);
  await waitForStorefrontNotLoading(page);
  await page.getByTestId("qa-pdp-atc-primary").click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: ui.cartSheetTitle }),
  ).toBeVisible();
});

When("I go to shop page 2 with price ascending sort", async ({ page, request, $testInfo }) => {
  await useDesktopViewport(page);
  const locale = bddLocale($testInfo);
  const shop = shopUiStrings(locale);
  const lastPage = await fetchShopLastPage(request);
  if (lastPage < 2) {
    $testInfo.skip(true, "catalog has fewer than 2 shop pages");
  }

  await page.goto("shop?sort=price-asc", { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);

  scenarioState.shopFirstProductHrefPage1 =
    (await page
      .locator("main article")
      .first()
      .locator('a[href*="/product/"]')
      .first()
      .getAttribute("href")) ?? "";

  await Promise.all([
    page.waitForURL(/[?&]page=2(?:&|$)/, { waitUntil: "commit" }),
    page.getByRole("link", { name: shop.pagingNext }).click(),
  ]);
  await waitForStorefrontNotLoading(page);
});

When("I filter shop by Bain category and sort price ascending", async ({ page, $testInfo }) => {
  const locale = bddLocale($testInfo);
  const shop = shopUiStrings(locale);
  const categoryLabel = e2eShopBainCategoryLabel(locale);

  await page.goto("shop", { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);

  await page.getByRole("button", { name: shop.showFilters }).click();
  const filterSheet = page.getByRole("dialog").filter({
    has: page.getByRole("heading", { name: shop.browseBy }),
  });
  const browseNav = filterSheet.getByRole("navigation", { name: shop.browseBy });
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
  await expect(page.locator("main article").first()).toBeVisible({ timeout: 30_000 });

  await selectShopSort(page, "price-asc", shop.sortPriceAsc);
  await waitForStorefrontNotLoading(page);
});

When("I sort by price ascending", async ({ page, $testInfo }) => {
  const shop = shopUiStrings(bddLocale($testInfo));
  await selectShopSort(page, "price-asc", shop.sortPriceAsc);
  await waitForStorefrontNotLoading(page);
});

When("I sort by price descending", async ({ page, $testInfo }) => {
  const shop = shopUiStrings(bddLocale($testInfo));
  await selectShopSort(page, "price-desc", shop.sortPriceDesc);
  await waitForStorefrontNotLoading(page);
});

When("I navigate to home from the header", async ({ page, $testInfo }) => {
  await useDesktopViewport(page);
  const ui = bddSmoke($testInfo);
  const locale = bddLocale($testInfo);
  const homeLink = page
    .getByRole("navigation", { name: ui.mainNav })
    .getByRole("link", { name: ui.navHome });
  await Promise.all([
    page.waitForURL(new RegExp(`\\/${locale}(?:\\/|$)`), { waitUntil: "commit" }),
    homeLink.click(),
  ]);
  await expect(page).not.toHaveURL(/sort=price-desc/);
});

When("I go back in the browser", async ({ page }) => {
  await page.goBack({ waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);
});

When("I open the shop filter sheet", async ({ page, $testInfo }) => {
  const shop = shopUiStrings(bddLocale($testInfo));
  await page.getByRole("button", { name: shop.showFilters }).click();
});

When("I hover the first shop card", async ({ page }) => {
  await firstShopCard(page).hover();
});

Then("the shop main landmark is visible", async ({ page }) => {
  await expect(page.getByRole("main")).toBeVisible();
});

Then("the first shop card links to a product page", async ({ page }) => {
  const link = page.locator("main article").first().locator('a[href*="/product/"]').first();
  await expect(link).toHaveAttribute("href", /\/product\//);
});

Then("the shop filter sheet browse heading is visible", async ({ page, $testInfo }) => {
  const shop = shopUiStrings(bddLocale($testInfo));
  await expect(page.getByRole("heading", { name: shop.browseBy })).toBeVisible();
});

Then("the shop card add to cart button is visible", async ({ page, $testInfo }) => {
  const copy = shopUiStrings(bddLocale($testInfo));
  await expect(page.locator("main article").first().getByTestId("qa-atc")).toBeVisible();
});

Then("the shop grid is visible with Bain category active", async ({ page, $testInfo }) => {
  const categoryLabel = e2eShopBainCategoryLabel(bddLocale($testInfo));
  await expect(page).toHaveURL(new RegExp(`category=${E2E_SHOP_BAIN_CATEGORY_SLUG}`));
  await expect(firstShopCard(page)).toBeVisible({ timeout: 30_000 });
  await expect(
    page.getByRole("link", { name: categoryLabel, exact: true }).first(),
  ).toBeVisible();
});

Then(
  "the URL keeps sort and page params and the grid changes",
  async ({ page }) => {
    await expect(page).toHaveURL(/sort=price-asc/);
    await expect(page).toHaveURL(/page=2/);

    const firstSlugPage2 =
      (await page
        .locator("main article")
        .first()
        .locator('a[href*="/product/"]')
        .first()
        .getAttribute("href")) ?? "";
    expect(scenarioState.shopFirstProductHrefPage1.length).toBeGreaterThan(0);
    expect(firstSlugPage2).not.toBe(scenarioState.shopFirstProductHrefPage1);
  },
);

Then(
  "the URL has category and sort params with ascending prices",
  async ({ page, $testInfo }) => {
    await expect(page).toHaveURL(
      new RegExp(
        `[?&]category=${E2E_SHOP_BAIN_CATEGORY_SLUG}.*sort=price-asc|sort=price-asc.*category=${E2E_SHOP_BAIN_CATEGORY_SLUG}`,
      ),
    );
    const prices = await readShopCardPricesMad(page);
    expectPricesSorted(prices, "price-asc");
    const categoryLabel = e2eShopBainCategoryLabel(bddLocale($testInfo));
    await expect(
      page.getByRole("link", { name: categoryLabel, exact: true }).first(),
    ).toBeVisible();
  },
);

Then("product prices on the grid are ascending", async ({ page }) => {
  const prices = await readShopCardPricesMad(page);
  expectPricesSorted(prices, "price-asc");
});

Then("product prices on the grid are descending", async ({ page }) => {
  const prices = await readShopCardPricesMad(page);
  expectPricesSorted(prices, "price-desc");
});

Then("the shop URL still has price descending sort", async ({ page }) => {
  await expect(page).toHaveURL(/sort=price-desc/);
});
