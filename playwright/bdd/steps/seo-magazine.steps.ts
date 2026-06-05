import { expect } from "@playwright/test";

import {
  magazineSmoke,
  smokeMagazineArticleSlugForLocale,
  STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG,
} from "../i18n/strings";
import { expectCanonical, expectHreflangAlternates } from "../utils/seoHelpers";
import { waitForStorefrontNotLoading } from "../utils/openApp";
import { Then } from "./fixtures";
import { bddLocale } from "./helpers";

Then("the PDP has canonical and hreflang meta tags", async ({ page, $testInfo }) => {
  const locale = bddLocale($testInfo);
  const slug = (
    process.env.PLAYWRIGHT_TEST_PRODUCT_SLUG || STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG
  ).trim();

  await expectCanonical(page, new RegExp(`/product/${slug}`));
  await expectHreflangAlternates(page, /\/fr\/product\//, /\/en\/product\//);
  expect(page.url()).toContain(`/${locale}/product/`);
});

Then("the magazine article has canonical and hreflang meta tags", async ({ page, $testInfo }) => {
  const locale = bddLocale($testInfo);
  const slug = smokeMagazineArticleSlugForLocale(locale);

  if ((await page.getByRole("main").getByRole("heading", { level: 1 }).count()) === 0) {
    $testInfo.skip(true, `magazine article not found: ${slug}`);
  }

  await expectCanonical(page, new RegExp(`/magazine/${slug}`));
  await expectHreflangAlternates(page, /\/fr\/magazine\//, /\/en\/magazine\//);
  expect(page.url()).toContain(`/${locale}/magazine/`);
});

Then("the magazine listing title is visible", async ({ page, $testInfo }) => {
  const copy = magazineSmoke($testInfo);
  await expect(page.getByRole("heading", { name: copy.listingTitle, level: 1 })).toBeVisible();
});

Then("the first article card links to an article", async ({ page }) => {
  const link = page.locator("main a[href*='/magazine/']").first();
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", /\/magazine\//);
});

Then("the magazine article title is visible", async ({ page, $testInfo }) => {
  const copy = magazineSmoke($testInfo);
  await expect(page.getByRole("heading", { name: copy.articleTitle, level: 1 })).toBeVisible();
});

Then("the magazine section title is visible", async ({ page, $testInfo }) => {
  const copy = magazineSmoke($testInfo);
  await expect(page.getByRole("heading", { name: copy.sectionLabel, level: 1 })).toBeVisible();
});

Then("the magazine topics title is visible", async ({ page, $testInfo }) => {
  const copy = magazineSmoke($testInfo);
  await expect(page.getByRole("heading", { name: copy.topicsIndexTitle, level: 1 })).toBeVisible();
});
