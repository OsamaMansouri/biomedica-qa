# US-DIS-001 · View localized home and navigation

> **Pair card** — PO drops the title in Jira; QA owns everything below and keeps it in sync with `bdd/features/`.

| Field | Value |
|-------|-------|
| Epic | EP-DISCOVERY · Discovery & catalog |
| Priority | P0 |
| Status | 🟢 Ready |
| Jira | `BIOM-___` _(paste ticket key)_ |

## PO — intent

**As a** shopper  
**I want** to land on the storefront in my locale with header, shop links, and footer  
**So that** I can orient and reach the catalog quickly

## QA — acceptance criteria

- Given locale fr or en, When I open the home URL, Then the main landmark is visible and the URL reflects the locale segment
- Given a storefront route that is not the checkout shell, When the page renders, Then header and footer chrome are visible
- Given the announcement marquee and sticky contact affordance, When I use primary navigation, Then they do not block completing primary navigation

## Proof

| Type | Reference |
|-------|-----------|
| Gherkin (AC) | `playwright/bdd/features/smoke/home.feature`; `playwright/bdd/features/smoke/navigation.feature`; `playwright/bdd/features/smoke/contact.feature`; `playwright/bdd/features/smoke/static-pages.feature`; `playwright/bdd/features/e2e/contact.feature` |
| Automated | `code-first/smoke/storefront-home.spec.ts`; `storefront-navigation.spec.ts`; `storefront-contact.spec.ts`; `storefront-static-pages.spec.ts`; `code-first/e2e/contact-form-submit.spec.ts` |
| Manual | **Manual_Test_Notes** in [`test-coverage.csv`](../../docs/spreadsheets/test-coverage.csv) |

## Notes

_Add demo links, staging caveats, or manual-only checks here._
