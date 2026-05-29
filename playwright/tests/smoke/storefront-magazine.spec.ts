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
  test("magazine listing loads", { tag: "@smoke" }, async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    await page.goto("magazine", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.listingTitle, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });

  test("magazine article loads", { tag: "@smoke" }, async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    const slug = smokeMagazineArticleSlug(testInfo);
    await page.goto(`magazine/${slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.articleTitle, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });

  test("magazine section hub loads", { tag: "@smoke" }, async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    const sectionSlug = smokeMagazineSectionSlug();
    await page.goto(`magazine/${sectionSlug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.sectionLabel, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });

  test("magazine topics index loads", { tag: "@smoke" }, async ({ page }, testInfo) => {
    const ui = magazineSmoke(testInfo);
    await page.goto("magazine/topics", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.topicsIndexTitle, level: 1 }),
    ).toBeVisible();
    await expectMetaDescription(page);
  });
});
