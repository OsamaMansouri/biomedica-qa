/**
 * Tags live in the test title (Playwright specs) or Feature/Scenario lines (BDD).
 *
 * Playwright:
 *   test("Guest: cart lines survive a full page reload @cart @e2e", async () => { … })
 *
 * Filter: npx playwright test --grep "@cart"
 * Soft-skip in CI: @skip (real order / contact email) — still listed as Skipped unless PLAYWRIGHT_RUN_SKIP=1
 */
