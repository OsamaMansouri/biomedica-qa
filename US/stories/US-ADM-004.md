# US-ADM-004 · Configure shipping methods and settings

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-ADMIN · Admin & operations |
| Priority | P1 |
| Status | 🟡 Partial |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** administrator  
**I want** to maintain shipping methods and site settings  
**So that** checkout quotes stay accurate

## QA — acceptance criteria

- Given shipping method CRUD where admin.full is required, When an unauthorized role calls the endpoint, Then the request fails; When authorized, Then CRUD succeeds per rules
- Given settings upsert with keys documented in admin UI, When validation runs, Then invalid keys or values are rejected

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `—` |
| Automated | `See docs/spreadsheets/test-coverage.csv` |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
