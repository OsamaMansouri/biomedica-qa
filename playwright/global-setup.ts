import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * Même idée que sfcc/global-setup.ts : préparation avant les workers.
 * Ici : vérif optionnelle que l’API répond (évite des suites vides si Laravel est down).
 */
export default async function globalSetup(): Promise<void> {
  if (process.argv.some((a) => a === "--list" || a.startsWith("--list="))) {
    return;
  }
  const api = process.env.PLAYWRIGHT_API_BASE_URL?.trim();
  if (!api) {
    return;
  }
  const url = `${api.replace(/\/$/, "")}/api/products?per_page=1`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) {
    throw new Error(
      `[global-setup] API injoignable (${res.status}) : ${url}. Lance le backend ou désactive PLAYWRIGHT_API_BASE_URL.`
    );
  }
}
