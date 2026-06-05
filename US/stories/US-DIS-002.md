# US-DIS-002 · Browse shop and category product listings

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-DISCOVERY · Discovery & catalog |
| Priority | P0 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** shopper  
**I want** to browse categories and see published products  
**So that** I can compare offers before PDP

## QA — acceptance criteria

- Given the shop loads, When categories are loaded from the API, Then the storefront surfaces those categories
- Given a category that has products, When I view its listing, Then only published products appear and pagination meta is present when applicable
- Given an empty listing or empty category state, When it renders, Then the client does not throw errors

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `playwright/bdd/features/smoke/shop.feature; e2e/shop.feature; e2e/home.feature; e2e/magazine.feature` |
| Automated | `code-first/smoke/storefront-shop.spec.ts; code-first/e2e/shop-*.spec.ts` |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
