import type { APIRequestContext } from "@playwright/test";

import type { Locale } from "../i18n/locale";
import { catalogApiOrigin } from "./catalogApi";

export type MagazineSectionTopic = {
  label: string;
  slug: string;
};

/** Live `/api/posts/sections` — empty on prod until posts have section_cluster_slug. */
export async function fetchMagazineSectionTopics(
  request: APIRequestContext,
  locale: Locale,
): Promise<MagazineSectionTopic[]> {
  const res = await request.get(
    `${catalogApiOrigin()}/api/posts/sections?locale=${locale}`,
  );
  if (!res.ok()) return [];
  const json = (await res.json()) as { data?: MagazineSectionTopic[] };
  return Array.isArray(json.data) ? json.data : [];
}

/** Optional `PLAYWRIGHT_TEST_MAGAZINE_SECTION_SLUG`; otherwise first API topic. */
export async function resolveSmokeMagazineSection(
  request: APIRequestContext,
  locale: Locale,
): Promise<MagazineSectionTopic | null> {
  const topics = await fetchMagazineSectionTopics(request, locale);
  const override = process.env.PLAYWRIGHT_TEST_MAGAZINE_SECTION_SLUG?.trim();
  if (override) {
    return topics.find((t) => t.slug === override) ?? null;
  }
  return topics[0] ?? null;
}
