import { test, expect } from "@playwright/test";

import { smoke } from "../i18n/strings";
import {
  addDefaultProductFromPdp,
  cartLineQty,
} from "../utils/cartFlow";
import { headerCartButton } from "../utils/openApp";

test.describe("E2E: cart persist on refresh", () => {
  test("Guest: cart lines survive a full page reload @cart @e2e", async ({
    page,
  }, testInfo) => {
    const ui = smoke(testInfo);
    const slug = await addDefaultProductFromPdp(page);
    await expect(cartLineQty(page, slug)).toHaveText("1");

    await page.reload({ waitUntil: "domcontentloaded" });
    await headerCartButton(page, ui.navCart).click();
    await expect(cartLineQty(page, slug)).toHaveText("1");
  });
});
