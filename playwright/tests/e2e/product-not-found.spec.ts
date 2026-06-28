import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { extendedUiStrings } from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: product not found", () => {
  test("Guest: unknown product slug shows not-found page @pdp @e2e", async ({ page }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const copy = extendedUiStrings(locale);

    await page.goto("product/this-slug-does-not-exist-qa-e2e", {
      waitUntil: "domcontentloaded",
    });
    await waitForStorefrontNotLoading(page);

    await expect(
      page.getByRole("heading", { name: copy.notFoundTitle, level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: copy.notFoundShopCta }),
    ).toBeVisible();
  });
});
