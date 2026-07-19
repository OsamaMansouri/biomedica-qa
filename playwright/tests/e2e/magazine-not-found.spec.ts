import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { extendedUiStrings } from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: magazine not found", () => {
  test("Guest: unknown magazine article slug shows not-found page @magazine @e2e", async ({
    page,
  }, testInfo) => {
    const copy = extendedUiStrings(localeFromProject(testInfo));

    await page.goto("articles/this-slug-does-not-exist-qa-e2e", {
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
