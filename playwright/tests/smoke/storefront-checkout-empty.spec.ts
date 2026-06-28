import { test, expect } from "@playwright/test";

import { smoke } from "../i18n/strings";

test.describe("smoke: checkout (empty cart)", () => {
  test("Checkout route shows empty state and back to shop @checkout @smoke", async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);
    await page.goto("checkout", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { name: ui.checkoutTitle, level: 1 }),
    ).toBeVisible();
    await expect(page.getByText(ui.emptyCheckoutLine)).toBeVisible();
    await expect(
      page.getByRole("link", { name: ui.continueShopping }),
    ).toBeVisible();
  });
});
