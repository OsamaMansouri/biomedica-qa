import type { TestInfo } from "@playwright/test";

import { localeFromTestInfo } from "../i18n/locale";
import { smokeForLocale } from "../i18n/strings";

export function bddLocale(testInfo: TestInfo) {
  return localeFromTestInfo(testInfo);
}

export function bddSmoke(testInfo: TestInfo) {
  return smokeForLocale(bddLocale(testInfo));
}
