# Playwright (`QA/playwright/`)

## Automation (CI)

Playwright specs under `tests/` — smoke and e2e.

| Folder | Command (FR) |
|--------|----------------|
| `tests/smoke/` | `npm run test:smoke:fr` |
| `tests/e2e/` | `npm run test:e2e:fr` |
| Both | `npm run test:ci:fr` |

From repo root: `npm run qa:smoke:fr`, `npm run qa:e2e:fr`.

Local: [`QA/playwright/.env.example`](QA/playwright/.env.example). CI: [`.github/workflows/qa-ci.yml`](../.github/workflows/qa-ci.yml).

## Acceptance criteria (not CI)

**`features/`** — Gherkin scenarios (`smoke/`, `e2e/`). Documentation for Jira/Azure and traceability. **Not run in CI** — execution is `tests/` only.

Tags in features (`@cart`, `@smoke`, `@e2e`, …) match tags in test titles for traceability.

Process: [`../docs/qa-process.md`](../docs/qa-process.md). Manual sign-off: [`../docs/spreadsheets/manual-catalog.csv`](../docs/spreadsheets/manual-catalog.csv).

## Setup

```bash
cd QA/playwright
npm install
npx playwright install chromium
cp .env.example .env   # PLAYWRIGHT_ORIGIN, PLAYWRIGHT_TEST_PROMO_CODE=SAVE10 for @promo e2e
```

Promo automation:

| Command | Covers |
|---------|--------|
| `npm run test:smoke:fr -- --grep "@promo"` | TC-SMOKE-040 — promo UI visible/clickable |
| `npm run test:e2e:fr -- --grep "@promo"` | TC-E2E-035–038 — requires `PLAYWRIGHT_TEST_PROMO_CODE` in admin |

Manual sign-off: **manual-catalog.csv** — TC-MAN-045, 049, 050 (storefront promo only).

## Notes

- **Allure tags:** `@smoke`, `@e2e`, `@cart`, etc. in test titles are picked up automatically — filter in the report or run `npm run test:smoke:fr -- --grep "@promo"`.
- Default locale projects: **fr** and **en** (`playwright.config.ts`).
- On failure locally: **trace + video + screenshot**; in **CI**: **trace + screenshot** only (no video). Open with `npx playwright show-report reports/playwright-html`.
- One worker by default — set `PLAYWRIGHT_WORKERS=2` in `.env` on a fast machine if needed.
- VS Code extension may run one project; CLI `npm run qa:e2e` runs **fr + en**.
- **Google Analytics:** tests send `X-Playwright-Test: 1` so storefront skips GA (no fake “active pages” in GA4 Realtime). GA only loads on `https://biomedica.ma` in production — see `front/src/lib/google-analytics.ts`.
