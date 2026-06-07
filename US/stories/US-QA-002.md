# US-QA-002 · Test coverage map (automated + manual)

| Field | Value |
|-------|-------|
| Epic | EP-QUALITY |
| Priority | P1 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` |

## PO — intent

**As a** QA lead  
**I want** each story linked to automated tests and/or manual checks  
**So that** release sign-off is clear

## QA — acceptance criteria

- Given `docs/spreadsheets/test-coverage.csv`, When reviewing P0 stories, Then each row has **Manual_Test_Notes** (manual-first) and/or **Automated_Playwright** filled
- Given a new P0 story, When it ships, Then the pair card and coverage row are updated before release

## Proof

| Type | Reference |
|------|-----------|
| Gherkin (AC) | `—` _(meta — links all story features via CSV)_ |
| Automated | [`docs/spreadsheets/test-coverage.csv`](../../docs/spreadsheets/test-coverage.csv); [`smoke-catalog.csv`](../../docs/spreadsheets/smoke-catalog.csv); [`e2e-catalog.csv`](../../docs/spreadsheets/e2e-catalog.csv) |
| Manual | Each P0 row has **Manual_Test_Notes** + catalog **Manual_OK** |
