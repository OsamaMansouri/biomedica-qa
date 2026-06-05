import { expect } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { contactFormStrings, smokeForLocale } from "../i18n/strings";
import { When, Then } from "./fixtures";
import { bddLocale } from "./helpers";

When("I submit the contact form with valid data", async ({ page, $testInfo }) => {
  const copy = contactFormStrings(bddLocale($testInfo));
  await page.locator('form input[name="name"]').fill("Playwright BDD");
  await page.locator('form input[name="email"]').fill("playwright-bdd@example.test");
  await page.locator("form textarea").fill("Automated BDD contact test — safe to ignore.");
  await page.getByRole("button", { name: copy.submit }).click();
});

When("I enter an invalid email and leave the field", async ({ page, $testInfo }) => {
  const copy = contactFormStrings(bddLocale($testInfo));
  await page.getByTestId("qa-contact-email").fill("not-an-email");
  await page.getByTestId("qa-contact-name").click();
  await expect(page.getByTestId("qa-field-error-contact-email")).toHaveText(
    copy.validationEmailInvalid,
  );
});

Then("I see the contact success message", async ({ page, $testInfo }) => {
  const copy = contactFormStrings(bddLocale($testInfo));
  await expect(page.getByRole("status")).toContainText(copy.successTitle, {
    timeout: SLOW_UI_TIMEOUT_MS,
  });
});

Then("I see the contact email validation error", async ({ page, $testInfo }) => {
  const copy = contactFormStrings(bddLocale($testInfo));
  const emailError = page.getByTestId("qa-field-error-contact-email");
  await expect(emailError).toBeVisible();
  await expect(emailError).toHaveText(copy.validationEmailInvalid);
});

Then("I do not see the contact success message", async ({ page }) => {
  await expect(page.getByRole("status")).not.toBeVisible();
});

Then("the contact form heading is visible", async ({ page, $testInfo }) => {
  const copy = smokeForLocale(bddLocale($testInfo));
  await expect(
    page.getByRole("heading", { name: copy.contactFormHeading }),
  ).toBeVisible();
});
