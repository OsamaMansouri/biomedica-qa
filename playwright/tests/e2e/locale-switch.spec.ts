import { test, expect } from "@playwright/test";

import { localeFromProject, type Locale } from "../i18n/locale";
import {
  HEADER_LOCALE,
  mainNavAriaLabel,
  navProductsLabelForLocale,
} from "../i18n/strings";
import {
  openStorefrontHome,
  waitForStorefrontNotLoading,
} from "../utils/openApp";

test.describe("E2E: header language switch", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("switch locale via menu → URL prefix and nav copy update", async ({
    page,
  }, testInfo) => {
    const from = localeFromProject(testInfo);
    const to: Locale = from === "fr" ? "en" : "fr";

    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    const lang = page.locator("header").getByTestId("qa-locale-switcher");
    await lang.getByRole("button").click();
    const menu = lang.getByRole("menu");
    await expect(menu).toBeVisible();

    const menuLabel =
      to === "en" ? HEADER_LOCALE.menuEnglish : HEADER_LOCALE.menuFrench;
    const targetItem = menu.getByRole("menuitem", { name: menuLabel });
    await expect(targetItem).toBeVisible();

    const urlRe = to === "en" ? /\/en(?:\/|$)/ : /\/fr(?:\/|$)/;
    await Promise.all([
      page.waitForURL(urlRe, { timeout: 30_000, waitUntil: "commit" }),
      targetItem.click(),
    ]);
    await waitForStorefrontNotLoading(page);

    await expect(
      page
        .getByRole("navigation", { name: HEADER_LOCALE.languageNavAria })
        .getByRole("button"),
    ).toBeVisible();

    await expect(
      page
        .getByRole("navigation", { name: mainNavAriaLabel(to) })
        .getByRole("link", {
          name: navProductsLabelForLocale(to),
          exact: true,
        }),
    ).toBeVisible();
  });
});
