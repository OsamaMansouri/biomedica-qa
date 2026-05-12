# Blueprint (stories + traceability)

## Files

| File | Purpose |
|------|---------|
| `user-stories.json` | **What** we want: epics, story IDs, acceptance criteria, P0/P1/P2. (`meta.formatVersion` 2 + `acceptanceCriteriaStyle`: each AC line uses **Given … When … Then …**.) |
| Traceability CSV | **Proof**: each story row points to Playwright paths and/or Java test classes. Exact filename is **`qa.config.json` → `paths.traceabilityCsv`**. |
| Test cahier | **`QA/docs/spreadsheets/test-catalog.csv`** — one row per automated case (E2E smoke API) + manual rows; **Run_Command**; fill **Exec_OK**, **Exec_Date**, **Executor** for sign-off. (Not under `blueprint/` — single file to avoid duplicate.) |

They are **not** executable. Tests live in `QA/playwright/` and `QA/api/`.

## CSV columns (one row = one story)

1. **Story_ID** — Same id as in `user-stories.json` (e.g. `US-DIS-001`).
2. **Epic** — Short epic code from JSON.
3. **Title** — Human title (kept in sync with JSON when you change scope).
4. **Priority** — `P0` = release-critical for this repo’s gate.
5. **Gherkin_Tags** — Optional tags if you later wire Cucumber; often empty.
6. **Playwright_Ref** — Paths under `QA/playwright/tests/` (several entries separated by `;`). “Playwright projects fr+en” means the same spec runs twice via `playwright.config.ts`.
7. **API_REST_Assured_Ref** — Java class names under `QA/api/src/test/java/qa/api/...` or short route notes where no class exists yet.
8. **Manual_Only_Notes** — Exploratory, sandbox-only, or not automated; satisfies the gate **together with** cols 6–7 for P0.

## Quality gate (`npm run qa:gate`)

Only checks **P0** rows: each must have **at least one** of Playwright_Ref, API_REST_Assured_Ref, or Manual_Only_Notes non-empty. P1/P2 can be thin; fix them when you promote priority.

## “Do we cover everything we built?”

The matrix tracks **user stories**, not every file in the repo. If you add a **new spec** that proves a **new or changed story**, add/update the story in JSON and add a **cell** in this CSV. If you add a spec that is **only extra regression** for an existing story, extend that story’s Playwright_Ref cell (semicolon-separated).

### Playwright specs today (inventory)

- **E2E:** `contact-form-submit`, `locale-switch`, `currency-switch`, `shop-filter-to-cart`, `search-and-shop-to-cart`, `cart-qty-and-remove`, `order-cod-free-shipping`
- **Smoke:** `storefront-home`, `storefront-navigation`, `storefront-shop`, `storefront-pdp`, `storefront-search`, `storefront-add-to-cart-drawer`, `storefront-cart-drawer`, `storefront-checkout-empty`, `storefront-contact`, `storefront-static-pages`

`storefront-cart-drawer`, `storefront-checkout-empty`, and `storefront-static-pages` are not named on their own rows yet; they support discovery/checkout/static content — add them to the closest story row when you want an explicit pointer.

### REST Assured classes today (inventory)

`AdminLoginPostTest`, `BrandGetTest`, `CategoriesTreeGetTest`, `CategoryProductsGetTest`, `CheckoutPostValidationTest`, `CmiCallbackGetTest`, `ContactPostValidationTest`, `OrderConfirmationGetTest`, `ProductBySlugGetTest`, `ProductsListGetTest`, `ShippingQuotePostTest` (+ `HttpBase`).

---

When in doubt: **story first** → one CSV row → point to the **smallest set of tests** that prove acceptance criteria.
