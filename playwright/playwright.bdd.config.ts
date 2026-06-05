import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
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

const bddTestDir = defineBddConfig({
  features: "bdd/features/**/*.feature",
  steps: "bdd/steps/**/*.ts",
  featuresRoot: "bdd",
  missingSteps: "skip-scenario",
});

export default defineConfig({
  testDir: bddTestDir,
  globalSetup: path.resolve(__dirname, "global-setup.ts"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  preserveOutput: "failures-only",
  reporter: [
    ["list"],
    ["junit", { outputFile: "junit-bdd.xml" }],
    ["html", { open: "never", outputFolder: "playwright-report-bdd" }],
  ],
  timeout: 120_000,
  expect: { timeout: 15_000 },
  use: {
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
    headless: !!process.env.CI,
    viewport: { width: 1280, height: 720 },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
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
