# US-CART-003 · Apply and validate promo code

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-CART · Cart & checkout |
| Priority | P1 |
| Status | 🟡 Partial |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** shopper  
**I want** to enter a promo code at checkout  
**So that** I receive the advertised discount when valid

## QA — acceptance criteria

- Given an invalid promo code at checkout, When I attempt to place the order, Then a localized error is shown and no order is created
- Given a valid promo code, When checkout completes through the checkout API submit path, Then totals reflect the server-side promo adjustment

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `—` |
| Automated | `See docs/spreadsheets/test-coverage.csv` |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
