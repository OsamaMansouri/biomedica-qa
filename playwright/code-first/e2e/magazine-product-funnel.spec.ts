import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import {
  e2eMagazineProductArticleSlug,
  e2eMagazineProductLinkSlug,
  smoke,
} from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: magazine → PDP funnel", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Guest: article product CTA opens PDP and adds to cart @magazine @e2e", async ({
    page,
  }, testInfo) => {
    const locale = localeFromProject(testInfo);
    const ui = smoke(testInfo);
    const articleSlug = e2eMagazineProductArticleSlug(locale);
    const productSlug = e2eMagazineProductLinkSlug();

    await page.goto(`magazine/${articleSlug}`, {
      waitUntil: "domcontentloaded",
    });
    await waitForStorefrontNotLoading(page);

    const main = page.getByRole("main");
    const articleHeading = main.getByRole("heading", { level: 1 });
    if ((await articleHeading.count()) === 0) {
      test.skip(true, `magazine article not published: ${articleSlug}`);
    }

    let productLink = main.locator('a[href*="/product/"]').filter({
      hasText: /cristaux|eucalyptus|crystals/i,
    }).first();
    if ((await productLink.count()) === 0) {
      productLink = main.locator(`a[href*="/product/${productSlug}"]`).first();
    }
    await expect(productLink).toBeVisible({ timeout: 15_000 });

    const href = (await productLink.getAttribute("href")) ?? "";
    expect(href).toContain("/product/");

    await Promise.all([
      page.waitForURL(/\/product\//, { waitUntil: "commit" }),
      productLink.click(),
    ]);
    await waitForStorefrontNotLoading(page);

    await page.getByTestId("qa-pdp-atc-primary").click();
    const cart = page.getByRole("dialog");
    await expect(
      cart.getByRole("heading", { name: ui.cartSheetTitle }),
    ).toBeVisible();
    await expect(cart.getByTestId("qa-cart-checkout")).toBeVisible();
  });
});
