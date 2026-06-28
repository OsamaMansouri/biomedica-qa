import { expect, type Page } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG } from "../i18n/strings";
import { waitForStorefrontNotLoading } from "./openApp";

export function defaultProductSlug(): string {
  return (
    process.env.PLAYWRIGHT_TEST_PRODUCT_SLUG?.trim() ||
    STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG
  );
}

export async function addDefaultProductFromPdp(page: Page): Promise<string> {
  const slug = defaultProductSlug();
  await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);
  await page.getByTestId("qa-pdp-atc-primary").click();
  return slug;
}

export function cartLineQty(page: Page, slug: string) {
  return page.getByTestId(`qa-cart-line-qty-${slug}`);
}

export async function openCheckoutFromCart(page: Page): Promise<void> {
  const checkout = page.getByTestId("qa-cart-checkout");
  await expect(checkout).toBeVisible({ timeout: SLOW_UI_TIMEOUT_MS });
  await Promise.all([
    page.waitForURL(/\/checkout/, { waitUntil: "commit" }),
    checkout.click(),
  ]);
  await waitForStorefrontNotLoading(page);
}
