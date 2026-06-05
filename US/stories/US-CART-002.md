# US-CART-002 · Guest checkout with address and shipping quote

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-CART · Cart & checkout |
| Priority | P0 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** guest  
**I want** to enter contact and address and receive shipping options  
**So that** I know delivery cost before paying

## QA — acceptance criteria

- Given a non-empty cart and a valid address payload, When POST /api/shipping/quote is called, Then returned methods are compatible with the cart and address
- Given a shipping quote failure, When checkout displays the error, Then quote errors are visually distinct from address or field validation errors
- Given an empty cart, When I try to proceed to checkout, Then checkout is blocked and a clear CTA returns me to the shop

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `playwright/bdd/features/smoke/checkout.feature; e2e/checkout.feature` |
| Automated | `code-first/e2e/checkout-*.spec.ts; order-cod-free-shipping.spec.ts` |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
