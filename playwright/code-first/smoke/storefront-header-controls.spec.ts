import { test, expect } from "@playwright/test";

import { openStorefrontHome, waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("smoke: header locale and currency", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Locale switcher and currency control visible @header @i18n @smoke", async ({
    page,
  }) => {
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    await expect(page.getByTestId("qa-locale-switcher")).toBeVisible();
    await expect(page.getByTestId("qa-header-currency")).toBeVisible();
  });
});
