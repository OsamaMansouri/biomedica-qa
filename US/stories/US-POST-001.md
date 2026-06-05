# US-POST-001 · Thank you page shows order reference

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-POST · Post‑purchase |
| Priority | P0 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** shopper  
**I want** to see confirmation copy and reference after purchase  
**So that** I can trust the order was created

## QA — acceptance criteria

- Given stored confirmation payload after purchase, When the thank-you view renders, Then FR/EN strings align with message bundles
- Given an order reference, When GET /api/order-confirmation/{reference} is called, Then the payload is consistent with the placed order

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `playwright/bdd/features/e2e/checkout.feature` |
| Automated | `code-first/e2e/order-cod-free-shipping.spec.ts` |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
