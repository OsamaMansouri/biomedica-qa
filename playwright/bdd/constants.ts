/**
 * Étapes où l’UI attend le backend, sans coupler le test aux URLs `/api/...`.
 * Tant que l’écran montre les bons éléments (livraisons, merci), le front peut
 * renommer ou regrouper les appels réseau.
 */
export const SLOW_UI_TIMEOUT_MS = 60_000;
