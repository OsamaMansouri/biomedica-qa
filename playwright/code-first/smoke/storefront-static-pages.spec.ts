import { test, expect } from "@playwright/test";

import { smoke } from "../i18n/strings";

test.describe("smoke: static content pages", () => {
  test("FAQ hero and main @smoke", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await page.goto("faq", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.faqHeroTitle, level: 1 }),
    ).toBeVisible();
  });

  test("Coup de cœur hero @smoke", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await page.goto("coup-de-coeur", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.coupDeCoeurHeroTitle, level: 1 }),
    ).toBeVisible();
  });

  test("Privacy policy hero @smoke", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await page.goto("privacy", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.privacyHeroTitle, level: 1 }),
    ).toBeVisible();
  });

  test("FAQ accordion expands first question @smoke", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await page.goto("faq", { waitUntil: "domcontentloaded" });

    const trigger = page.getByRole("button", { name: ui.faqFirstQuestion });
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("Coup de cœur lists product cards when catalog has picks @shop @smoke", async ({
    page,
  }) => {
    await page.goto("coup-de-coeur", { waitUntil: "domcontentloaded" });
    const cards = page.locator("main article");
    if ((await cards.count()) === 0) {
      test.skip(true, "No coup de cœur products configured");
    }
    await expect(cards.first().locator('a[href*="/product/"]').first()).toBeVisible();
  });
});
