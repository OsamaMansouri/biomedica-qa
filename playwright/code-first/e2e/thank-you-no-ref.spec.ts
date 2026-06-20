import { test, expect } from "@playwright/test";

import { SLOW_UI_TIMEOUT_MS } from "../constants";
import { localeFromProject } from "../i18n/locale";
import { checkoutStrings } from "../i18n/strings";
import { waitForStorefrontNotLoading } from "../utils/openApp";

test.describe("E2E: thank-you without order", () => {
  test("Guest: thank-you without reference shows no-order state @checkout @e2e", async ({
    page,
  }, testInfo) => {
    const copy = checkoutStrings(localeFromProject(testInfo));

    await page.addInitScript(() => {
      sessionStorage.clear();
    });

    await page.goto("thank-you", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);

    await expect(page.getByTestId("qa-thank-you-no-order")).toBeVisible({
      timeout: SLOW_UI_TIMEOUT_MS,
    });
    await expect(page.getByTestId("qa-thank-you-no-order")).toContainText(
      copy.thankYouNoOrder,
    );
    await expect(page.getByTestId("qa-thank-you-title")).not.toBeVisible();
  });
});
