# US-QA-001 · CI pipeline proves critical automation

| Field | Value |
|-------|-------|
| Epic | EP-QUALITY |
| Priority | P0 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` |

## PO — intent

**As a** release owner  
**I want** CI to typecheck and run Playwright smoke on biomedica.ma  
**So that** we catch broken specs and live regressions before release

## QA — acceptance criteria

- Given a pull request, When CI runs, Then Playwright suite typechecks successfully
- Given the smoke job, When it runs, Then tests target `https://biomedica.ma/fr/` with API `https://api.biomedica.ma`
- Given checkout e2e, When `ENABLE_PLAYWRIGHT_E2E` is not enabled, Then no automated orders are placed on prod

## Proof

| Type | Reference |
|------|-----------|
| Automated | `.github/workflows/qa.yml`; [`docs/github-actions.md`](../../docs/github-actions.md) |
| Manual | Green `playwright-smoke` job on GitHub |
