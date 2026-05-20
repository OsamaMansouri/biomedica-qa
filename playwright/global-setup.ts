import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * Même idée que sfcc/global-setup.ts : préparation avant les workers.
 * Ici : vérif optionnelle que l’API répond (évite des suites vides si Laravel est down).
 */
function storefrontOrigin(): string {
  const raw =
    process.env.PLAYWRIGHT_ORIGIN?.trim() ||
    process.env.PLAYWRIGHT_BASE_URL?.trim() ||
    "http://localhost:3333";
  return raw.includes("://") ? new URL(raw).origin : new URL(`http://${raw}`).origin;
}

export default async function globalSetup(): Promise<void> {
  if (process.argv.some((a) => a === "--list" || a.startsWith("--list="))) {
    return;
  }

  const home = `${storefrontOrigin()}/fr/`;
  const homeRes = await fetch(home, { signal: AbortSignal.timeout(30_000) });
  if (!homeRes.ok) {
    throw new Error(
      `[global-setup] Storefront injoignable (${homeRes.status}) : ${home}. Lance \`next dev\` sur le front (port 3333).`,
    );
  }

  const api = process.env.PLAYWRIGHT_API_BASE_URL?.trim();
  if (!api) {
    return;
  }
  const url = `${api.replace(/\/$/, "")}/api/products?per_page=1`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) {
    throw new Error(
      `[global-setup] API injoignable (${res.status}) : ${url}. Lance le backend ou désactive PLAYWRIGHT_API_BASE_URL.`,
    );
  }
}
