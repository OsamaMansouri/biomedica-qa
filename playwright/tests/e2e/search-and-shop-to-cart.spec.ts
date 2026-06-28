import { test, expect } from "@playwright/test";

import { E2E_HEADER_SEARCH_QUERY, smoke } from "../i18n/strings";
import {
  headerSearchButton,
  openStorefrontHome,
  waitForStorefrontNotLoading,
} from "../utils/openApp";

test.describe("E2E: header search → PDP → cart", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Guest: search first result and add to cart @search @e2e", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    await headerSearchButton(page, ui.navSearch).click();
    const searchSheet = page.getByRole("dialog");
    await expect(searchSheet.getByPlaceholder(ui.searchPlaceholder)).toBeVisible();

    await searchSheet
      .getByPlaceholder(ui.searchPlaceholder)
      .fill(E2E_HEADER_SEARCH_QUERY);
    await expect(searchSheet.getByRole("listitem").first()).toBeVisible();
    const firstHit = searchSheet.getByRole("listitem").first().getByRole("link");
    await Promise.all([
      page.waitForURL(/\/product\//, { waitUntil: "commit" }),
      firstHit.click(),
    ]);
    await waitForStorefrontNotLoading(page);

    await page.getByTestId("qa-pdp-atc-primary").click();
    const cart = page.getByRole("dialog");
    await expect(cart.getByRole("heading", { name: ui.cartSheetTitle })).toBeVisible();
    await expect(cart.getByTestId("qa-cart-checkout")).toBeVisible();
  });
});
