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
- Given checkout e2e, When **QA Nightly** runs, Then real COD orders may be placed on prod API (scheduled only, not on PR)

## Proof

| Type | Reference |
|------|-----------|
| Gherkin (AC) | `—` _(infra — no BDD feature)_ |
| Automated | `.github/workflows/qa-ci.yml`; `.github/workflows/qa-nightly.yml`; [`docs/github-actions.md`](../../docs/github-actions.md) |
| Manual | Green **QA CI** smoke-fr job on GitHub |
