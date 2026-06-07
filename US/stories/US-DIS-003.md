# US-DIS-003 · Open product detail from slug

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-DISCOVERY · Discovery & catalog |
| Priority | P0 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** shopper  
**I want** to open a PDP by slug with price, stock signal, images, and add‑to‑cart  
**So that** I can decide to buy

## QA — acceptance criteria

- Given an unknown product slug, When GET /api/products/{slug} is requested, Then the API returns 404
- Given a published product slug, When GET /api/products/{slug} is requested, Then the API returns 200 with a product payload
- Given PDP with primary add-to-cart enabled, When automation targets ATC, Then the control exposes stable test id qa-pdp-atc-primary
- Given API fields in_stock and stock_quantity, When PDP shows inventory messaging, Then copy matches those rules

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `playwright/bdd/features/smoke/pdp.feature`; `playwright/bdd/features/e2e/pdp.feature` |
| Automated | `code-first/smoke/storefront-pdp.spec.ts`; `storefront-pdp-oos.spec.ts`; `code-first/e2e/pdp-*.spec.ts`; `product-not-found.spec.ts` |
| Manual | **Manual_Test_Notes** in [`test-coverage.csv`](../../docs/spreadsheets/test-coverage.csv) |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
