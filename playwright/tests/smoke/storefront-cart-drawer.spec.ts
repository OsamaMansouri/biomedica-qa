import { test, expect } from "@playwright/test";

import {
  headerCartButton,
  openStorefrontHome,
  waitForStorefrontNotLoading,
} from "../utils/openApp";
import { smoke } from "../i18n/strings";

test.describe("smoke: cart drawer", () => {
  test("empty cart sheet from header", { tag: "@smoke" }, async ({
    page,
  }, testInfo) => {
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
});
