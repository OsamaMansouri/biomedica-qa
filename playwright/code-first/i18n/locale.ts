import type { TestInfo } from "@playwright/test";

export type Locale = "fr" | "en";

/**
 * `playwright.config.ts` projects must be named `fr` and `en`.
 * Default `npm test` / `qa:e2e` / `qa:smoke` run all projects (both locales).
 * Use `test:fr` / `qa:e2e:fr` / `qa:smoke:fr` for `--project=fr` only.
 */
export function localeFromProject(testInfo: TestInfo): Locale {
  return testInfo.project.name === "en" ? "en" : "fr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "fr" ? "en" : "fr";
}
