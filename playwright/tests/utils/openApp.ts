import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

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

/** `StorefrontGlobalLoader` full-screen portal — wait before header/PDP clicks that it covers. */
export async function waitForStorefrontNotLoading(page: Page): Promise<void> {
  const loader = page.getByRole("status", { name: "Loading" });
  await expect(loader).not.toBeVisible({ timeout: 60_000 });
}
