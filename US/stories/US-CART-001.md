# US-CART-001 · Add line to cart from PDP

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-CART · Cart & checkout |
| Priority | P0 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** shopper  
**I want** to add a SKU to the cart from the PDP primary button  
**So that** I can prepare checkout

## QA — acceptance criteria

- Given I added a product from PDP, When the cart drawer or flow is open, Then a checkout CTA is available with test id qa-cart-checkout for automation
- Given lines and quantities in the cart, When totals update on the client, Then quantity and line subtotal follow cart state rules

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `playwright/bdd/features/smoke/cart.feature`; `playwright/bdd/features/e2e/cart.feature` |
| Automated | `code-first/smoke/storefront-add-to-cart-drawer.spec.ts`; `storefront-cart-*.spec.ts`; `code-first/e2e/cart-*.spec.ts` |
| Manual | **Manual_Test_Notes** in [`test-coverage.csv`](../../docs/spreadsheets/test-coverage.csv) |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
