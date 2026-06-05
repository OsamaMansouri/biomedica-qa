import type { APIRequestContext } from "@playwright/test";

import { STORE_FRONT_E2E_OOS_PRODUCT_SLUG } from "../i18n/strings";

export function catalogApiOrigin(): string {
  const raw =
    process.env.PLAYWRIGHT_API_BASE_URL?.trim() || "http://localhost:8000";
  return raw.replace(/\/$/, "");
}

export function oosProductSlug(): string {
  return (
    process.env.PLAYWRIGHT_TEST_OOS_PRODUCT_SLUG?.trim() ||
    STORE_FRONT_E2E_OOS_PRODUCT_SLUG
  ).trim();
}

/** True when the OOS fixture slug exists in the catalog with zero stock. */
export async function outOfStockFixtureAvailable(
  request: APIRequestContext,
): Promise<boolean> {
  const slug = oosProductSlug();
  const res = await request.get(
    `${catalogApiOrigin()}/api/products/${encodeURIComponent(slug)}`,
  );
  if (!res.ok()) return false;
  const json = (await res.json()) as {
    data?: { stock_quantity?: number | null; in_stock?: boolean };
  };
  const product = json.data;
  if (!product) return false;
  if (product.in_stock === false) return true;
  return product.stock_quantity === 0;
}

export async function fetchShopLastPage(
  request: APIRequestContext,
  perPage = 10,
): Promise<number> {
  const res = await request.get(
    `${catalogApiOrigin()}/api/products?per_page=${perPage}`,
  );
  if (!res.ok()) return 1;
  const json = (await res.json()) as { meta?: { last_page?: number } };
  return Math.max(1, json.meta?.last_page ?? 1);
}
