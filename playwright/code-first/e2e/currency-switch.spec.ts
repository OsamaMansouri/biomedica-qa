import { test, expect } from "@playwright/test";

import { smoke } from "../i18n/strings";
import {
  closeCartDrawer,
  firstShopCard,
  headerCartButton,
  waitForStorefrontNotLoading,
} from "../utils/openApp";
import { addDefaultProductFromPdp } from "../utils/cartFlow";
import { switchToNextCurrency } from "../utils/currency";

test.describe("E2E: header currency switch", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Guest: switch currency updates header and first product card @shop @e2e", async ({
    page,
  }) => {
    await page.goto("shop", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);
    await expect(firstShopCard(page)).toBeVisible({ timeout: 30_000 });

    const next = await switchToNextCurrency(page);
    const card = firstShopCard(page);
    if (next === "USD") {
      await expect(card).toContainText(/\$|USD|\d/);
    } else if (next === "EUR") {
      await expect(card).toContainText(/€|EUR|\d/);
    } else {
      await expect(card).toContainText(/MAD|DH|\d/);
    }
  });

  test("Guest: cart line unit price updates when currency changes @cart @shop @e2e", async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);
    await addDefaultProductFromPdp(page);

    const dialog = page.getByRole("dialog");
    const linePrice = dialog.locator("li").first().locator(".tabular-nums").first();
    const before = (await linePrice.innerText()).trim();

    await closeCartDrawer(page);
    await switchToNextCurrency(page);

    await headerCartButton(page, ui.navCart).click();
    const after = (await linePrice.innerText()).trim();
    expect(after).not.toBe(before);
  });
});
