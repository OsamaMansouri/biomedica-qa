# US-DIS-004 · Search and sort catalog

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-DISCOVERY · Discovery & catalog |
| Priority | P1 |
| Status | 🟡 Partial |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** shopper  
**I want** to search by name or slug and sort by featured or price  
**So that** I can narrow large catalogs

## QA — acceptance criteria

- Given query parameters q, sort, and per_page within documented bounds, When GET /api/products is called, Then the API honors them
- Given a catalog API failure such as 5xx, When the storefront catalog UI loads, Then the user sees an error path and not a silent empty success

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `playwright/bdd/features/smoke/search.feature; e2e/search.feature; e2e/shop.feature` |
| Automated | `code-first/smoke/storefront-search.spec.ts; code-first/e2e/search-*.spec.ts; shop-sort.spec.ts` |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
