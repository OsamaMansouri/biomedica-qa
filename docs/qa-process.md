# QA process (Biomedica)

Standard setup: **automated tests in CI where possible**, **manual checks where automation cannot go**, **Gherkin for acceptance criteria**.

## Principles

1. **PO writes titles; QA writes proof.** Jira stays thin; depth lives in `US/stories/` and optional Gherkin features.
2. **The real gate is Playwright.** Smoke locally on localhost; **CI runs smoke on `https://biomedica.ma`** (see [`github-actions.md`](github-actions.md)).
3. **Every story is automated and/or manual.** Track both in `docs/spreadsheets/test-coverage.csv` — no script blocks the pipeline for spreadsheet hygiene.
4. **Manual before automation (new work).** Write **Manual_Test_Notes** in `test-coverage.csv` and run once on staging **before** adding Playwright specs. Automation encodes what manual already proved.
5. **FR in CI.** PR gate: `smoke-fr`. Nightly: `smoke-fr` + `e2e-fr`. EN specs — local only. Default: `npm run qa:smoke:fr`.

## Artifact map

```text
QA/
├── US/                          ← Pair backlog (PO title + QA AC)
├── docs/
│   ├── qa-process.md            ← this file
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
3. QA: add **Manual_Test_Notes** in [`test-coverage.csv`](spreadsheets/test-coverage.csv) → **execute manual once on staging** → mark **Manual_OK** / **Manual_Date** in smoke/e2e catalogs.
4. QA: automate in `code-first/` when the flow is stable → link paths in **Automated_Playwright**.
5. Mark **Exec_OK** / **Exec_Date** / **Last_Exec_Date** in catalogs after CI or staging runs.

### Release / staging sign-off

1. Run full suite against staging — locally (`.env` with staging URLs) or in CI when variables are set.
2. Confirm P0 rows in `test-coverage.csv` have **Manual_Test_Notes** signed off (**Manual_OK** in catalogs).
3. Update **Last_Exec_Date** in smoke/e2e catalogs after the run.

## What runs in CI

| Job | When | What |
|-----|------|------|
| `typecheck` | Every push/PR | Typecheck `playwright/` |
| `smoke-fr` | Every push/PR | Smoke FR on Netlify preview |
| `smoke-fr` + `e2e-fr` | Nightly 03:00 UTC | Full FR regression (QA Nightly workflow) |

Workflow files: `QA/.github/workflows/qa-ci.yml` + `qa-nightly.yml` — **QA git repo only**, no backend/front jobs.

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
Manual path documented in **Manual_Test_Notes** and run on staging **or** automated spec(s) passing — ideally **both** (manual first, then automation). Record in `test-coverage.csv` and pair card.

**Do we run Gherkin in CI?**  
No. Features are the AC catalog; execution is code-first only.

**Where do manual tests live?**  
Per-story **Manual_Test_Notes** in `test-coverage.csv`, pair cards, and **Manual_OK** / **Manual_Date** on catalog rows (smoke + e2e).
