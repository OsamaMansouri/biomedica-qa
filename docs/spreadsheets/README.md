# Spreadsheets

CSV files for **coverage mapping** and **execution tracking**. Open in Excel, Google Sheets, or VS Code.

## Files

| File | Purpose |
|------|---------|
| [`manual-catalog.csv`](manual-catalog.csv) | Manual test cases — steps, sign-off, automation link |
| [`smoke-catalog.csv`](smoke-catalog.csv) | All smoke tests — execution log |
| [`e2e-catalog.csv`](e2e-catalog.csv) | All e2e tests — execution log |

## manual-catalog.csv

| Column | Description |
|--------|-------------|
| TC_ID | `TC-MAN-001`, … |
| Module | Area (Storefront, Panier, Checkout, Paiement, Admin, …) |
| Cas_manuel_recette | Short manual case title |
| Type_test | `Sign-off`, `Exploratory`, or `Negative` — human QA only |
| Priorite | P0 / P1 / P2 |
| Prerequis | Environment and data needed |
| Donnees_test | Test data |
| Etapes | Comma-separated steps |
| Resultat_attendu | Expected outcome |
| Resultat_obtenu | Fill on execution |
| Date_execution | ISO date |
| Executant | Who ran it |
| Environnement | `staging`, `local`, `CI`, … |
| Automatise | `Yes`, `No`, or `Partial` — Playwright coverage |

**Scope:** manual recette, visual/content judgment, real payment/email checks, admin operator flows. **Not here:** Playwright smoke/e2e regressions (see `smoke-catalog.csv` / `e2e-catalog.csv`), CI pipelines, SEO meta/view-source, Lighthouse, DevTools console, URL param edge cases.

**Row order:** customer journey — Storefront → … → Admin. Within each module: Sign-off → Exploratory → Negative. Regenerate with `python scripts/gen-manual-catalog.py`.

## smoke-catalog.csv / e2e-catalog.csv

| Column | Description |
|--------|-------------|
| TC_ID | `TC-SMOKE-001` or `TC-E2E-001` |
| Tags | From test title (`@smoke`, `@cart`, …) |
| Title | Test name |
| Gherkin_Feature | AC source under `playwright/` (e.g. `bdd/features/smoke/cart.feature`) |
| Spec_File | Relative to `playwright/` |
| Run_FR | `npm run test:smoke:fr` or `test:e2e:fr` |
| Manual_OK | `Y` after manual sign-off on staging |
| Manual_Date | ISO date of manual sign-off |
| Exec_OK | `Y` / `N` after first automated sign-off |
| Exec_Date | ISO date of **first** automated sign-off |
| Last_Exec_Date | ISO date of **most recent** CI/staging run |
| Notes | Flakes, data deps |

Add a row when you create a new spec.
