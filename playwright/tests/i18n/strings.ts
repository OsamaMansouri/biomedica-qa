import type { TestInfo } from "@playwright/test";

import { localeFromProject, type Locale } from "./locale";

/**
 * Default PDP slug (smoke + E2E). Matches catalog export / typical API (`argan-et-figue-de-barbarie`).
 * Production URL may use `argan-et-figue-de-barbarie-60ml` - override with `PLAYWRIGHT_TEST_PRODUCT_SLUG` if needed.
 */
export const STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG = "argan-et-figue-de-barbarie";

/**
 * Header-search E2E: typed substring (catalog / API hits e.g.
 * `baume-cremeux-a-base-dargan-et-chocolat` in `front/_products_export.json`).
 */
export const E2E_HEADER_SEARCH_QUERY = "Baume crémeux à base";

/**
 * Shop filter E2E: `…/shop?category=bain` (e.g. /fr/shop?category=bain, /en/shop?category=bain).
 * PDP category above title is a link to `/shop?category=bain` with localized label (Bain / Bath).
 */
export const E2E_SHOP_BAIN_CATEGORY_SLUG = "bain";

const E2E_SHOP_BAIN_LABEL = { fr: "Bain", en: "Bath" } as const;

export function e2eShopBainCategoryLabel(locale: Locale): string {
  return locale === "en" ? E2E_SHOP_BAIN_LABEL.en : E2E_SHOP_BAIN_LABEL.fr;
}

/**
 * FR/EN strings Playwright asserts on - duplicated from `front/messages` so tests
 * match the shopper UI. One place: smoke (`smoke()`), E2E checkout / cart / contact below.
 */

/** FR/EN UI labels for smoke specs - same text as `front/messages`. */
export type Smoke = {
  mainNav: string;
  navHome: string;
  navProducts: string;
  navCart: string;
  navSearch: string;
  cartSheetTitle: string;
  cartEmpty: string;
  checkoutTitle: string;
  emptyCheckoutLine: string;
  continueShopping: string;
  contactFormHeading: string;
  searchSheetTitle: string;
  searchPlaceholder: string;
  faqHeroTitle: string;
  coupDeCoeurHeroTitle: string;
  privacyHeroTitle: string;
};

const smokeEn: Smoke = {
  mainNav: "Primary navigation",
  navHome: "Home",
  navProducts: "Products",
  navCart: "Cart",
  navSearch: "Search",
  cartSheetTitle: "Your cart",
  cartEmpty: "Your cart is empty.",
  checkoutTitle: "Secure checkout",
  emptyCheckoutLine: "Your cart is empty. Add products before checkout.",
  continueShopping: "Continue shopping",
  contactFormHeading: "We're listening",
  searchSheetTitle: "Search",
  searchPlaceholder: "Search products",
  faqHeroTitle: "Frequently asked questions",
  coupDeCoeurHeroTitle: "Staff picks",
  privacyHeroTitle: "Privacy Policy",
};

const smokeFr: Smoke = {
  mainNav: "Navigation principale",
  navHome: "Accueil",
  navProducts: "Produits",
  navCart: "Panier",
  navSearch: "Recherche",
  cartSheetTitle: "Votre panier",
  cartEmpty: "Votre panier est vide.",
  checkoutTitle: "Paiement sécurisé",
  emptyCheckoutLine: "Votre panier est vide",
  continueShopping: "Continuer les achats",
  contactFormHeading: "Parlez-nous",
  searchSheetTitle: "Recherche",
  searchPlaceholder: "Rechercher des produits",
  faqHeroTitle: "Questions fréquentes",
  coupDeCoeurHeroTitle: "Coup de cœur",
  privacyHeroTitle: "Politique de confidentialité",
};

export function smoke(testInfo: TestInfo): Smoke {
  return localeFromProject(testInfo) === "en" ? smokeEn : smokeFr;
}

/** Default section hub slug (`MagazinePostsSeeder`: Gel douche & corps). */
export const SMOKE_MAGAZINE_SECTION_SLUG = "gel-douche-corps";

const SMOKE_MAGAZINE_ARTICLE_SLUG = {
  fr: "choisir-gel-douche-selon-votre-peau",
  en: "how-to-choose-shower-gel-for-your-skin",
} as const;

export function smokeMagazineArticleSlug(testInfo: TestInfo): string {
  const override = process.env.PLAYWRIGHT_TEST_MAGAZINE_ARTICLE_SLUG?.trim();
  if (override) return override;
  return localeFromProject(testInfo) === "en"
    ? SMOKE_MAGAZINE_ARTICLE_SLUG.en
    : SMOKE_MAGAZINE_ARTICLE_SLUG.fr;
}

export function smokeMagazineSectionSlug(): string {
  return (
    process.env.PLAYWRIGHT_TEST_MAGAZINE_SECTION_SLUG?.trim() ||
    SMOKE_MAGAZINE_SECTION_SLUG
  );
}

/** FR/EN magazine UI strings for smoke specs (`Magazine` in front/messages). */
export type MagazineSmoke = {
  listingTitle: string;
  sectionLabel: string;
  articleTitle: string;
  topicsIndexTitle: string;
};

const magazineSmokeEn: MagazineSmoke = {
  listingTitle: "Guides, rituals & advice",
  sectionLabel: "Gel douche & corps",
  articleTitle: "How to choose a shower gel for your skin type",
  topicsIndexTitle: "All topics",
};

const magazineSmokeFr: MagazineSmoke = {
  listingTitle: "Guides, rituels et conseils",
  sectionLabel: "Gel douche & corps",
  articleTitle: "Comment choisir un gel douche selon votre peau",
  topicsIndexTitle: "Tous les thèmes",
};

export function magazineSmoke(testInfo: TestInfo): MagazineSmoke {
  return localeFromProject(testInfo) === "en" ? magazineSmokeEn : magazineSmokeFr;
}

/** Header `LocaleSwitcher` menuitem labels (API/admin names, not UI locale). */
export const HEADER_LOCALE = {
  menuEnglish: "English",
  menuFrench: "Français",
} as const;

/** `Nav.languageAria` on `LocaleSwitcher` for the active storefront locale. */
export function languageNavAriaForLocale(locale: Locale): string {
  return locale === "en" ? "Language" : "Langue";
}

/** Desktop nav “Products” link text after switching to `targetLocale` (`Nav` in messages). */
export function navProductsLabelForLocale(targetLocale: Locale): string {
  return targetLocale === "en" ? smokeEn.navProducts : smokeFr.navProducts;
}

/** Primary nav landmark `aria-label` for `targetLocale` (`Nav.mainNav` in messages). */
export function mainNavAriaLabel(targetLocale: Locale): string {
  return targetLocale === "en" ? smokeEn.mainNav : smokeFr.mainNav;
}

// --- E2E: checkout (thank-you + placeholders) - `Cart` in messages ---

export type CheckoutStrings = {
  thankYouTitle: string;
  thankYouLead: string;
  placeholders: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    city: string;
    postalCode: string;
  };
};

const checkoutFr: CheckoutStrings = {
  thankYouTitle: "Paiement confirmé",
  thankYouLead: "Votre commande est confirmée. Nous la préparons maintenant.",
  placeholders: {
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse e-mail",
    phone: "Numéro de téléphone",
    address: "Adresse",
    country: "Pays",
    city: "Ville",
    postalCode: "Code postal",
  },
};

const checkoutEn: CheckoutStrings = {
  thankYouTitle: "Checkout successful",
  thankYouLead: "Your order is confirmed. We\u2019re preparing it now.",
  placeholders: {
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    phone: "Phone number",
    address: "Address",
    country: "Country",
    city: "City",
    postalCode: "Postal code",
  },
};

export function checkoutStrings(locale: Locale): CheckoutStrings {
  return locale === "en" ? checkoutEn : checkoutFr;
}

// --- E2E: cart drawer (qty + remove) - `Cart` in messages ---

export type CartDrawerStrings = {
  increase: string;
  decrease: string;
  remove: string;
  empty: string;
};

const cartDrawerFr: CartDrawerStrings = {
  increase: "Augmenter la quantité",
  decrease: "Diminuer la quantité",
  remove: "Retirer l’article",
  empty: "Votre panier est vide.",
};

const cartDrawerEn: CartDrawerStrings = {
  increase: "Increase quantity",
  decrease: "Decrease quantity",
  remove: "Remove item",
  empty: "Your cart is empty.",
};

export function cartDrawerStrings(locale: Locale): CartDrawerStrings {
  return locale === "en" ? cartDrawerEn : cartDrawerFr;
}

// --- E2E: contact form - `Contact` in messages ---

export type ContactFormStrings = {
  submit: string;
  successTitle: string;
};

const contactFormFr: ContactFormStrings = {
  submit: "Envoyer",
  successTitle: "Message bien reçu",
};

const contactFormEn: ContactFormStrings = {
  submit: "Send",
  successTitle: "Thanks - we got your message",
};

export function contactFormStrings(locale: Locale): ContactFormStrings {
  return locale === "en" ? contactFormEn : contactFormFr;
}

// --- E2E / smoke helpers: shop toolbar + filter sheet - `Shop` in messages ---

export type ShopUiStrings = {
  showFilters: string;
  /** Filter sheet title + `nav` aria-label (`Shop.browseBy`). */
  browseBy: string;
  /** `Shop.categoriesAll` - top of category list in filter sheet. */
  categoriesAll: string;
};

const shopUiFr: ShopUiStrings = {
  showFilters: "Afficher les filtres",
  browseBy: "Parcourir par",
  categoriesAll: "Tout",
};

const shopUiEn: ShopUiStrings = {
  showFilters: "Show filters",
  browseBy: "Browse by",
  categoriesAll: "All",
};

export function shopUiStrings(locale: Locale): ShopUiStrings {
  return locale === "en" ? shopUiEn : shopUiFr;
}
