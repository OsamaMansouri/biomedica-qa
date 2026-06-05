# Manual testing

Checks that are **not** (yet) fully covered by Playwright, or need human judgment. Run on **staging** before release unless noted.

## How to use

1. Pick the area below that matches your release scope.
2. Execute steps; note pass/fail in Jira or the smoke/e2e catalog **Notes** column.
3. Add new rows to [`spreadsheets/test-coverage.csv`](spreadsheets/test-coverage.csv) when a story is manual-only.

---

## Payments — CMI card (US-PAY-002)

**Env:** CMI sandbox credentials on staging.

| # | Step | Expected |
|---|------|----------|
| 1 | Guest checkout with card payment selected | Redirect to CMI |
| 2 | Complete payment in sandbox | Return to storefront; success state clear |
| 3 | Simulate failure / cancel | User sees failure message; can retry without loop |
| 4 | Inspect return URL | No secrets in query string |

---

## Promo codes (US-CART-003)

| # | Step | Expected |
|---|------|----------|
| 1 | Valid promo at checkout | Discount applied; order total matches admin rules |
| 2 | Invalid / expired code | Localized error; order not placed |
| 3 | Promo + free shipping edge | Totals match business rules |

---

## Admin (US-ADM-*)

**Env:** Admin app + API on staging.

| Area | Smoke steps |
|------|-------------|
| Login | Valid/invalid credentials; logout |
| Products | Create/edit product; upload image; toggle featured; change stock → verify PDP |
| Orders | Filter list; update status; open detail |
| Shipping | CRUD shipping method; verify quote on storefront checkout |

---

## i18n & content (US-I18N-001)

| # | Check |
|---|--------|
| 1 | FR and EN marketing copy reads naturally (native review if possible) |
| 2 | Currency switch on real prices — no formatting glitches |
| 3 | SEO: share PDP/article link — OG title/description sensible |

---

## Visual & responsive (US-DIS-001)

| Breakpoint | Pages to spot-check |
|------------|---------------------|
| Mobile 390px | Home, shop, PDP, cart drawer, checkout |
| Tablet 768px | Nav, magazine article |
| Desktop 1280px | Footer, sticky PDP ATC (mobile e2e covers automation path) |

---

## Post-purchase (US-POST-001)

| # | Step | Expected |
|---|------|----------|
| 1 | Place COD order (automated e2e covers UI) | Thank-you shows reference |
| 2 | Check email inbox (manual) | Confirmation email matches order reference and lines |

---

## Exploratory charter (30 min)

Use when no specific story changed but you need confidence:

- Home → shop filter → PDP → cart → checkout (abort before pay)
- Search → no results → clear search
- Magazine article → product CTA → cart
- Locale switch mid-cart
- Browser back from shop sort/filter

Log bugs in Jira; link to relevant `US-*` card.
