import { test, expect } from "@playwright/test";

import { localeFromProject, otherLocale } from "../i18n/locale";
import {
  languageNavAriaForLocale,
  mainNavAriaLabel,
  navProductsLabelForLocale,
  smokeForLocale,
} from "../i18n/strings";
import {
  headerCartButton,
  closeCartDrawer,
  openStorefrontHome,
  switchHeaderLocale,
  waitForStorefrontNotLoading,
} from "../utils/openApp";
import {
  addDefaultProductFromPdp,
  cartLineQty,
  defaultProductSlug,
} from "../utils/cartFlow";

test.describe("E2E: header language switch", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Guest: switch locale updates URL and navigation @i18n @e2e", async ({
    page,
  }, testInfo) => {
    const to = otherLocale(localeFromProject(testInfo));

    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);
    await switchHeaderLocale(page, to);

    await expect(
      page
        .getByRole("navigation", { name: languageNavAriaForLocale(to) })
        .getByRole("button"),
    ).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: mainNavAriaLabel(to) })
        .getByRole("link", { name: navProductsLabelForLocale(to), exact: true }),
    ).toBeVisible();
  });

  test("Guest: locale switch on PDP keeps product slug @pdp @i18n @e2e", async ({
    page,
  }, testInfo) => {
    const to = otherLocale(localeFromProject(testInfo));
    const slug = defaultProductSlug();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);
    await switchHeaderLocale(page, to);

    await expect(page).toHaveURL(new RegExp(`\\/${to}\\/product\\/${slug}`));
    await expect(page.getByTestId("qa-pdp-atc-primary")).toBeVisible();
  });

  test("Guest: cart line survives header locale switch @cart @i18n @e2e", async ({
    page,
  }, testInfo) => {
    const to = otherLocale(localeFromProject(testInfo));
    const slug = await addDefaultProductFromPdp(page);
    await expect(cartLineQty(page, slug)).toHaveText("1");
    await closeCartDrawer(page);

    await switchHeaderLocale(page, to);
    await headerCartButton(page, smokeForLocale(to).navCart).click();
    await expect(cartLineQty(page, slug)).toHaveText("1");
  });
});
