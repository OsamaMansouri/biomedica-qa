import { test, expect, type Page } from "@playwright/test";

import {
  magazineSmoke,
  smokeMagazineArticleSlug,
  smokeMagazineSectionSlug,
} from "../i18n/strings";

async function expectMetaDescription(page: Page) {
  const meta = page.locator('meta[name="description"]');
  await expect(meta).toHaveCount(1);
  const content = await meta.getAttribute("content");
  expect(content?.trim().length ?? 0).toBeGreaterThan(20);
  expect(content).not.toMatch(/\u2014/);
}

test.describe("smoke: magazine", () => {
  test("Magazine listing loads @magazine @smoke", async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    await page.goto("articles", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.listingTitle, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });

  test("Magazine listing first article card is clickable @magazine @smoke", async ({
    page,
  }) => {
    await page.goto("articles", { waitUntil: "domcontentloaded" });
    const firstArticle = page.locator("main a[href*='/articles/']").first();
    await expect(firstArticle).toBeVisible();
    await expect(firstArticle).toHaveAttribute("href", /\/magazine\//);
  });

  test("Magazine article loads @magazine @smoke", async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    const slug = smokeMagazineArticleSlug(testInfo);
    await page.goto(`articles/${slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.articleTitle, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });

  test("Magazine section hub loads @magazine @smoke", async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    const sectionSlug = smokeMagazineSectionSlug();
    await page.goto(`articles/${sectionSlug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.sectionLabel, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });

  test("Magazine topics index loads @magazine @smoke", async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    await page.goto("articles/topics", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.topicsIndexTitle, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });
});
