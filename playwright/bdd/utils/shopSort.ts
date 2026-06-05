import { expect, type Page } from "@playwright/test";

export type ShopPriceSort = "price-asc" | "price-desc";

/** MAD base prices rendered on each shop grid card (`data-price-mad`). */
export async function readShopCardPricesMad(page: Page): Promise<number[]> {
  const cards = page.locator("main article[data-price-mad]");
  await expect(cards.first()).toBeVisible({ timeout: 30_000 });
  const count = await cards.count();
  expect(count).toBeGreaterThan(1);

  const prices: number[] = [];
  for (let i = 0; i < count; i++) {
    const raw = await cards.nth(i).getAttribute("data-price-mad");
    expect(raw, `card ${i} missing data-price-mad`).not.toBeNull();
    prices.push(Number(raw));
  }
  return prices;
}

export function expectPricesSorted(
  prices: number[],
  direction: ShopPriceSort,
): void {
  for (let i = 1; i < prices.length; i++) {
    if (direction === "price-asc") {
      expect(
        prices[i],
        `price at index ${i} (${prices[i]}) should be >= ${prices[i - 1]}`,
      ).toBeGreaterThanOrEqual(prices[i - 1]!);
    } else {
      expect(
        prices[i],
        `price at index ${i} (${prices[i]}) should be <= ${prices[i - 1]}`,
      ).toBeLessThanOrEqual(prices[i - 1]!);
    }
  }
}

export async function selectShopSort(
  page: Page,
  sort: ShopPriceSort,
  label: string,
): Promise<void> {
  const select = page.locator("#shop-sort");
  await expect(select).toBeVisible();
  await Promise.all([
    page.waitForURL(new RegExp(`[?&]sort=${sort}(?:&|$)`), {
      waitUntil: "commit",
    }),
    select.selectOption({ label }),
  ]);
}
