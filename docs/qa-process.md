# QA process (Biomedica)

Standard setup: **automated tests in CI where possible**, **manual checks where automation cannot go**, **Gherkin for acceptance criteria**.

## Principles

1. **PO writes titles; QA writes proof.** Jira stays thin; depth lives in `US/stories/` and optional Gherkin features.
2. **The real gate is Playwright.** Smoke locally on localhost; **CI runs smoke on `https://biomedica.ma`** (see [`github-actions.md`](github-actions.md)).
3. **Every story is automated and/or manual.** Track both in `docs/spreadsheets/test-coverage.csv` — no script blocks the pipeline for spreadsheet hygiene.
4. **FR first, EN for parity.** Default local run: `npm run qa:smoke:fr`.

## Artifact map

```text
QA/
├── US/                          ← Pair backlog (PO title + QA AC)
├── docs/
│   ├── qa-process.md            ← this file
│   ├── manual-testing.md        ← manual-only and exploratory checks
│   └── spreadsheets/
│       ├── test-coverage.csv    ← automated + manual per story
│       ├── smoke-catalog.csv    ← smoke exec log
│       └── e2e-catalog.csv      ← e2e exec log
└── playwright/
    ├── code-first/              ← CI automation (smoke + e2e)
    └── bdd/features/            ← Gherkin AC catalog (not CI)
```

## Daily workflow

### Before you open a PR

1. Storefront running (`npm run dev` in `front/` → port **3333**).
2. API up if tests touch catalog/checkout (`npm run api` from repo root).
3. Run smoke:

```bash
npm run qa:smoke:fr
```

4. If you touched checkout, locale, or shop depth — run e2e:

```bash
npm run qa:e2e:fr
```

5. Update `test-coverage.csv` if you added automation or a new manual-only area.

### When PO opens a story

1. PO: title in Jira → paste key on [`US/stories/US-xxx.md`](../US/stories/).
2. QA: write AC (Jira + pair card + optional `bdd/features/`).
3. QA: automate in `code-first/` **or** add steps to [`manual-testing.md`](manual-testing.md).
4. QA: fill **Automated_Playwright** and/or **Manual_Test_Notes** in `test-coverage.csv`.

### Release / staging sign-off

1. Run full suite against staging — locally (`.env` with staging URLs) or in CI when variables are set.
2. Walk [`manual-testing.md`](manual-testing.md) checklist (CMI, admin, promo, copy).
3. Mark **Exec_OK** / **Exec_Date** in smoke/e2e catalogs.

## What runs in CI

| Job | When | What |
|-----|------|------|
| `typecheck` | Every PR (QA repo) | Typecheck `playwright/` |
| `smoke` | Every PR (QA repo) | Smoke FR on **https://biomedica.ma** |
| `e2e` | `ENABLE_PLAYWRIGHT_E2E=true` | Full suite — real COD orders |

Workflow file: `QA/.github/workflows/qa.yml` — **QA git repo only**, no backend/front jobs.

Setup: **[`github-actions.md`](github-actions.md)**.

No CSV gate. No REST Assured job in CI (deferred).

## Commands

| Command | Purpose |
|---------|---------|
| `npm run qa:smoke:fr` | Fast regression (~39 tests) |
| `npm run qa:e2e:fr` | Deeper flows (~31 tests) |
| `npm run qa:typecheck` | Typecheck specs only |
| `npm run qa:ci:local` | typecheck + smoke FR (app must be up) |

## FAQ

**What counts as “done” for a P0 story?**  
Automated spec(s) passing **or** documented manual steps executed on staging, recorded on the pair card and in `test-coverage.csv`.

**Do we run Gherkin in CI?**  
No. Features are the AC catalog; execution is code-first only.

**Where do manual tests live?**  
[`manual-testing.md`](manual-testing.md) for shared checklists; per-story notes in `test-coverage.csv` and pair cards.
