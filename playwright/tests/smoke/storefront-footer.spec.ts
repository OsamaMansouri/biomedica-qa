import { test, expect } from "@playwright/test";

import { smoke } from "../i18n/strings";
import { openStorefrontHome } from "../utils/openApp";

test.describe("smoke: footer", () => {
  test("Footer shows contact email and Instagram @smoke", async ({ page }, testInfo) => {
    const ui = smoke(testInfo);
    await openStorefrontHome(page);

    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    await expect(
      footer.getByRole("link", { name: ui.footerEmail }),
    ).toHaveAttribute("href", `mailto:${ui.footerEmail}`);
    await expect(
      footer.getByRole("link", { name: ui.socialInstagram }),
    ).toHaveAttribute("href", /instagram\.com/);
  });
});
