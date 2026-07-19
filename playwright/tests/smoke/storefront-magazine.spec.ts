import { test, expect, type Page } from "@playwright/test";

import {
  magazineSmoke,
  smokeMagazineArticleSlug,
  smokeMagazineSectionSlug,
} from "../i18n/strings";

/** Accept legacy /magazine/ or new /articles/ during Netlify rollout. */
const ARTICLES_PATH = /\/(magazine|articles)\//;

async function expectMetaDescription(page: Page) {
  const meta = page.locator('meta[name="description"]');
  await expect(meta).toHaveCount(1);
  const content = await meta.getAttribute("content");
  expect(content?.trim().length ?? 0).toBeGreaterThan(20);
  expect(content).not.toMatch(/\u2014/);
}

/**
 * Prefer /magazine so CI passes while Netlify still serves the old routes.
 * After front deploy, /magazine 301s to /articles and these still pass.
 */
test.describe("smoke: magazine", () => {
  test("Magazine listing loads @magazine @smoke", async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    await page.goto("magazine", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.listingTitle, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });

  test("Magazine listing first article card is clickable @magazine @smoke", async ({
    page,
  }) => {
    await page.goto("magazine", { waitUntil: "domcontentloaded" });
    const firstArticle = page
      .locator("main a[href*='/magazine/'], main a[href*='/articles/']")
      .first();
    await expect(firstArticle).toBeVisible();
    await expect(firstArticle).toHaveAttribute("href", ARTICLES_PATH);
  });

  test("Magazine article loads @magazine @smoke", async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    const slug = smokeMagazineArticleSlug(testInfo);
    await page.goto(`magazine/${slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.articleTitle, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });

  test("Magazine section hub loads @magazine @smoke", async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    const sectionSlug = smokeMagazineSectionSlug();
    await page.goto(`magazine/${sectionSlug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.sectionLabel, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });

  test("Magazine topics index loads @magazine @smoke", async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    await page.goto("magazine/topics", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.topicsIndexTitle, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });
});
