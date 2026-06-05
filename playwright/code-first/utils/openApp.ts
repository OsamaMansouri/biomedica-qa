import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import type { Locale } from "../i18n/locale";
import { HEADER_LOCALE } from "../i18n/strings";

/**
 * Ouvre l’accueil boutique (locale FR), comme sfcc `openApp`.
 * Fonctionne avec `baseURL` terminé par `/fr/` dans `playwright.config.ts`.
 */
export async function openStorefrontHome(page: Page): Promise<void> {
  await page.goto(".", { waitUntil: "domcontentloaded" });
}

/**
 * Header shopping-bag control. Use `exact: true` so e.g. "Panier" does not match
 * product-card buttons with `aria-label` "Ajouter au panier" (substring match).
 */
export function headerCartButton(page: Page, accessibleName: string) {
  return page
    .locator("header")
    .getByRole("button", { name: accessibleName, exact: true });
}

/** Desktop header search trigger (`Nav.search` aria-label). */
export function headerSearchButton(page: Page, accessibleName: string) {
  return page
    .locator("header")
    .getByRole("button", { name: accessibleName, exact: true });
}

/** Open cart sheet from header. */
export async function openCartDrawerFromHeader(
  page: Page,
  cartAriaLabel: string,
): Promise<void> {
  await headerCartButton(page, cartAriaLabel).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

/** Sheet close control (sr-only label "Close"). */
export function sheetCloseButton(page: Page) {
  return page.getByRole("dialog").getByRole("button", { name: "Close" });
}

/** Badge count on header cart icon when cart is non-empty. */
export function headerCartBadge(page: Page) {
  return page.getByTestId("qa-header-cart-count");
}

/** Close cart sheet when open (Escape). No-op if already closed. */
export async function closeCartDrawer(page: Page): Promise<void> {
  const dialog = page.getByRole("dialog");
  if (!(await dialog.isVisible())) return;
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
}

/** Header locale menu → target locale; waits for URL segment. */
export async function switchHeaderLocale(page: Page, to: Locale): Promise<void> {
  const lang = page.locator("header").getByTestId("qa-locale-switcher");
  await lang.getByRole("button").click();
  const menuLabel =
    to === "en" ? HEADER_LOCALE.menuEnglish : HEADER_LOCALE.menuFrench;
  await lang.getByRole("menuitem", { name: menuLabel }).click();
  await waitForStorefrontNotLoading(page);
  await expect(page).toHaveURL(to === "en" ? /\/en(?:\/|$)/ : /\/fr(?:\/|$)/);
}

export function firstShopCard(page: Page) {
  return page.locator("main article").first();
}

/**
 * `StorefrontGlobalLoader` — auto-dismisses after 12s max; do not block tests for 60s.
 * If overlay lingers under load but `main` is visible, continue (avoids teardown timeouts).
 */
export async function waitForStorefrontNotLoading(page: Page): Promise<void> {
  const loader = page.getByRole("status", { name: "Loading" });
  const main = page.getByRole("main");
  try {
    await expect(loader).not.toBeVisible({ timeout: 15_000 });
  } catch {
    await expect(main).toBeVisible({ timeout: 5_000 });
  }
}
