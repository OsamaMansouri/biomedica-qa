import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

function withHttpScheme(url: string): string {
  return url.includes("://") ? url : `http://${url}`;
}

function storefrontOrigin(): string {
  const origin = process.env.PLAYWRIGHT_ORIGIN?.trim();
  if (origin) {
    try {
      return new URL(withHttpScheme(origin)).origin;
    } catch {
      /* fall through */
    }
  }
  const legacy = process.env.PLAYWRIGHT_BASE_URL?.trim();
  if (legacy) {
    try {
      return new URL(legacy).origin;
    } catch {
      /* fall through */
    }
  }
  return "http://localhost:3333";
}

const origin = storefrontOrigin();

/**
 * Default 3 workers (local and CI). Same concurrency as a typical local `npm run test:ci`.
 * If staging flakes under load, set `PLAYWRIGHT_WORKERS=1` on the job or in `.env`.
 * CLI `--workers=N` wins when passed.
 */
function workerCount(): number {
  const fromEnv = Number(process.env.PLAYWRIGHT_WORKERS);
  if (Number.isFinite(fromEnv) && fromEnv >= 1) return Math.min(32, Math.floor(fromEnv));
  return 3;
}

export default defineConfig({
  testDir: "./tests",
  globalSetup: path.resolve(__dirname, "global-setup.ts"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: workerCount(),
  preserveOutput: "failures-only",
  reporter: [
    ["list"],
    ["junit", { outputFile: "junit.xml" }],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  timeout: 120_000,
  expect: { timeout: 15_000 },

  use: {
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
    headless: !!process.env.CI,
    viewport: process.env.CI
      ? { width: 1280, height: 720 }
      : { width: 1280, height: 720 },
    deviceScaleFactor: process.env.CI ? 1 : 1,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: {
      args: ["--disable-dev-shm-usage"],
    },
  },

  projects: [
    {
      name: "fr",
      use: {
        browserName: "chromium",
        baseURL: `${origin}/fr/`,
      },
    },
    {
      name: "en",
      use: {
        browserName: "chromium",
        baseURL: `${origin}/en/`,
      },
    },
  ],
});
