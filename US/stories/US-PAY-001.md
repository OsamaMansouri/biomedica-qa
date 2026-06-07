# US-PAY-001 · Place order with cash on delivery

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-PAY · Payments |
| Priority | P0 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** guest  
**I want** to choose COD and place the order  
**So that** I can pay on delivery

## QA — acceptance criteria

- Given COD is selected with a valid checkout payload, When POST /api/checkout succeeds, Then the response includes reference totals currency and lines
- Given the checkout review step, When automation targets submit, Then the primary control exposes test id qa-checkout-submit
- Given a successful checkout response, When the client finishes, Then confirmation is stored in session and the user is routed to thank-you with ref in the query string

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `playwright/bdd/features/e2e/checkout.feature` |
| Automated | `code-first/e2e/order-cod-free-shipping.spec.ts` |
| Manual | **Manual_Test_Notes** in [`test-coverage.csv`](../../docs/spreadsheets/test-coverage.csv) |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
