import { test, expect } from "@playwright/test";

test.describe("smoke: shop", () => {
  test("shop listing loads", { tag: "@smoke" }, async ({ page }) => {
    await page.goto("shop", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
  });
});
