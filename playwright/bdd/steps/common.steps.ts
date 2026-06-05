import { expect } from "@playwright/test";

import {
  E2E_SHOP_BAIN_CATEGORY_SLUG,
  magazineSmoke,
  smokeMagazineArticleSlugForLocale,
  smokeMagazineSectionSlug,
} from "../i18n/strings";
import {
  headerCartButton,
  openStorefrontHome,
  waitForStorefrontNotLoading,
} from "../utils/openApp";
import { useDesktopViewport, useMobileViewport } from "../utils/viewport";
import { Given } from "./fixtures";
import { bddLocale, bddSmoke } from "./helpers";

Given("I am on the home page", async ({ page }) => {
  await openStorefrontHome(page);
  await waitForStorefrontNotLoading(page);
});

Given("I am on the home page on desktop", async ({ page }) => {
  await useDesktopViewport(page);
  await openStorefrontHome(page);
  await waitForStorefrontNotLoading(page);
});

Given("I am on the home page on mobile", async ({ page }) => {
  await useMobileViewport(page);
  await openStorefrontHome(page);
  await waitForStorefrontNotLoading(page);
});

Given("I am on the shop page", async ({ page }) => {
  await page.goto("shop", { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);
});

Given("I am on the shop page on desktop", async ({ page }) => {
  await useDesktopViewport(page);
  await page.goto("shop", { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);
});

Given("I open the shop page with Bain category filter", async ({ page, $testInfo }) => {
  await useDesktopViewport(page);
  await page.goto(`shop?category=${E2E_SHOP_BAIN_CATEGORY_SLUG}`, {
    waitUntil: "domcontentloaded",
  });
  await waitForStorefrontNotLoading(page);
});

Given("I open the shop page with price descending sort", async ({ page }) => {
  await useDesktopViewport(page);
  await page.goto("shop?sort=price-desc", { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);
});

Given("I am on the contact page", async ({ page }) => {
  await page.goto("contact", { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);
});

Given("I open the FAQ page", async ({ page }) => {
  await page.goto("faq", { waitUntil: "domcontentloaded" });
});

Given("I open the coup de coeur page", async ({ page }) => {
  await page.goto("coup-de-coeur", { waitUntil: "domcontentloaded" });
});

Given("I open the privacy policy page", async ({ page }) => {
  await page.goto("privacy", { waitUntil: "domcontentloaded" });
});

Given("I open the checkout page with an empty cart", async ({ page }) => {
  await page.goto("checkout", { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);
});

Given("I open the magazine listing page", async ({ page }) => {
  await page.goto("magazine", { waitUntil: "domcontentloaded" });
});

Given("I open the smoke magazine article page", async ({ page, $testInfo }) => {
  const slug = smokeMagazineArticleSlugForLocale(bddLocale($testInfo));
  await page.goto(`magazine/${slug}`, { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);
});

Given("I open the smoke magazine section hub page", async ({ page }) => {
  await page.goto(`magazine/${smokeMagazineSectionSlug()}`, {
    waitUntil: "domcontentloaded",
  });
});

Given("I open the magazine topics page", async ({ page }) => {
  await page.goto("magazine/topics", { waitUntil: "domcontentloaded" });
});
