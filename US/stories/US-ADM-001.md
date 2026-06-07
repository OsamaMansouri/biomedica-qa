# US-ADM-001 · Admin authenticates

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-ADMIN · Admin & operations |
| Priority | P0 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** staff user  
**I want** to log in to admin API with Sanctum  
**So that** I reach protected routes

## QA — acceptance criteria

- Given valid admin credentials, When POST /api/admin/login is called, Then a bearer token is issued
- Given logout and me endpoints, When called with appropriate tokens and middleware, Then behaviour matches the configured middleware groups

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `—` _(no feature file — manual only)_ |
| Automated | — |
| Manual | **Manual_Test_Notes** in [`test-coverage.csv`](../../docs/spreadsheets/test-coverage.csv) |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
