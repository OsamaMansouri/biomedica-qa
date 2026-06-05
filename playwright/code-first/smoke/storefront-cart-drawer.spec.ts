import { test, expect } from "@playwright/test";

import {
  headerCartButton,
  openStorefrontHome,
  sheetCloseButton,
  waitForStorefrontNotLoading,
} from "../utils/openApp";
import { smoke } from "../i18n/strings";

test.describe("smoke: cart drawer", () => {
  test("Empty cart sheet from header @cart @smoke", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    await headerCartButton(page, ui.navCart).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: ui.cartSheetTitle }),
    ).toBeVisible();
    await expect(dialog.getByText(ui.cartEmpty).first()).toBeVisible();
    await expect(
      dialog.getByRole("link", { name: ui.continueShopping }),
    ).toBeVisible();
  });

  test("Empty cart hides checkout CTA @cart @smoke", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    await headerCartButton(page, ui.navCart).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId("qa-cart-checkout")).not.toBeVisible();
  });

  test("Close cart drawer with close button @cart @smoke", async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    await headerCartButton(page, ui.navCart).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await sheetCloseButton(page).click();
    await expect(dialog).not.toBeVisible();
  });

  test("Close cart drawer with Escape @cart @smoke", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    await headerCartButton(page, ui.navCart).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("Close cart drawer by clicking overlay @cart @smoke", async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    await headerCartButton(page, ui.navCart).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.locator('[data-slot="sheet-overlay"]').click({ position: { x: 8, y: 8 } });
    await expect(dialog).not.toBeVisible();
  });

  test("Continue shopping from empty cart opens shop @cart @shop @smoke", async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    await headerCartButton(page, ui.navCart).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/shop(?:\?|$)/, { waitUntil: "commit" }),
      dialog.getByRole("link", { name: ui.continueShopping }).click(),
    ]);
    await expect(page.getByRole("main")).toBeVisible();
  });
});
