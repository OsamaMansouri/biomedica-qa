import { test, expect } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { localeFromProject } from "../i18n/locale";
import { newsletterFormStrings } from "../i18n/strings";
import { openStorefrontHome, waitForStorefrontNotLoading } from "../utils/openApp";
import { skipRealSideEffectsUnlessForced } from "../utils/skipRealSideEffects";

test.describe("E2E: homepage newsletter", () => {
  test("Guest: subscribe from home and see success @newsletter @e2e @skip", async ({
    page,
  }, testInfo) => {
    skipRealSideEffectsUnlessForced();
    const copy = newsletterFormStrings(localeFromProject(testInfo));
    const uniqueEmail = `qa-newsletter-${Date.now()}@example.test`;

    await openStorefrontHome(page);
    await waitForStorefrontNotLoading(page);

    const form = page.getByTestId("qa-home-newsletter-form");
    await form.scrollIntoViewIfNeeded();

    await page.getByTestId("qa-newsletter-email").fill(uniqueEmail);
    await page.getByTestId("qa-newsletter-submit").click();

    await expect(page.getByRole("status")).toContainText(copy.success, {
      timeout: SLOW_UI_TIMEOUT_MS,
    });
  });
});
