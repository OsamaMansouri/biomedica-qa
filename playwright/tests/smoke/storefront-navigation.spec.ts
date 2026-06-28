import { test, expect } from "@playwright/test";

import { headerCartButton, openStorefrontHome } from "../utils/openApp";
import { smoke } from "../i18n/strings";

/** Primary nav is `lg:flex`; widen viewport so one suite works on CI and locally. */
test.describe("smoke: header navigation (desktop)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Primary nav shows home, products, cart @header @smoke", async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);

    const nav = page.getByRole("navigation", { name: ui.mainNav });
    await expect(nav.getByRole("link", { name: ui.navHome })).toBeVisible();
    await expect(nav.getByRole("link", { name: ui.navProducts })).toBeVisible();
    await expect(headerCartButton(page, ui.navCart)).toBeVisible();
  });
});
