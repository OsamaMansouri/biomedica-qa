import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { shopUiStrings, smoke } from "../i18n/strings";
import { openStorefrontHome, waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("smoke: mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("Mobile menu opens shop from Produits submenu @header @mobile @smoke", async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);
    const shop = shopUiStrings(localeFromProject(testInfo));

    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);
    await page.getByRole("button", { name: ui.menuAria, exact: true }).click();

    const drawer = page.getByRole("dialog");
    await drawer.getByRole("button", { name: ui.navProducts }).click();
    await drawer.getByRole("link", { name: shop.categoriesAll }).click();

    await expect(page).toHaveURL(/\/shop/);
  });
});
