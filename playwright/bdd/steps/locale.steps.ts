import { expect } from "@playwright/test";

import { otherLocale } from "../i18n/locale";
import {
  languageNavAriaForLocale,
  mainNavAriaLabel,
  navProductsLabelForLocale,
} from "../i18n/strings";
import { switchHeaderLocale } from "../utils/openApp";
import { defaultProductSlug } from "../utils/cartFlow";
import { When, Then } from "./fixtures";
import { bddLocale } from "./helpers";

When("I switch to the other storefront locale", async ({ page, $testInfo }) => {
  const to = otherLocale(bddLocale($testInfo));
  await switchHeaderLocale(page, to);
});

Then("the URL and navigation reflect the new locale", async ({ page, $testInfo }) => {
  const to = otherLocale(bddLocale($testInfo));
  await expect(
    page
      .getByRole("navigation", { name: languageNavAriaForLocale(to) })
      .getByRole("button"),
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: mainNavAriaLabel(to) })
      .getByRole("link", { name: navProductsLabelForLocale(to), exact: true }),
  ).toBeVisible();
});

Then("the URL still contains the same product slug", async ({ page, $testInfo }) => {
  const to = otherLocale(bddLocale($testInfo));
  const slug = defaultProductSlug();
  await expect(page).toHaveURL(new RegExp(`\\/${to}\\/product\\/${slug}`));
  await expect(page.getByTestId("qa-pdp-atc-primary")).toBeVisible();
});
