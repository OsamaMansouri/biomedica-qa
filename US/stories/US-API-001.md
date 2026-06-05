# US-API-001 · Products list contract

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-API · Public & admin API contracts |
| Priority | P2 |
| Status | ⚪ Deferred |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** integration consumer  
**I want** stable JSON for paginated products  
**So that** front and tests do not break silently

## QA — acceptance criteria

- Given GET /api/products with pagination, When the response returns 200, Then the body includes a data array and meta pagination fields
- Given per_page outside the allowed range, When the request is processed, Then the API clamps per_page to 1–100
- Given GET /api/products with pagination, When the storefront shop loads, Then products render without client errors (covered by shop smoke/e2e)

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `—` |
| Automated | `code-first/smoke/storefront-shop.spec.ts` (indirect) |
| Manual | Deferred — API contract testing out of scope for now |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
