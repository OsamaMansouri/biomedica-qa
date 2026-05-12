import { test, expect } from "@playwright/test";

import { smoke } from "../i18n/strings";

test.describe("smoke: static content pages", () => {
  test("FAQ hero and main", { tag: "@smoke" }, async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await page.goto("faq", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.faqHeroTitle, level: 1 }),
    ).toBeVisible();
  });

  test("Coup de cœur hero", { tag: "@smoke" }, async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await page.goto("coup-de-coeur", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.coupDeCoeurHeroTitle, level: 1 }),
    ).toBeVisible();
  });

  test("Privacy policy hero", { tag: "@smoke" }, async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await page.goto("privacy", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.privacyHeroTitle, level: 1 }),
    ).toBeVisible();
  });
});
