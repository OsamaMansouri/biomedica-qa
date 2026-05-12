import { test, expect } from "@playwright/test";

import {
  headerSearchButton,
  openStorefrontHome,
  waitForStorefrontNotLoading,
} from "../utils/openApp";
import { smoke } from "../i18n/strings";

test.describe("smoke: search sheet (desktop)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("search opens sheet with input", { tag: "@smoke" }, async ({
    page,
  }, testInfo) => {
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
});
