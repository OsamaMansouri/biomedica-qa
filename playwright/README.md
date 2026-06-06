# Playwright (`QA/playwright/`)

## Automation (CI)

**Code-first** specs under `code-first/` — classic Playwright tests.

| Folder | Command (FR) |
|--------|----------------|
| `code-first/smoke/` | `npm run test:smoke:fr` |
| `code-first/e2e/` | `npm run test:e2e:fr` |
| Both | `npm run test:ci:fr` |

From repo root: `npm run qa:smoke:fr`, `npm run qa:e2e:fr`.

Local: [`QA/playwright/.env.example`](QA/playwright/.env.example). CI: [`QA/docs/github-actions.md`](QA/docs/github-actions.md).

## Acceptance criteria (not CI)

**`bdd/features/`** — Gherkin scenarios (`smoke/`, `e2e/`). Use as the **AC source** for Jira/Azure; copy or keep in sync with tickets. **Not run in CI** — execution is code-first only.

Tags in features (`@cart`, `@smoke`, `@e2e`, …) match tags in code-first test titles for traceability.

Pair cards: [`../US/`](../US/). Process: [`../docs/qa-process.md`](../docs/qa-process.md). Manual checks: [`../docs/manual-testing.md`](../docs/manual-testing.md).

## Setup

```bash
cd QA/playwright
npm install
npx playwright install chromium
cp .env.example .env   # PLAYWRIGHT_ORIGIN=http://localhost:3333
```

## Notes

- Default locale projects: **fr** and **en** (`playwright.config.ts`).
- On failure: **trace + video + screenshot** saved (`retain-on-failure`); open with `npx playwright show-report reports/playwright-html`.
- One worker by default — set `PLAYWRIGHT_WORKERS=2` in `.env` on a fast machine if needed.
- VS Code extension may run one project; CLI `npm run qa:e2e` runs **fr + en**.
