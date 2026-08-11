import { test, expect } from "@playwright/test";

import { localeFromProject } from "../i18n/locale";
import { newsletterFormStrings } from "../i18n/strings";
import { openStorefrontHome, waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("smoke: homepage newsletter", () => {
  test("Newsletter block visible on home @newsletter @smoke", async ({
    page,
  }, testInfo) => {
    const copy = newsletterFormStrings(localeFromProject(testInfo));

    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    const form = page.getByTestId("qa-home-newsletter-form");
    await form.scrollIntoViewIfNeeded();

    await expect(
      page.getByRole("heading", { name: copy.title, level: 2 }),
    ).toBeVisible();
    await expect(form).toBeVisible();
    await expect(page.getByTestId("qa-newsletter-email")).toBeVisible();
    await expect(page.getByTestId("qa-newsletter-email")).toHaveAttribute(
      "placeholder",
      copy.placeholder,
    );
    await expect(
      page.getByTestId("qa-newsletter-submit"),
    ).toHaveText(copy.cta);
  });

  test("Invalid email shows inline error on blur @newsletter @validation @smoke", async ({
    page,
  }, testInfo) => {
    const copy = newsletterFormStrings(localeFromProject(testInfo));

    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    const form = page.getByTestId("qa-home-newsletter-form");
    await form.scrollIntoViewIfNeeded();

    await page.getByTestId("qa-newsletter-email").fill("not-an-email");
    await page.getByRole("heading", { name: copy.title, level: 2 }).click();

    const emailError = page.getByTestId("qa-field-error-newsletter-email");
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText(copy.validationEmailInvalid);
    await expect(page.getByRole("status")).not.toBeVisible();
  });
});
