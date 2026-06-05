import { expect } from "@playwright/test";

import {
  e2eMagazineProductArticleSlug,
  e2eMagazineProductLinkSlug,
  extendedUiStrings,
  shopUiStrings,
} from "../i18n/strings";
import { headerCartButton, waitForStorefrontNotLoading } from "../utils/openApp";
import { Given, When, Then } from "./fixtures";
import { bddLocale, bddSmoke } from "./helpers";

Given("I open the magazine article with a product link", async ({ page, $testInfo }) => {
  const slug = e2eMagazineProductArticleSlug(bddLocale($testInfo));
  await page.goto(`magazine/${slug}`, { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);
});

When("I follow the product link and add to cart", async ({ page, $testInfo }) => {
  const productSlug = e2eMagazineProductLinkSlug();
  const productLink = page
    .locator('a[href*="/product/"]')
    .filter({ hasText: /cristaux|eucalyptus|crystals/i })
    .first();
  const fallback = page.locator(`a[href*="/product/${productSlug}"]`).first();
  const link = (await productLink.count()) > 0 ? productLink : fallback;
  await expect(link).toBeVisible();
  await link.click();
  await page.waitForURL(/\/product\//, { waitUntil: "commit" });
  await page.getByTestId("qa-pdp-atc-primary").click();
});

Then("the featured products section is visible", async ({ page, $testInfo }) => {
  const copy = extendedUiStrings(bddLocale($testInfo));
  await expect(page.getByTestId("qa-home-featured")).toBeVisible();
  await expect(page.getByText(copy.featuredTitle)).toBeVisible();
});

Then("the URL contains the project locale", async ({ page, $testInfo }) => {
  const locale = bddLocale($testInfo);
  await expect(page).toHaveURL(new RegExp(`\\/${locale}(?:\\/|$)`));
});

Then("the main landmark is visible", async ({ page }) => {
  await expect(page.getByRole("main")).toBeVisible();
});

Then("the footer shows contact email link", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  await expect(page.getByRole("link", { name: ui.footerEmail })).toBeVisible();
});

Then("the footer shows Instagram link", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  await expect(page.getByRole("link", { name: ui.socialInstagram })).toBeVisible();
});

Then("the primary navigation shows home products and cart", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  const nav = page.getByRole("navigation", { name: ui.mainNav });
  await expect(nav.getByRole("link", { name: ui.navHome })).toBeVisible();
  await expect(nav.getByRole("link", { name: ui.navProducts })).toBeVisible();
  await expect(headerCartButton(page, ui.navCart)).toBeVisible();
});

Then("the locale switcher is visible", async ({ page }) => {
  await expect(page.locator("header").getByTestId("qa-locale-switcher")).toBeVisible();
});

Then("the currency switcher is visible", async ({ page }) => {
  await expect(page.locator("header").getByTestId("qa-header-currency")).toBeVisible();
});

When("I open the mobile menu and choose shop from Produits", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  const shop = shopUiStrings(bddLocale($testInfo));
  await page.getByRole("button", { name: ui.menuAria, exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: ui.navProducts }).click();
  await dialog.getByRole("link", { name: shop.categoriesAll }).click();
});

Then("the FAQ hero title is visible", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: ui.faqHeroTitle, level: 1 }),
  ).toBeVisible();
});

When("I expand the first FAQ question", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  const trigger = page.getByRole("button", { name: ui.faqFirstQuestion });
  await expect(trigger).toBeVisible();
  await trigger.click();
});

Then("the first FAQ question is expanded", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  await expect(page.getByRole("button", { name: ui.faqFirstQuestion })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

Then("the coup de coeur hero title is visible", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: ui.coupDeCoeurHeroTitle, level: 1 }),
  ).toBeVisible();
});

Then("coup de coeur product cards are visible when configured", async ({ page }) => {
  const cards = page.locator("main article");
  if ((await cards.count()) === 0) return;
  await expect(cards.first().locator('a[href*="/product/"]').first()).toBeVisible();
});

Then("the privacy policy hero title is visible", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: ui.privacyHeroTitle, level: 1 }),
  ).toBeVisible();
});
