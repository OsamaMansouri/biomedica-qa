import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import {
  E2E_SHOP_AMBIANCE_CATEGORY_SLUG,
  E2E_SHOP_AMBIANCE_LABEL,
  shopUiStrings,
  smoke,
} from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: shop → Ambiance filter → PDP → cart", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Ambiance in filter sheet → shop URL → first product → Ambiance above title → add to cart", async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);
    const shop = shopUiStrings(localeFromProject(testInfo));

    await page.goto("shop", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);
    await expect(page.getByRole("main")).toBeVisible();

    await page.getByRole("button", { name: shop.showFilters }).click();
    const filterSheet = page.getByRole("dialog").filter({
      has: page.getByRole("heading", { name: shop.browseBy }),
    });
    await expect(
      filterSheet.getByRole("heading", { name: shop.browseBy }),
    ).toBeVisible();

    const browseNav = filterSheet.getByRole("navigation", {
      name: shop.browseBy,
    });

    const ambianceByHref = browseNav
      .locator(`a[href*="category=${E2E_SHOP_AMBIANCE_CATEGORY_SLUG}"]`)
      .first();
    const ambianceByLabel = browseNav.getByRole("link", {
      name: E2E_SHOP_AMBIANCE_LABEL,
      exact: true,
    });
    const ambianceLink =
      (await ambianceByHref.count()) > 0 ? ambianceByHref : ambianceByLabel;

    await expect(ambianceLink).toBeVisible({ timeout: 15_000 });
    await Promise.all([
      page.waitForURL(
        new RegExp(`[?&]category=${E2E_SHOP_AMBIANCE_CATEGORY_SLUG}(?:&|$)`),
        { waitUntil: "commit" },
      ),
      ambianceLink.click(),
    ]);
    await waitForStorefrontNotLoading(page);

    await expect(page.locator("main article").first()).toBeVisible({
      timeout: 30_000,
    });
    const firstProduct = page.locator("main article").first().getByRole("link").first();
    await Promise.all([
      page.waitForURL(/\/product\//, { waitUntil: "commit" }),
      firstProduct.click(),
    ]);
    await waitForStorefrontNotLoading(page);

    const main = page.getByRole("main");
    const categoryEyebrow = main
      .locator("p")
      .filter({ hasText: new RegExp(`^${E2E_SHOP_AMBIANCE_LABEL}$`) });
    await expect(categoryEyebrow).toBeVisible();
    await expect(
      categoryEyebrow.locator("xpath=following-sibling::h1[1]"),
    ).toBeVisible();

    await page.getByTestId("qa-pdp-atc-primary").click();
    const cartSheet = page.getByRole("dialog");
    await expect(
      cartSheet.getByRole("heading", { name: ui.cartSheetTitle }),
    ).toBeVisible();
    await expect(cartSheet.getByTestId("qa-cart-checkout")).toBeVisible();
  });
});
