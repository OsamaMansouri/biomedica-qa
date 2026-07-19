import { test, expect, type Page } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import {
  smokeMagazineArticleSlug,
  STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG,
} from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

async function expectCanonical(page: Page, pattern: RegExp) {
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveCount(1);
  const href = await canonical.getAttribute("href");
  expect(href, "canonical href").toMatch(pattern);
}

async function expectHreflangAlternates(
  page: Page,
  frPattern: RegExp,
  enPattern: RegExp,
) {
  const fr = page.locator('link[rel="alternate"][hreflang="fr"]');
  const en = page.locator('link[rel="alternate"][hreflang="en"]');
  await expect(fr).toHaveCount(1);
  await expect(en).toHaveCount(1);
  const frHref = await fr.getAttribute("href");
  const enHref = await en.getAttribute("href");
  expect(frHref, "hreflang fr").toMatch(frPattern);
  expect(enHref, "hreflang en").toMatch(enPattern);
}

async function expectRobotsMeta(page: Page) {
  const robots = page.locator('meta[name="robots"]');
  await expect(robots.first()).toBeAttached();
  const content = (await robots.first().getAttribute("content")) ?? "";
  expect(content.toLowerCase()).toMatch(/index/);
  expect(content.toLowerCase()).toMatch(/follow/);
}

test.describe("E2E: SEO meta tags", () => {
  test("Guest: PDP exposes canonical and hreflang alternates @seo @pdp @e2e", async ({
    page,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const slug = (
      process.env.PLAYWRIGHT_TEST_PRODUCT_SLUG ||
      STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG
    ).trim();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    await expectCanonical(page, new RegExp(`/product/${slug}`));
    await expectHreflangAlternates(
      page,
      /\/fr\/product\//,
      /\/en\/product\//,
    );
    await expectRobotsMeta(page);
    expect(page.url()).toContain(`/${locale}/product/`);

    // Layout emits Organization/WebSite first; Product is a second ld+json on the PDP.
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd.first()).toBeAttached();
    const ldText = (await jsonLd.allTextContents()).join("\n");
    expect(ldText).toContain("Product");
  });

  test("Guest: magazine article exposes canonical and hreflang alternates @seo @magazine @e2e", async ({
    page,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const slug = smokeMagazineArticleSlug(testInfo);

    await page.goto(`articles/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    if ((await page.getByRole("main").getByRole("heading", { level: 1 }).count()) === 0) {
      test.skip(true, `magazine article not found: ${slug}`);
    }

    await expectCanonical(page, new RegExp(`/articles/${slug}`));
    await expectHreflangAlternates(
      page,
      /\/fr\/articles\//,
      /\/en\/articles\//,
    );
    await expectRobotsMeta(page);
    expect(page.url()).toContain(`/${locale}/articles/`);
  });

  test("Guest: shop page 2 is noindex when paginated @seo @shop @e2e", async ({
    page,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    await page.goto("shop?page=2", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    const robots = page.locator('meta[name="robots"]');
    await expect(robots.first()).toBeAttached();
    const content = ((await robots.first().getAttribute("content")) ?? "").toLowerCase();
    expect(content).toMatch(/noindex/);
    expect(page.url()).toContain(`/${locale}/shop`);
  });
});
