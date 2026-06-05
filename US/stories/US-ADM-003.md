# US-ADM-003 · Operate orders

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-ADMIN · Admin & operations |
| Priority | P1 |
| Status | 🟡 Partial |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** operations  
**I want** list, show, update orders and export where allowed  
**So that** fulfillment can proceed

## QA — acceptance criteria

- Given order listing with filters and pagination, When results return, Then they match agreed business rules
- Given invoice or export routes, When the caller has admin.panel versus admin.full, Then access matches role middleware

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `—` |
| Automated | `See docs/spreadsheets/test-coverage.csv` |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
