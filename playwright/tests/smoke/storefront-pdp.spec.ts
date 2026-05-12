import { test, expect } from "@playwright/test";

import { STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG } from "../i18n/strings";

test.describe("smoke: PDP", () => {
  test("default product PDP shows add to cart", { tag: "@smoke" }, async ({
    page,
  }) => {
    const slug = (
      process.env.PLAYWRIGHT_TEST_PRODUCT_SLUG || STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG
    ).trim();

    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });
    const addToCart = page.getByTestId("qa-pdp-atc-primary");
    await expect(addToCart).toBeVisible();
    await expect(addToCart).toBeEnabled();
  });
});
