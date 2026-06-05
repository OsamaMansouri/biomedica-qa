import { expect, type Page } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { checkoutGuest } from "../data/checkoutGuest";
import type { Locale } from "../i18n/locale";
import { checkoutStrings } from "../i18n/strings";
import { waitForStorefrontNotLoading } from "./openApp";
import {
  addDefaultProductFromPdp,
  openCheckoutFromCart,
} from "./cartFlow";

export async function goToCheckoutWithDefaultProduct(page: Page): Promise<void> {
  await addDefaultProductFromPdp(page);
  await openCheckoutFromCart(page);
}

export async function completeGuestCodOrder(page: Page, locale: Locale): Promise<void> {
  const copy = checkoutStrings(locale);

  await addDefaultProductFromPdp(page);
  const cartCheckout = page.getByTestId("qa-cart-checkout");
  await expect(cartCheckout).toBeVisible({ timeout: SLOW_UI_TIMEOUT_MS });
  await Promise.all([
    page.waitForURL(/\/checkout/, { waitUntil: "commit" }),
    cartCheckout.click(),
  ]);
  await waitForStorefrontNotLoading(page);

  const p = copy.placeholders;
  await page.getByPlaceholder(p.firstName, { exact: true }).fill(checkoutGuest.firstName);
  await page.getByPlaceholder(p.lastName, { exact: true }).fill(checkoutGuest.lastName);
  await page.getByPlaceholder(p.email, { exact: true }).fill(checkoutGuest.email);
  await page.getByPlaceholder(p.phone, { exact: true }).fill(checkoutGuest.phone);
  await page.getByPlaceholder(p.address, { exact: true }).fill(checkoutGuest.address);
  await page.getByPlaceholder(p.country, { exact: true }).fill(checkoutGuest.country);
  await page.getByPlaceholder(p.city, { exact: true }).fill(checkoutGuest.city);
  await page.getByPlaceholder(p.postalCode, { exact: true }).fill(checkoutGuest.postalCode);

  const firstShipping = page.locator('input[name="shipping-method"]').first();
  await expect(firstShipping).toBeVisible({ timeout: SLOW_UI_TIMEOUT_MS });
  await expect(firstShipping).toBeEnabled();
  await firstShipping.click();

  const placeOrder = page.getByTestId("qa-checkout-submit");
  await expect(placeOrder).toBeVisible();
  await expect(placeOrder).toBeEnabled({ timeout: SLOW_UI_TIMEOUT_MS });
  await placeOrder.click();

  await expect(page).toHaveURL(/thank-you/, { timeout: SLOW_UI_TIMEOUT_MS });
  await expect(page.getByTestId("qa-thank-you-title")).toHaveText(copy.thankYouTitle);
  await expect(page.getByTestId("qa-thank-you-lead")).toHaveText(copy.thankYouLead);
  await expect(page).toHaveURL(/[?&]ref=/);
  const refParam = new URL(page.url()).searchParams.get("ref")?.trim() ?? "";
  expect(refParam.length).toBeGreaterThan(0);
  await expect(page.getByTestId("qa-thank-you-reference")).toContainText(refParam);
}
