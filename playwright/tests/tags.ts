/**
 * Tags live in the test title (Playwright specs) or Feature/Scenario lines (BDD).
 *
 * Playwright:
 *   test("Guest: cart lines survive a full page reload @cart @e2e", async () => { … })
 *
 * Filter: npx playwright test --grep "@cart"
 * Skip in CI: @skip (real order / contact email) — excluded when CI=true unless PLAYWRIGHT_RUN_SKIP=1
 */
