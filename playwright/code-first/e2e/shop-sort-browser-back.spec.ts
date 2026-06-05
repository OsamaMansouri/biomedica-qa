import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { smoke } from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: shop sort browser back", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Guest: browser back restores shop sort query @shop @e2e", async ({
    page,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const ui = smoke(testInfo);

    await page.goto("shop?sort=price-desc", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);
    await expect(page).toHaveURL(/sort=price-desc/);

    const homeLink = page
      .getByRole("navigation", { name: ui.mainNav })
      .getByRole("link", { name: ui.navHome });
    await Promise.all([
      page.waitForURL(new RegExp(`\\/${locale}(?:\\/|$)`), { waitUntil: "commit" }),
      homeLink.click(),
    ]);
    await expect(page).not.toHaveURL(/sort=price-desc/);

    await page.goBack({ waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);
    await expect(page).toHaveURL(/sort=price-desc/);
  });
});
