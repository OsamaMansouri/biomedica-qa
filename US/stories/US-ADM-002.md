# US-ADM-002 · Manage products and stock

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-ADMIN · Admin & operations |
| Priority | P0 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** catalog manager  
**I want** CRUD on products, images, featured flag, and stock quantity  
**So that** storefront reflects inventory

## QA — acceptance criteria

- Given admin product routes, When the caller lacks auth:sanctum or admin.panel, Then access is denied; When authorized, Then CRUD behaves per route design
- Given a stock update from admin, When the storefront reads the product, Then in_stock reflects the change within cache or freshness rules
- Given an image upload request, When the file is processed, Then MIME type and size are validated

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `—` _(no feature file — manual only)_ |
| Automated | — |
| Manual | **Manual_Test_Notes** in [`test-coverage.csv`](../../docs/spreadsheets/test-coverage.csv) |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
