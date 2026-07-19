import { test, expect } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { contactGuest } from "../data/contactGuest";
import { localeFromProject } from "../i18n/locale";
import { contactFormStrings } from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: contact form", () => {
  test("Guest: submit form and see success @contact @e2e @skip", async ({
    page,
  }, testInfo) => {
    const copy = contactFormStrings(localeFromProject(testInfo));

    await page.goto("contact", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    await page.locator('form input[name="name"]').fill(contactGuest.name);
    await page.locator('form input[name="email"]').fill(contactGuest.email);
    await page.locator("form textarea").fill(contactGuest.body);

    await page.getByRole("button", { name: copy.submit }).click();

    await expect(page.getByRole("status")).toContainText(copy.successTitle, {
      timeout: SLOW_UI_TIMEOUT_MS,
    });
  });

  test("Guest: invalid email shows inline error on blur @contact @validation @e2e", async ({
    page,
  }, testInfo) => {
    const copy = contactFormStrings(localeFromProject(testInfo));

    await page.goto("contact", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    await page.getByTestId("qa-contact-email").fill("not-an-email");
    await page.getByTestId("qa-contact-name").click();

    const emailError = page.getByTestId("qa-field-error-contact-email");
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText(copy.validationEmailInvalid);

    await page.getByRole("button", { name: copy.submit }).click();
    await expect(page.getByRole("status")).not.toBeVisible();
  });
});
