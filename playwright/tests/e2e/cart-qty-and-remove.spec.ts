import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import {
  cartDrawerStrings,
  STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG,
} from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test("Guest: PDP add to cart → change quantity → remove line → empty cart", async ({
  page,
}, testInfo) => {
  const locale = localeFromProject(testInfo);
  const cart = cartDrawerStrings(locale);
  const slug = (
    process.env.PLAYWRIGHT_TEST_PRODUCT_SLUG || STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG
  ).trim();

  await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);

  await page.getByTestId("qa-pdp-atc-primary").click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByTestId(`qa-cart-line-qty-${slug}`)).toHaveText("1");

  await dialog.getByRole("button", { name: cart.increase }).click();
  await expect(dialog.getByTestId(`qa-cart-line-qty-${slug}`)).toHaveText("2");

  await dialog.getByRole("button", { name: cart.decrease }).click();
  await expect(dialog.getByTestId(`qa-cart-line-qty-${slug}`)).toHaveText("1");

  await dialog.getByRole("button", { name: cart.remove }).click();
  await expect(dialog.getByText(cart.empty).first()).toBeVisible();
});
