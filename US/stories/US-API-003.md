# US-API-003 · Contact message intake

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-API · Public & admin API contracts |
| Priority | P2 |
| Status | ⚪ Backlog |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** visitor  
**I want** to submit contact form to API  
**So that** the business receives the message

## QA — acceptance criteria

- Given a valid POST /api/contact payload, When the request succeeds, Then the message is persisted and a success response is returned
- Given rate limiting or spam controls exist, When they are documented, Then testers know expected behaviour for abuse scenarios

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `playwright/bdd/features/smoke/contact.feature; e2e/contact.feature` |
| Automated | `code-first/smoke/storefront-contact.spec.ts; code-first/e2e/contact-form-submit.spec.ts` |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
