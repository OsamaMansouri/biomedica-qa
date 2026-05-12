import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { openStorefrontHome } from "../utils/openApp";

test.describe("smoke: home", () => {
  test("locale in URL and main landmark", { tag: "@smoke" }, async ({
    page,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    await openStorefrontHome(page);
    await expect(page).toHaveURL(new RegExp(`\\/${locale}(\\/|$)`));
    await expect(page.getByRole("main")).toBeVisible();
  });
});
