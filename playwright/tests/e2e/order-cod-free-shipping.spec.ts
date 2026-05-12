import { test, expect } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { checkoutGuest } from "../data/checkoutGuest";
import { localeFromProject } from "../i18n/locale";
import {
  checkoutStrings,
  STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG,
} from "../i18n/strings";
import { openStorefrontHome, waitForStorefrontNotLoading } from "../utils/openApp";

test.setTimeout(180_000);

test("As a Guest: Home → PDP → cart → ship → pay on delivery → order confirmation", async ({
  page,
}, testInfo) => {
  const locale = localeFromProject(testInfo);
  const copy = checkoutStrings(locale);

  await openStorefrontHome(page);
  await waitForStorefrontNotLoading(page);
  await expect(page).toHaveURL(new RegExp(`\\/${locale}(\\/|$)`));
  await expect(page.getByRole("main")).toBeVisible();

  const productSlug = (
    process.env.PLAYWRIGHT_TEST_PRODUCT_SLUG ||
    STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG
  ).trim();
  await page.goto(`product/${productSlug}`, { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);

  const addToCart = page.getByTestId("qa-pdp-atc-primary");
  await expect(addToCart).toBeVisible();
  await expect(addToCart).toBeEnabled();
  await addToCart.click();

  const cartCheckout = page.getByTestId("qa-cart-checkout");
  await expect(cartCheckout).toBeVisible({ timeout: SLOW_UI_TIMEOUT_MS });
  await cartCheckout.click();

  await expect(page).toHaveURL(/\/checkout/);
  const p = copy.placeholders;
  const firstName = page.getByPlaceholder(p.firstName, { exact: true });
  await expect(firstName).toBeVisible();
  await firstName.fill(checkoutGuest.firstName);
  await page
    .getByPlaceholder(p.lastName, { exact: true })
    .fill(checkoutGuest.lastName);
  await page
    .getByPlaceholder(p.email, { exact: true })
    .fill(checkoutGuest.email);
  await page
    .getByPlaceholder(p.phone, { exact: true })
    .fill(checkoutGuest.phone);
  await page
    .getByPlaceholder(p.address, { exact: true })
    .fill(checkoutGuest.address);
  await page
    .getByPlaceholder(p.country, { exact: true })
    .fill(checkoutGuest.country);
  await page.getByPlaceholder(p.city, { exact: true }).fill(checkoutGuest.city);
  await page
    .getByPlaceholder(p.postalCode, { exact: true })
    .fill(checkoutGuest.postalCode);

  const firstShipping = page.locator('input[name="shipping-method"]').first();
  await expect(firstShipping).toBeVisible({ timeout: SLOW_UI_TIMEOUT_MS });
  await expect(firstShipping).toBeEnabled();
  await firstShipping.click();

  const placeOrder = page.getByTestId("qa-checkout-submit");
  await expect(placeOrder).toBeVisible();
  await expect(placeOrder).toBeEnabled({ timeout: SLOW_UI_TIMEOUT_MS });
  await placeOrder.click();

  await expect(page).toHaveURL(/thank-you/, { timeout: SLOW_UI_TIMEOUT_MS });
  await expect(page.getByTestId("qa-thank-you-title")).toHaveText(
    copy.thankYouTitle,
  );
  await expect(page.getByTestId("qa-thank-you-lead")).toHaveText(
    copy.thankYouLead,
  );
});
