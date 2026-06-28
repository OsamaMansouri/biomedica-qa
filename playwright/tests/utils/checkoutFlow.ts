import { expect, type Page } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { checkoutGuest } from "../data/checkoutGuest";
import { checkoutStrings, type CheckoutStrings } from "../i18n/strings";
import { localeFromProject } from "../i18n/locale";
import type { TestInfo } from "@playwright/test";

export function testPromoCode(): string {
  return process.env.PLAYWRIGHT_TEST_PROMO_CODE?.trim() ?? "";
}

export function requireTestPromoCode(): string {
  const code = testPromoCode();
  if (!code) {
    throw new Error(
      "Set PLAYWRIGHT_TEST_PROMO_CODE in QA/playwright/.env (code must exist in admin promo_codes).",
    );
  }
  return code;
}

export function checkoutCopy(testInfo: TestInfo): CheckoutStrings {
  return checkoutStrings(localeFromProject(testInfo));
}

/** Parse displayed checkout total (fr/en Intl currency). */
export function parseCheckoutTotal(raw: string): number {
  const text = raw.trim();
  if (!text || text === "-" || /chargement|loading/i.test(text)) {
    return Number.NaN;
  }
  let n = text.replace(/[^\d,.]/g, "");
  if (n.includes(",") && !n.includes(".")) {
    n = n.replace(",", ".");
  } else if (n.includes(",") && n.includes(".")) {
    const lastComma = n.lastIndexOf(",");
    const lastDot = n.lastIndexOf(".");
    if (lastComma > lastDot) {
      n = n.replace(/\./g, "").replace(",", ".");
    } else {
      n = n.replace(/,/g, "");
    }
  }
  return Number.parseFloat(n);
}

export async function waitForCheckoutTotalReady(page: Page): Promise<number> {
  const totalEl = page.getByTestId("qa-checkout-total");
  await expect(totalEl).toBeVisible({ timeout: SLOW_UI_TIMEOUT_MS });
  let amount = Number.NaN;
  await expect
    .poll(
      async () => {
        amount = parseCheckoutTotal((await totalEl.textContent()) ?? "");
        return Number.isFinite(amount) && amount > 0;
      },
      { timeout: SLOW_UI_TIMEOUT_MS },
    )
    .toBe(true);
  return amount;
}

export async function fillCheckoutGuestAddress(
  page: Page,
  copy: CheckoutStrings,
): Promise<void> {
  const p = copy.placeholders;
  await page.getByPlaceholder(p.firstName, { exact: true }).fill(checkoutGuest.firstName);
  await page.getByPlaceholder(p.lastName, { exact: true }).fill(checkoutGuest.lastName);
  await page.getByTestId("qa-checkout-email").fill(checkoutGuest.email);
  await page.getByTestId("qa-checkout-phone").fill(checkoutGuest.phone);
  await page.getByPlaceholder(p.address, { exact: true }).fill(checkoutGuest.address);
  await page.getByPlaceholder(p.country, { exact: true }).fill(checkoutGuest.country);
  await page.getByPlaceholder(p.city, { exact: true }).fill(checkoutGuest.city);
  await page.getByPlaceholder(p.postalCode, { exact: true }).fill(checkoutGuest.postalCode);
}

export async function selectFirstShippingMethod(page: Page): Promise<void> {
  const firstShipping = page.locator('input[name="shipping-method"]').first();
  await expect(firstShipping).toBeVisible({ timeout: SLOW_UI_TIMEOUT_MS });
  await expect(firstShipping).toBeEnabled();
  await firstShipping.click();
}

export async function applyPromoAtCheckout(page: Page, code: string): Promise<void> {
  const input = page.getByTestId("qa-checkout-promo-input");
  await expect(input).toBeVisible();
  await input.fill(code);
  await page.getByTestId("qa-checkout-promo-apply").click();
  await expect(page.getByTestId("qa-checkout-promo-applied")).toBeVisible({
    timeout: SLOW_UI_TIMEOUT_MS,
  });
  await expect(page.getByTestId("qa-checkout-promo-discount")).toBeVisible();
}

export async function removePromoAtCheckout(page: Page): Promise<void> {
  await page.getByTestId("qa-checkout-promo-remove").click();
  await expect(page.getByTestId("qa-checkout-promo-input")).toBeVisible();
  await expect(page.getByTestId("qa-checkout-promo-applied")).toHaveCount(0);
}
