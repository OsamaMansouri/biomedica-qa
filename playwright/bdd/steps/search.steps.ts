import { expect } from "@playwright/test";

import { E2E_HEADER_SEARCH_QUERY, extendedUiStrings } from "../i18n/strings";
import {
  headerSearchButton,
  openStorefrontHome,
  waitForStorefrontNotLoading,
} from "../utils/openApp";
import { useDesktopViewport } from "../utils/viewport";
import { Given, When, Then } from "./fixtures";
import { bddLocale, bddSmoke } from "./helpers";

Given("I open search from the header on desktop", async ({ page, $testInfo }) => {
  await useDesktopViewport(page);
  const ui = bddSmoke($testInfo);
  await openStorefrontHome(page);
  await waitForStorefrontNotLoading(page);
  await headerSearchButton(page, ui.navSearch).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

When("I open search from the header", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  await headerSearchButton(page, ui.navSearch).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

When("I close the search sheet with the close button", async ({ page }) => {
  await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
});

When("I search for a nonsense query with no matches", async ({ page, $testInfo }) => {
  await useDesktopViewport(page);
  const ui = bddSmoke($testInfo);
  await openStorefrontHome(page);
  await waitForStorefrontNotLoading(page);
  await headerSearchButton(page, ui.navSearch).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByPlaceholder(ui.searchPlaceholder).fill("zzzznomatchqa999");
});

When("I search open first result and add to cart", async ({ page, $testInfo }) => {
  await useDesktopViewport(page);
  const ui = bddSmoke($testInfo);
  await openStorefrontHome(page);
  await waitForStorefrontNotLoading(page);
  await headerSearchButton(page, ui.navSearch).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByPlaceholder(ui.searchPlaceholder).fill(E2E_HEADER_SEARCH_QUERY);
  const firstResult = dialog.getByRole("listitem").first();
  await expect(firstResult).toBeVisible({ timeout: 15_000 });
  await firstResult.getByRole("link").first().click();
  await page.waitForURL(/\/product\//, { waitUntil: "commit" });
  await page.getByTestId("qa-pdp-atc-primary").click();
});

Then("the search sheet shows the search input", async ({ page, $testInfo }) => {
  const ui = bddSmoke($testInfo);
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: ui.searchSheetTitle })).toBeVisible();
  await expect(dialog.getByPlaceholder(ui.searchPlaceholder)).toBeVisible();
});

Then("the search sheet is closed", async ({ page }) => {
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

Then("the search sheet shows no results message", async ({ page, $testInfo }) => {
  const copy = extendedUiStrings(bddLocale($testInfo));
  await expect(page.getByRole("dialog").getByText(copy.searchNoResults)).toBeVisible({
    timeout: 15_000,
  });
});
