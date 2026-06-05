import { expect } from "@playwright/test";

import { cartDrawerStrings } from "../i18n/strings";
import {
  addDefaultProductFromPdp,
  cartLineQty,
  defaultProductSlug,
} from "../utils/cartFlow";
import {
  closeCartDrawer,
  headerCartBadge,
  headerCartButton,
  openCartDrawerFromHeader,
  openStorefrontHome,
  sheetCloseButton,
  waitForStorefrontNotLoading,
} from "../utils/openApp";
import { Given, When, Then, Step } from "./fixtures";
import { scenarioState } from "./scenarioState";
import { bddLocale, bddSmoke } from "./helpers";

async function closeCartDrawerRememberingLinePrice(page: import("@playwright/test").Page): Promise<void> {
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const linePrice = dialog.locator("li").first().locator(".tabular-nums").first();
  scenarioState.cartUnitPriceBefore = (await linePrice.innerText()).trim();
  await closeCartDrawer(page);
}

Given("I close the cart drawer", async ({ page }) => {
  await closeCartDrawerRememberingLinePrice(page);
});

When("I close the cart drawer with the close button", async ({ page }) => {
  await sheetCloseButton(page).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

When("I press Escape", async ({ page }) => {
  await page.keyboard.press("Escape");
});

When("I click the cart sheet overlay", async ({ page }) => {
  await page.locator('[data-slot="sheet-overlay"]').click({ position: { x: 8, y: 8 } });
});

When("I click continue shopping", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  const dialog = page.getByRole("dialog");
  await Promise.all([
    page.waitForURL(/\/shop(?:\?|$)/, { waitUntil: "commit" }),
    dialog.getByRole("link", { name: ui.continueShopping }).click(),
  ]);
});

Step("I open the cart from the header", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  const cartBtn = headerCartButton(page, ui.navCart);
  if (!(await cartBtn.isVisible())) {
    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);
  }
  await openCartDrawerFromHeader(page, ui.navCart);
});

When("I remove the line from the cart drawer", async ({ page, $testInfo }) => {
  const cart = cartDrawerStrings(bddLocale($testInfo));
  await page.getByRole("dialog").getByRole("button", { name: cart.remove }).click();
});

When("I reload the page and open the cart", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  await page.reload({ waitUntil: "domcontentloaded" });
  await headerCartButton(page, ui.navCart).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

When("I add to cart increase decrease and remove the line", async ({ page, $testInfo }) => {
  const slug = defaultProductSlug();
  const cart = cartDrawerStrings(bddLocale($testInfo));
  await page.getByTestId("qa-pdp-atc-primary").click();
  const dialog = page.getByRole("dialog");
  await expect(cartLineQty(page, slug)).toHaveText("1");
  await dialog.getByRole("button", { name: cart.increase }).click();
  await expect(cartLineQty(page, slug)).toHaveText("2");
  await dialog.getByRole("button", { name: cart.decrease }).click();
  await expect(cartLineQty(page, slug)).toHaveText("1");
  await dialog.getByRole("button", { name: cart.remove }).click();
});

Then("the cart drawer shows empty state", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: ui.cartSheetTitle })).toBeVisible();
  await expect(dialog.getByText(ui.cartEmpty).first()).toBeVisible();
});

Then("continue shopping is visible", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  await expect(
    page.getByRole("dialog").getByRole("link", { name: ui.continueShopping }),
  ).toBeVisible();
});

Then("checkout is not available in the cart drawer", async ({ page }) => {
  await expect(page.getByRole("dialog").getByTestId("qa-cart-checkout")).not.toBeVisible();
});

Then("the cart drawer is closed", async ({ page }) => {
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

Then("the shop page is displayed", async ({ page }) => {
  await expect(page).toHaveURL(/\/shop/);
  await expect(page.getByRole("main")).toBeVisible();
});

Then("the header cart badge shows count {int}", async ({ page }, count: number) => {
  await expect(headerCartBadge(page)).toHaveText(String(count));
});

Then("the header cart badge is hidden", async ({ page }) => {
  await expect(headerCartBadge(page)).not.toBeVisible();
});

Then("the cart drawer shows quantity controls and checkout", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  const cart = cartDrawerStrings(bddLocale($testInfo));
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: ui.cartSheetTitle })).toBeVisible();
  await expect(dialog.getByRole("button", { name: cart.increase })).toBeVisible();
  await expect(dialog.getByTestId("qa-cart-checkout")).toBeVisible();
});

Then("the cart drawer opens", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: ui.cartSheetTitle }),
  ).toBeVisible();
});

Then("the cart shows empty state", async ({ page, $testInfo }) => {
  const cart = cartDrawerStrings(bddLocale($testInfo));
  await expect(page.getByRole("dialog").getByText(cart.empty).first()).toBeVisible();
});

Then("the cart still shows one unit of the product", async ({ page }) => {
  const slug = defaultProductSlug();
  await expect(cartLineQty(page, slug)).toHaveText("1");
});

Then("the cart drawer opens with checkout available", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: ui.cartSheetTitle })).toBeVisible();
  await expect(dialog.getByTestId("qa-cart-checkout")).toBeVisible();
});
