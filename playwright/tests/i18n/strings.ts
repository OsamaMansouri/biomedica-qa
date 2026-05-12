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
 * Shop filter E2E: `…/shop?category=ambiance` (e.g. biomedica.ma/fr/shop?category=ambiance).
 * PDP eyebrow uses `categoryDisplayName` - same label in filter sheet and above the title.
 */
export const E2E_SHOP_AMBIANCE_CATEGORY_SLUG = "ambiance";
export const E2E_SHOP_AMBIANCE_LABEL = "Ambiance";

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

/** Header `LocaleSwitcher` - `aria-label` + menuitem labels (not translated). */
export const HEADER_LOCALE = {
  languageNavAria: "Language",
  menuEnglish: "English",
  menuFrench: "Français",
} as const;

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
