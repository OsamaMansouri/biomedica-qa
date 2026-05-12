/**
 * Données invité checkout — même principe que sfcc/tests/data/guest.ts (objet statique).
 */
export const checkoutGuest = {
  firstName: "Test",
  lastName: "Playwright",
  email: "e2e.biomedica.playwright@example.com",
  phone: "0612345678",
  address: "12 Rue de la Paix",
  city: "Casablanca",
  postalCode: "20000",
  country: "Maroc",
  state: "",
} as const;
