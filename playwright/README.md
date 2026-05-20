# Playwright E2E (`QA/playwright/`)

Structure calquée sur `C:\xampp\htdocs\QA\sfcc`, avec **FR + EN** en parallèle propre.

| sfcc | Ici |
|------|-----|
| `playwright.config.ts` | Projets **`fr`** / **`en`** (`baseURL` = `…/fr/` et `…/en/`) |
| `global-setup.ts` | Vérif API optionnelle |
| `tests/e2e/*.spec.ts` | Parcours long (ex. `order-cod-free-shipping.spec.ts`, `search-and-shop-to-cart.spec.ts`, `shop-filter-to-cart.spec.ts`, `locale-switch.spec.ts`, `currency-switch.spec.ts`) |
| `tests/smoke/*.spec.ts` | Fumée : accueil, nav desktop, boutique, PDP, panier vide, recherche, contact, checkout vide, pages FAQ / coup de cœur / confidentialité, ATC → tiroir — `npm run test:smoke` |
| `tests/data/checkoutGuest.ts` | Données invité (indépendantes de la langue) |
| `tests/i18n/locale.ts` | `Locale` + `localeFromProject(testInfo)` (projet `fr` / `en`) |
| `tests/i18n/strings.ts` | Fumée `smoke()`, E2E `checkoutStrings` / `cartDrawerStrings` / `contactFormStrings` / `shopUiStrings`, slug PDP — alignés `front/messages` |
| `tests/utils/openApp.ts` | `openStorefrontHome` → `page.goto(".")` sur le `baseURL` du projet |

**`tests/i18n/`** = **`locale`** (projet → `fr` / `en`) et **`strings`** (tous les textes attendus : fumée + E2E checkout / panier / contact + slug PDP).

## Hooks `data-testid` (contrat dev ↔ QA)

Préfixe **`qa-`** sur le parcours commande (voir `checkout-client`, `cart-drawer`, `add-to-cart-button`, `thank-you-client`) + en-tête **`qa-locale-switcher`**, **`qa-header-currency`**. Les specs **ne cherchent pas** les libellés traduits pour ces étapes : pas de doublon i18n dans les tests, et les textes peuvent bouger sans casser Playwright.

## Prérequis

1. **Backend** Laravel, API joignable depuis le front.
2. **Front** Next (`front/`, port **3333** par défaut).
3. **`.env`** : au minimum `PLAYWRIGHT_ORIGIN` (voir `.env.example`). Slug PDP par défaut **`argan-et-figue-de-barbarie`** (même fiche que sur [biomedica.ma](https://biomedica.ma/fr/product/argan-et-figue-de-barbarie-60ml) ; l’URL publique peut suffixer `-60ml` — ajuster `PLAYWRIGHT_TEST_PRODUCT_SLUG` si votre API utilise ce slug exact).

## Installation

```bash
cd QA/playwright
npm install
npx playwright install chromium
```

## Lancer les tests

Depuis la racine du repo : **`npm run qa:e2e`** et **`npm run qa:smoke`** exécutent **fr + en** (les deux projets du `playwright.config.ts`). Pour **fr seulement** : **`npm run qa:e2e:fr`** / **`npm run qa:smoke:fr`**.

### Extension VS Code vs `npm run qa:e2e`

Souvent l’extension ne lance qu’**un projet** (FR ou EN selon le réglage) ou **un fichier** — tout passe. **`npm run qa:e2e`** enchaîne **tous les specs × les deux locales** en parallèle (plusieurs navigateurs) contre **le même** `next dev` + API : surcharge → timeouts aléatoires sur une langue ou l’autre, pas un « bug i18n » mystérieux.

Défaut **1 worker** (local et CI) — voir `playwright.config.ts` (évite de saturer un seul `next dev`). Pour aller plus vite sur une grosse machine : **`PLAYWRIGHT_WORKERS=2`** dans `.env`. Une seule locale : **`npm run qa:e2e:fr`**.

```bash
cd QA/playwright
npm test
npm run test:ui
npm run test:headed
# une seule locale (sans toucher au config)
npx playwright test --project=fr
npx playwright test --project=en
```

## Timeouts

- Globaux : `playwright.config.ts` (`expect`, `actionTimeout`, `navigationTimeout`, durée du test).
- Étapes lentes côté UI : `tests/constants.ts` → `SLOW_UI_TIMEOUT_MS`.

## Suite « commande COD »

Un scénario : accueil → PDP → panier → checkout → livraison → paiement → merci. Textes attendus : `checkoutStrings(locale)` dans `tests/i18n/strings.ts` (alignés sur `Cart` dans `front/messages`).
