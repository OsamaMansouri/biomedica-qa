import { test, expect } from "@playwright/test";

import {
  headerSearchButton,
  openStorefrontHome,
  sheetCloseButton,
  waitForStorefrontNotLoading,
} from "../utils/openApp";
import { smoke } from "../i18n/strings";

test.describe("smoke: search sheet (desktop)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Search opens sheet with input @search @smoke", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    await headerSearchButton(page, ui.navSearch).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: ui.searchSheetTitle }),
    ).toBeVisible();
    await expect(
      dialog.getByPlaceholder(ui.searchPlaceholder),
    ).toBeVisible();
  });

  test("Search sheet closes with close button @search @smoke", async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    await headerSearchButton(page, ui.navSearch).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await sheetCloseButton(page).click();
    await expect(dialog).not.toBeVisible();
  });

  test("Search sheet closes with Escape @search @smoke", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    await headerSearchButton(page, ui.navSearch).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
