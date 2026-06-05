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
  let homeRes: Response;
  try {
    homeRes = await fetch(home, { signal: AbortSignal.timeout(30_000) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const hint = process.env.CI
      ? "Check Netlify deploy and PLAYWRIGHT_ORIGIN repository variable."
      : "Start the storefront or set PLAYWRIGHT_ORIGIN in playwright/.env.";
    throw new Error(`[global-setup] Storefront fetch failed: ${home} — ${msg}. ${hint}`);
  }
  if (!homeRes.ok) {
    throw new Error(
      `[global-setup] Storefront unreachable (${homeRes.status}): ${home}. ` +
        (process.env.CI
          ? "Set repository variable PLAYWRIGHT_ORIGIN to your staging URL (https://…, no /fr suffix). See QA/docs/github-actions.md."
          : "Start the storefront (`npm run dev` in front/) or set PLAYWRIGHT_ORIGIN in QA/playwright/.env."),
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
      `[global-setup] API unreachable (${res.status}): ${url}. ` +
        (process.env.CI
          ? "Set PLAYWRIGHT_API_BASE_URL repository variable. See QA/docs/github-actions.md."
          : "Start Laravel or unset PLAYWRIGHT_API_BASE_URL in .env."),
    );
  }
}
