# QA process (Biomedica)

Standard setup: **automated tests in CI where possible**, **manual checks in `manual-catalog.csv`**, **Gherkin for acceptance criteria**.

## Principles

1. **Jira for tickets; QA repo for proof.** Depth lives in spreadsheets, Gherkin features, and Playwright specs.
2. **The real gate is Playwright.** Smoke locally on localhost; **CI runs smoke on Netlify + prod API** (see [`.github/workflows/qa-ci.yml`](../.github/workflows/qa-ci.yml)).
3. **Manual before automation (new work).** Add a row in [`manual-catalog.csv`](spreadsheets/manual-catalog.csv), run on staging, then automate in `tests/`.
4. **FR in CI.** PR gate: `smoke-fr`. Nightly: `smoke-fr` + `e2e-fr`. EN specs — local only. Default: `npm run qa:smoke:fr`.

## Artifact map

```text
QA/
├── docs/
│   ├── qa-process.md            ← this file
│   └── spreadsheets/
│       ├── manual-catalog.csv   ← manual cases + sign-off
│       ├── smoke-catalog.csv    ← smoke exec log
│       └── e2e-catalog.csv      ← e2e exec log
└── playwright/
    ├── tests/                   ← CI automation (smoke + e2e)
    └── features/                ← Gherkin AC (not CI)
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

5. Update **manual-catalog.csv** or smoke/e2e catalogs if you added cases or specs.

### New feature or flow

1. Add or update a row in [`manual-catalog.csv`](spreadsheets/manual-catalog.csv) (steps, priority, module).
2. Execute on staging → fill **Resultat_obtenu**, **Date_execution**, **Executant**.
3. Automate in `tests/` when stable → set **Automatise** to `Oui` or `Partiel`.
4. Add catalog row for the spec → mark **Exec_OK** / **Last_Exec_Date** after CI.

### Release / staging sign-off

1. Run full suite against staging — locally (`.env` with staging URLs) or CI.
2. Walk **P0** rows in **manual-catalog.csv** not yet signed off.
3. Update **Last_Exec_Date** in smoke/e2e catalogs after the run.

## What runs in CI

| Job | When | What |
|-----|------|------|
| `typecheck` | Every push/PR | Typecheck `playwright/` |
| `smoke-fr` | Every push/PR | Smoke FR on Netlify preview |
| `smoke-fr` + `e2e-fr` | Nightly 03:00 UTC | Full FR regression (QA Nightly workflow) |

Workflow files: `QA/.github/workflows/qa-ci.yml` + `qa-nightly.yml` — **QA git repo only**.

No CSV gate in CI.

**Promo codes:** manual TC-MAN-045/049/050 in [`manual-catalog.csv`](spreadsheets/manual-catalog.csv); automation TC-SMOKE-040, TC-E2E-035–038.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run qa:smoke:fr` | Fast regression (~40 tests) |
| `npm run qa:e2e:fr` | Deeper flows (~35 tests) |
| `npm run qa:typecheck` | Typecheck specs only |
| `npm run qa:ci:local` | typecheck + smoke FR (app must be up) |

## FAQ

**What counts as “done” for a P0 flow?**  
Manual case signed off in **manual-catalog.csv** **and/or** automated spec(s) passing — ideally **both** (manual first, then automation).

**Do we run Gherkin in CI?**  
No. `features/` is AC documentation only; execution is Playwright specs in `tests/`.

**Where do manual tests live?**  
[`manual-catalog.csv`](spreadsheets/manual-catalog.csv) — one row per manual case with full steps.

**Promo automation vs manual?**  
Manual: TC-MAN-045, 049, 050 in **manual-catalog.csv**. Automated: TC-SMOKE-040, TC-E2E-035–038. Admin promo setup is a prerequisite only.
