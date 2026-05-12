import { test, expect } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { localeFromProject } from "../i18n/locale";
import { contactFormStrings } from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test("Guest: contact page - submit form and see success", async ({
  page,
}, testInfo) => {
  const copy = contactFormStrings(localeFromProject(testInfo));

  await page.goto("contact", { waitUntil: "domcontentloaded" });
  await waitForStorefrontNotLoading(page);

  await page.locator('form input[name="name"]').fill("Playwright E2E");
  await page.locator('form input[name="email"]').fill("playwright-e2e@example.test");
  await page.locator("form textarea").fill(
    "Automated storefront E2E - safe to ignore or delete.",
  );

  await page.getByRole("button", { name: copy.submit }).click();

  await expect(page.getByRole("status")).toContainText(copy.successTitle, {
    timeout: SLOW_UI_TIMEOUT_MS,
  });
});
