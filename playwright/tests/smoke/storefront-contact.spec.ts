import { test, expect } from "@playwright/test";

import { smoke } from "../i18n/strings";

test.describe("smoke: contact", () => {
  test("Contact page loads with form @contact @smoke", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await page.goto("contact", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: ui.contactFormHeading, level: 2 }),
    ).toBeVisible();
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('form input[name="name"]')).toBeVisible();
    await expect(page.locator('form input[name="email"]')).toBeVisible();
  });
});
