# US-QA-003 · Production / CI environment parity

| Field | Value |
|-------|-------|
| Epic | EP-QUALITY |
| Priority | P1 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` |

## PO — intent

**As a** tester  
**I want** CI to hit the same live URLs as customers  
**So that** GitHub results reflect real production behaviour

## QA — acceptance criteria

- Given GitHub Actions, When smoke runs, Then `PLAYWRIGHT_ORIGIN` is `https://biomedica.ma` and API is `https://api.biomedica.ma`
- Given prod catalog, When tests use default slug, Then `PLAYWRIGHT_TEST_PRODUCT_SLUG=argan-et-figue-de-barbarie-60ml`
- Given checkout e2e, When `ENABLE_PLAYWRIGHT_E2E` is not set, Then CI does not place COD orders on prod

## Proof

| Type | Reference |
|------|-----------|
| Automated | `.github/workflows/qa.yml`; [`docs/github-actions.md`](../../docs/github-actions.md) |
| Manual | Verify smoke job green on main after merge |
