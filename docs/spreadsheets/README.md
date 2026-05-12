# Spreadsheets

**`test-catalog.csv`** — single cahier: Playwright + REST Assured + manual cases. Fill **Exec_OK**, **Exec_Date**, **Executor** on manual rows when you sign off. There is **no `Artifact` column** (and none should be added): how to run a check lives in **Run_Command** or the manual **Notes** area.

**`TC_ID`** is a single sequence **`TC-001` …** in the same order as the rows (not separate PW/API/MAN counters).

Rows are ordered by **`Story_ID`** (discovery → cart → payment → post-purchase → i18n → API → admin → QA meta), then within each story by layer **API → Manual → Smoke → E2E** (manual exploratory / sign-off before automated UI layers). If a story has no API row, that block starts with **Manual** (when present), then Smoke, then E2E.

After bulk edits, re-apply that order and renumber **`TC_ID`** from this folder:

`node sort-test-catalog.mjs`
