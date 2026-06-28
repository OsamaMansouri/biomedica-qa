import { expect, type Page } from "@playwright/test";

import { waitForStorefrontNotLoading } from "./openApp";

export const CURRENCY_CODES = ["MAD", "EUR", "USD"] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export function nextCurrency(current: CurrencyCode): CurrencyCode {
  const i = CURRENCY_CODES.indexOf(current);
  return CURRENCY_CODES[(i + 1) % CURRENCY_CODES.length]!;
}

function readHeaderCurrency(page: Page) {
  const box = page.locator("header").getByTestId("qa-header-currency");
  return { box, trigger: box.getByRole("button") };
}

/** Cycle header currency to the next code (MAD → EUR → USD → …). */
export async function switchToNextCurrency(page: Page): Promise<CurrencyCode> {
  const { box, trigger } = readHeaderCurrency(page);
  const current = (await trigger.innerText()).replace(/\s*▾\s*/g, "").trim() as CurrencyCode;
  const next = nextCurrency(current);

  await trigger.click();
  await box.getByRole("menuitem", { name: next, exact: true }).click();
  await waitForStorefrontNotLoading(page);
  await expect(trigger).toContainText(next);
  return next;
}
