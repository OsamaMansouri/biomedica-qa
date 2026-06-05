import { expect, type Page } from "@playwright/test";

export async function expectCanonical(page: Page, pattern: RegExp): Promise<void> {
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveCount(1);
  const href = await canonical.getAttribute("href");
  expect(href, "canonical href").toMatch(pattern);
}

export async function expectHreflangAlternates(
  page: Page,
  frPattern: RegExp,
  enPattern: RegExp,
): Promise<void> {
  const fr = page.locator('link[rel="alternate"][hreflang="fr"]');
  const en = page.locator('link[rel="alternate"][hreflang="en"]');
  await expect(fr).toHaveCount(1);
  await expect(en).toHaveCount(1);
  const frHref = await fr.getAttribute("href");
  const enHref = await en.getAttribute("href");
  expect(frHref, "hreflang fr").toMatch(frPattern);
  expect(enHref, "hreflang en").toMatch(enPattern);
}
