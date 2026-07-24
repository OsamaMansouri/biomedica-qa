import { test } from "@playwright/test";

/**
 * Soft-skip @skip specs in CI so they still appear as Skipped in the report.
 * Set PLAYWRIGHT_RUN_SKIP=1 (or run scripts/run-skip-tests.mjs) to execute them.
 */
export function skipRealSideEffectsUnlessForced(): void {
  test.skip(
    Boolean(process.env.CI) && process.env.PLAYWRIGHT_RUN_SKIP !== "1",
    "Real order/email — skipped in CI (set PLAYWRIGHT_RUN_SKIP=1 to run)",
  );
}
