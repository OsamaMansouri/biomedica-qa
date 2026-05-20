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
