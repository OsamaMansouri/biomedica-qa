import type { APIRequestContext } from "@playwright/test";

export function catalogApiOrigin(): string {
  const raw =
    process.env.PLAYWRIGHT_API_BASE_URL?.trim() || "http://localhost:8000";
  return raw.replace(/\/$/, "");
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
