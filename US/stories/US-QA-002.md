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

- Given `docs/spreadsheets/test-coverage.csv`, When reviewing P0 stories, Then each row has Automated_Playwright and/or Manual_Test_Notes filled
- Given a new P0 story, When it ships, Then the pair card and coverage row are updated before release

## Proof

| Type | Reference |
|------|-----------|
| Automated | — |
| Manual | [`docs/spreadsheets/test-coverage.csv`](../../docs/spreadsheets/test-coverage.csv) maintained each sprint |
