import type { TestInfo } from "@playwright/test";

export type Locale = "fr" | "en";

/** BDD track: locale from Playwright project (`fr` / `en`). */
export function localeFromTestInfo(testInfo: TestInfo): Locale {
  return testInfo.project.name === "en" ? "en" : "fr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "fr" ? "en" : "fr";
}
