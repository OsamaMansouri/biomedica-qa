import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { cartDrawerStrings, STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG } from "../i18n/strings";
import { headerCartBadge, waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("smoke: cart with line item", () => {
  test("Header cart badge shows count after add to cart @cart @header @smoke", async ({
    page,
  }) => {
    const slug = (
      process.env.PLAYWRIGHT_TEST_PRODUCT_SLUG || STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG
    ).trim();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);
    await page.getByTestId("qa-pdp-atc-primary").click();

    await expect(page.getByTestId(`qa-cart-line-qty-${slug}`)).toHaveText("1");
    await expect(headerCartBadge(page)).toHaveText("1");
  });

  test("Cart drawer shows line qty controls and checkout @cart @smoke", async ({
    page,
  }, testInfo) => {
    const cart = cartDrawerStrings(localeFromProject(testInfo));
    const slug = (
      process.env.PLAYWRIGHT_TEST_PRODUCT_SLUG || STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG
    ).trim();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await page.getByTestId("qa-pdp-atc-primary").click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByTestId(`qa-cart-line-qty-${slug}`)).toHaveText("1");
    await expect(dialog.getByRole("button", { name: cart.increase })).toBeVisible();
    await expect(dialog.getByTestId("qa-cart-checkout")).toBeVisible();
  });

  test("Header cart badge clears after removing line @cart @header @smoke", async ({
    page,
  }, testInfo) => {
    const cart = cartDrawerStrings(localeFromProject(testInfo));
    const slug = (
      process.env.PLAYWRIGHT_TEST_PRODUCT_SLUG || STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG
    ).trim();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await page.getByTestId("qa-pdp-atc-primary").click();

    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: cart.remove }).click();
    await expect(headerCartBadge(page)).not.toBeVisible();
  });
});
