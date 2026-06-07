# Spreadsheets

CSV files for **coverage mapping** and **execution tracking**. Open in Excel, Google Sheets, or VS Code.

## Files

| File | Purpose |
|------|---------|
| [`test-coverage.csv`](test-coverage.csv) | Per user story: what is **automated** vs **manual** |
| [`smoke-catalog.csv`](smoke-catalog.csv) | All smoke tests — log last staging run |
| [`e2e-catalog.csv`](e2e-catalog.csv) | All e2e tests — log last staging run |

## test-coverage.csv

| Column | Description |
|--------|-------------|
| Story_ID | Matches `US/stories/US-*.md` |
| Epic | Epic code |
| Title | PO-facing title |
| Priority | P0 / P1 / P2 |
| Gherkin_Feature | Semicolon-separated paths under `playwright/bdd/features/` (AC source; matches catalogs) |
| Automated_Playwright | Semicolon-separated paths under `playwright/code-first/` |
| Manual_Test_Notes | What QA runs by hand **before or alongside** automation; required before new specs |

**Manual-first rule:** for new stories, fill **Manual_Test_Notes** and run on staging **before** adding paths to **Automated_Playwright**.

**Rule of thumb:** every **P0** row should have **Manual_Test_Notes** and/or **Automated_Playwright** filled. Nothing in CI validates this — it is for your release checklist.

## smoke-catalog.csv / e2e-catalog.csv

| Column | Description |
|--------|-------------|
| TC_ID | `TC-SMOKE-001` or `TC-E2E-001` |
| Tags | From test title (`@smoke`, `@cart`, …) |
| Title | Test name |
| US_ID | Optional link to user story |
| Gherkin_Feature | AC source under `playwright/` (e.g. `bdd/features/smoke/cart.feature`) |
| Spec_File | Relative to `playwright/` |
| Run_FR | `npm run test:smoke:fr` or `test:e2e:fr` |
| Manual_OK | `Y` after manual sign-off on staging (before or without automation) |
| Manual_Date | ISO date of manual sign-off |
| Exec_OK | `Y` / `N` after first automated sign-off |
| Exec_Date | ISO date of **first** automated sign-off (when spec was validated) |
| Last_Exec_Date | ISO date of **most recent** CI/staging run |
| Notes | Flakes, data deps |

Add a row when you create a new spec.
