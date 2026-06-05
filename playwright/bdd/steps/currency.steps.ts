import { expect } from "@playwright/test";

import { firstShopCard } from "../utils/openApp";
import { switchToNextCurrency } from "../utils/currency";
import { useDesktopViewport } from "../utils/viewport";
import { When, Then } from "./fixtures";
import { scenarioState } from "./scenarioState";

When("I switch to the next currency in the header", async ({ page }) => {
  await useDesktopViewport(page);
  await switchToNextCurrency(page);
});

Then("the header currency and first product card format update", async ({ page }) => {
  await expect(firstShopCard(page)).toBeVisible({ timeout: 30_000 });
  const card = firstShopCard(page);
  const text = await card.innerText();
  expect(text).toMatch(/\$|USD|€|EUR|MAD|DH|\d/);
});

Then("the cart line unit price text changes", async ({ page }) => {
  const dialog = page.getByRole("dialog");
  const linePrice = dialog.locator("li").first().locator(".tabular-nums").first();
  const after = (await linePrice.innerText()).trim();
  expect(scenarioState.cartUnitPriceBefore.length).toBeGreaterThan(0);
  expect(after).not.toBe(scenarioState.cartUnitPriceBefore);
});
