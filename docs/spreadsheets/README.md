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
| Gherkin_Tags | Optional tags from features |
| Automated_Playwright | Semicolon-separated paths under `playwright/code-first/` |
| Manual_Test_Notes | What QA runs by hand when automation is missing or insufficient |

**Rule of thumb:** every **P0** row should have at least one column filled. Nothing in CI validates this — it is for your release checklist.

See also [`../manual-testing.md`](../manual-testing.md) for shared manual scripts.

## smoke-catalog.csv / e2e-catalog.csv

| Column | Description |
|--------|-------------|
| TC_ID | `TC-SMOKE-001` or `TC-E2E-001` |
| Tags | From test title (`@smoke`, `@cart`, …) |
| Title | Test name |
| US_ID | Optional link to user story |
| Gherkin_Feature | Optional `.feature` path |
| Spec_File | Relative to `playwright/` |
| Run_FR | `npm run test:smoke:fr` or `test:e2e:fr` |
| Exec_OK | `Y` / `N` after staging run |
| Exec_Date | ISO date |
| Notes | Flakes, data deps |

Add a row when you create a new spec.
