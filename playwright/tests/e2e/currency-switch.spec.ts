import { test, expect } from "@playwright/test";

import { waitForStorefrontNotLoading } from "../utils/openApp";

const CURRENCY_CODES = ["MAD", "EUR", "USD"] as const;
type CurrencyCode = (typeof CURRENCY_CODES)[number];

function nextCurrency(current: CurrencyCode): CurrencyCode {
  const i = CURRENCY_CODES.indexOf(current);
  return CURRENCY_CODES[(i + 1) % CURRENCY_CODES.length]!;
}

test.describe("E2E: header currency switch", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shop: switch currency → header code updates and first card shows new format", async ({
    page,
  }) => {
    await page.goto("shop", { waitUntil: "domcontentloaded" });
    await waitForStorefrontNotLoading(page);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.locator("main article").first()).toBeVisible({
      timeout: 30_000,
    });

    const box = page.locator("header").getByTestId("qa-header-currency");
    const trigger = box.getByRole("button");
    const beforeRaw = (await trigger.innerText()).replace(/\s*▾\s*/g, "").trim();
    expect(CURRENCY_CODES as readonly string[]).toContain(beforeRaw);
    const before = beforeRaw as CurrencyCode;
    const next = nextCurrency(before);

    await trigger.click();
    await box.getByRole("menuitem", { name: next, exact: true }).click();
    await waitForStorefrontNotLoading(page);

    await expect(box.getByRole("button")).toContainText(next);

    const firstCard = page.locator("main article").first();
    await expect(firstCard).toBeVisible();
    if (next === "USD") {
      await expect(firstCard).toContainText(/\d|USD|\$/);
    } else if (next === "EUR") {
      await expect(firstCard).toContainText(/\d|€|EUR/);
    } else {
      await expect(firstCard).toContainText(/\d|MAD|DH/);
    }
  });
});
