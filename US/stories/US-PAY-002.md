# US-PAY-002 · Pay with CMI and return to storefront

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-PAY · Payments |
| Priority | P0 |
| Status | 🟡 Manual only |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** shopper  
**I want** to pay by card via CMI and land back on the storefront with clear status  
**So that** I know if payment succeeded

## QA — acceptance criteria

- Given CMI server notifications, When Laravel receives callbacks, Then the CMI callback route accepts them per implementation
- Given the browser returns from CMI with success or failure query parameters, When the return URL is processed, Then status is clear and secrets are not exposed in the URL
- Given CMI-related query parameters on checkout return, When the checkout client loads, Then submit state does not loop indefinitely

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `—` |
| Automated | — |
| Manual | [`docs/manual-testing.md`](../../docs/manual-testing.md) — CMI card section |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
