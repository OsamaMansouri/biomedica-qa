import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { extendedUiStrings } from "../i18n/strings";
import { defaultProductSlug } from "../utils/cartFlow";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: mobile sticky add to cart", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("Guest: sticky bar adds product to cart on mobile @pdp @mobile @e2e", async ({
    page,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const copy = extendedUiStrings(locale);
    const slug = defaultProductSlug();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    const sticky = page.getByTestId("qa-pdp-atc-sticky");
    await expect(sticky).toBeVisible();
    await expect(sticky).toContainText(copy.stickyAtc);
    await sticky.click();

    const cart = page.getByRole("dialog");
    await expect(cart.getByTestId(`qa-cart-line-qty-${slug}`)).toHaveText("1");
  });
});
