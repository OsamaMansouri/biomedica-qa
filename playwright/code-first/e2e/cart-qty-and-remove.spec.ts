import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { cartDrawerStrings } from "../i18n/strings";
import { addDefaultProductFromPdp, cartLineQty } from "../utils/cartFlow";

test.describe("E2E: cart quantity and remove", () => {
  test("Guest: change quantity and remove line leaves empty cart @cart @e2e", async ({
    page,
  }, testInfo) => {
    const cart = cartDrawerStrings(localeFromProject(testInfo));
    const slug = await addDefaultProductFromPdp(page);
    const dialog = page.getByRole("dialog");

    await expect(cartLineQty(page, slug)).toHaveText("1");
    await dialog.getByRole("button", { name: cart.increase }).click();
    await expect(cartLineQty(page, slug)).toHaveText("2");
    await dialog.getByRole("button", { name: cart.decrease }).click();
    await expect(cartLineQty(page, slug)).toHaveText("1");
    await dialog.getByRole("button", { name: cart.remove }).click();
    await expect(dialog.getByText(cart.empty).first()).toBeVisible();
  });
});
