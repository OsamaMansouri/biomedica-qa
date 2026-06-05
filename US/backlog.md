# Backlog board

_Living view — update **Status** and **Jira** on each card when something moves._

| ID | Epic | Title | P | Status | Jira | Gherkin | Code-first |
|----|------|-------|---|--------|------|---------|------------|
| [US-DIS-001](stories/US-DIS-001.md) | Discovery | View localized home and navigation | P0 | 🟢 Ready | BIOM-___ | smoke/home, navigation | smoke/home, navigation |
| [US-DIS-002](stories/US-DIS-002.md) | Discovery | Browse shop and category listings | P0 | 🟢 Ready | BIOM-___ | smoke/e2e shop | smoke/shop, e2e/shop-* |
| [US-DIS-003](stories/US-DIS-003.md) | Discovery | Open product detail from slug | P0 | 🟢 Ready | BIOM-___ | smoke/e2e pdp | smoke/pdp, e2e/pdp-* |
| [US-DIS-004](stories/US-DIS-004.md) | Discovery | Search and sort catalog | P1 | 🟢 Ready | BIOM-___ | search, shop | search, shop-sort |
| [US-CART-001](stories/US-CART-001.md) | Cart | Add line to cart from PDP | P0 | 🟢 Ready | BIOM-___ | cart | add-to-cart, cart-* |
| [US-CART-002](stories/US-CART-002.md) | Cart | Guest checkout shipping quote | P0 | 🟢 Ready | BIOM-___ | checkout | checkout-*, order-cod |
| [US-CART-003](stories/US-CART-003.md) | Cart | Promo code | P1 | ⚪ Backlog | BIOM-___ | — | manual / future |
| [US-PAY-001](stories/US-PAY-001.md) | Pay | Cash on delivery order | P0 | 🟢 Ready | BIOM-___ | e2e/checkout | order-cod-free-shipping |
| [US-PAY-002](stories/US-PAY-002.md) | Pay | CMI card flow | P0 | 🟡 Partial | BIOM-___ | — | manual CMI sandbox |
| [US-POST-001](stories/US-POST-001.md) | Post | Thank you page reference | P0 | 🟢 Ready | BIOM-___ | checkout | order-cod (thank-you) |
| [US-I18N-001](stories/US-I18N-001.md) | i18n | FR/EN storefront | P0 | 🟢 Ready | BIOM-___ | locale, currency, seo | locale/currency/seo e2e |
| [US-I18N-002](stories/US-I18N-002.md) | i18n | Brand from API | P1 | 🟡 Partial | BIOM-___ | — | API BrandGetTest |
| [US-API-001](stories/US-API-001.md) | API | Products list contract | P0 | 🟢 Ready | BIOM-___ | — | ProductsListGetTest |
| [US-API-002](stories/US-API-002.md) | API | Checkout validation | P0 | 🟢 Ready | BIOM-___ | — | CheckoutPostValidationTest |
| [US-API-003](stories/US-API-003.md) | API | Contact intake | P2 | 🟢 Ready | BIOM-___ | contact | contact smoke/e2e |
| [US-ADM-001](stories/US-ADM-001.md) | Admin | Admin authenticates | P0 | 🟢 Ready | BIOM-___ | — | AdminLoginPostTest |
| [US-ADM-002](stories/US-ADM-002.md) | Admin | Products and stock | P0 | 🟡 Partial | BIOM-___ | — | admin API only |
| [US-ADM-003](stories/US-ADM-003.md) | Admin | Operate orders | P1 | ⚪ Backlog | BIOM-___ | — | admin API |
| [US-ADM-004](stories/US-ADM-004.md) | Admin | Shipping and settings | P1 | ⚪ Backlog | BIOM-___ | — | admin API |
| [US-QA-001](stories/US-QA-001.md) | Quality | CI pipeline | P0 | 🟢 Ready | BIOM-___ | — | qa.yml |
| [US-QA-002](stories/US-QA-002.md) | Quality | Test coverage map | P1 | 🟢 Ready | BIOM-___ | — | test-coverage.csv |
| [US-QA-003](stories/US-QA-003.md) | Quality | Staging parity | P1 | 🟡 Partial | BIOM-___ | — | env docs |

**Legend:** 🟢 Ready · 🟡 Partial (manual or API-only gap) · ⚪ Backlog
