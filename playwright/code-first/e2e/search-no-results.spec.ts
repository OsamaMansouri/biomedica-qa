import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { extendedUiStrings, smoke } from "../i18n/strings";
import {
  headerSearchButton,
  openStorefrontHome,
  waitForStorefrontNotLoading,
} from "../utils/openApp";

test.describe("E2E: search sheet", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Guest: nonsense query shows empty state @search @e2e", async ({ page }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const ui = smoke(testInfo);
    const copy = extendedUiStrings(locale);

    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);
    await headerSearchButton(page, ui.navSearch).click();

    const dialog = page.getByRole("dialog");
    await dialog.getByPlaceholder(ui.searchPlaceholder).fill("zzzznomatchqa999");
    await expect(dialog.getByText(copy.searchNoResults)).toBeVisible({
      timeout: 15_000,
    });
  });
});
