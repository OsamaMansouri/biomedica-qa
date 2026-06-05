# US-API-002 · Checkout contract validation

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-API · Public & admin API contracts |
| Priority | P0 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** system  
**I want** checkout API to reject malformed payloads with 4xx  
**So that** bad orders never persist

## QA — acceptance criteria

- Given POST /api/checkout with missing lines invalid product_id or quantity zero, When validation runs, Then the API returns a structured validation error
- Given concurrent stock changes during checkout, When OrderStockService applies rules, Then outcome matches documented stock behaviour

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `—` |
| Automated | `See docs/spreadsheets/test-coverage.csv` |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
