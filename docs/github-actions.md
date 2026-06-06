# GitHub Actions — Playwright on Netlify + prod API

**Workflows belong to the QA git repo only** (`qa-ci.yml` + `qa-scheduled.yml`).  
`front/`, `backend/`, and `admin/` are separate repos — they do not run this pipeline.

CI targets **Netlify storefront** + **production API**. Local dev stays on localhost.

## URLs

| Role | URL |
|------|-----|
| Storefront (CI) | `https://biomedica-test.netlify.app` |
| API | `https://api.biomedica.ma` |
| Test PDP slug | `argan-et-figue-de-barbarie-60ml` |

Configured in [`.github/workflows/qa-ci.yml`](../.github/workflows/qa-ci.yml), [`.github/workflows/qa-scheduled.yml`](../.github/workflows/qa-scheduled.yml), and [`qa.config.json`](../qa.config.json).

## What runs (QA repo only)

### QA CI (`qa-ci.yml`) — push / PR

| Job | What |
|-----|------|
| `typecheck` | Typecheck specs |
| `smoke-fr` | Smoke FR — **PR gate** |
| `publish-report` | Updates **smoke-fr** Allure; keeps EN/E2E reports via site cache |

No grey skipped jobs — graph is only these three.

### QA Scheduled (`qa-scheduled.yml`) — crons + manual

| Job | When |
|-----|------|
| `smoke-fr` + `e2e-fr` | Daily **03:00 UTC** |
| `smoke-en` | Daily **04:00 UTC** |
| `e2e-en` | Weekly **Monday 05:00 UTC** |
| `publish-report` | After each scheduled run — merges all suites (cache + new artifacts) |

**Manual:** Actions → **QA Scheduled** → **Run workflow** runs **all four** test suites.

Shared publish logic: [`.github/workflows/reusable-publish-report.yml`](../.github/workflows/reusable-publish-report.yml).

### Run the workflows

1. **Push / PR** → **QA CI** runs automatically (`typecheck` + `smoke-fr`).
2. **GitHub** → **Actions** → **QA CI** or **QA Scheduled** → **Run workflow** (branch `main`).
3. **Scheduled (UTC)** — **QA Scheduled** only:
   - **03:00 daily** — `smoke-fr` + `e2e-fr`
   - **04:00 daily** — `smoke-en`
   - **05:00 Monday** — `e2e-en`

Ensure **API CORS** allows `https://biomedica-test.netlify.app` on the Laravel backend.

### Allure trends (history)

Each suite keeps **run-over-run history** in GitHub Actions cache (`allure-with-history` action). After ~5 runs, open a report → **Graphs** / **Timeline** for pass-rate trends.

Separate history per suite: smoke-fr, smoke-en, e2e-fr, e2e-en.

## Optional overrides

QA repo → **Settings** → **Actions** → **Variables**:

| Variable | Default |
|----------|---------|
| `PLAYWRIGHT_ORIGIN` | `https://biomedica-test.netlify.app` |
| `PLAYWRIGHT_API_BASE_URL` | `https://api.biomedica.ma` |
| `PLAYWRIGHT_TEST_PRODUCT_SLUG` | `argan-et-figue-de-barbarie-60ml` |

## Branch protection (require smoke before merge)

One-time on **`biomedica-qa`** (needs repo admin):

1. **Settings** → **Rules** → **Rulesets** → **New ruleset** (or **Branches** → **Add rule** on `main`).
2. Target branch: **`main`**.
3. Enable **Require status checks to pass**.
4. After at least one green **QA CI** run, add required checks:
   - **`typecheck`**
   - **`smoke-fr`**
5. Enable **Require branches to be up to date before merging** (recommended).
6. Save.

PRs cannot merge until **smoke-fr** (and **typecheck**) pass. E2E runs only in **QA Scheduled** (never on push).

## CI performance

Chromium is cached under `~/.cache/ms-playwright` (see `.github/actions/playwright-chromium`). First run downloads browsers; later runs skip the ~280 MB download when `package-lock.json` is unchanged.

## Local vs CI

| | Local | CI |
|---|--------|-----|
| Storefront | `http://localhost:3333` | `https://biomedica-test.netlify.app` |
| API | `http://localhost:8000` | `https://api.biomedica.ma` |
| Slug | `argan-et-figue-de-barbarie` | `argan-et-figue-de-barbarie-60ml` |

### Match CI locally

```bash
# playwright/.env (inside QA repo)
PLAYWRIGHT_ORIGIN=https://biomedica-test.netlify.app
PLAYWRIGHT_API_BASE_URL=https://api.biomedica.ma
PLAYWRIGHT_TEST_PRODUCT_SLUG=argan-et-figue-de-barbarie-60ml

cd playwright
npm run test:smoke:fr
```

From monorepo checkout: same paths under `QA/playwright/`.

## Troubleshooting

| Failure | Fix |
|---------|-----|
| `ConnectTimeoutError` on storefront | Check Netlify deploy + `PLAYWRIGHT_ORIGIN` variable |
| Smoke job **Queued** forever | Old workflow used `self-hosted` — push cloud runner workflow or register a VPS runner |
| PDP OOS smoke fails / `qa-pdp-inventory` missing | Create OOS fixture in admin (slug `test-product-out-of-stock`, stock **0**, published), or set `PLAYWRIGHT_TEST_OOS_PRODUCT_SLUG` |
| API timeout in global-setup (local only) | Start Laravel or check `PLAYWRIGHT_API_BASE_URL` in `playwright/.env`. CI skips direct API preflight — smoke tests cover API via Netlify |
| Workflow not running | Push must be to the **QA** GitHub repo, not front/backend |

## Reports in GitHub (Allure)

| Job | What |
|-----|------|
| `smoke-fr` / `e2e-fr` | Run tests → generate Allure → upload **`allure-report-smoke-fr`** / **`allure-report-e2e-fr`** artifacts |
| `publish-report` | Merge reports → deploy to **GitHub Pages** (`actions/deploy-pages`) |

Playwright HTML stays **local** only: `npx playwright show-report reports/playwright-html`.

### One-time repo setup

1. **Settings → Actions → General → Workflow permissions** → **Read and write permissions** → Save.
2. **Settings → Pages** → Source: **GitHub Actions** (not “Deploy from branch”) → Save.

After the first green workflow run, open the **`publish-report`** job → **Summary** for live links.

### Report URLs

| Page | URL |
|------|-----|
| Dashboard (index) | `https://<owner>.github.io/<repo>/` |
| Smoke FR (every push) | `https://<owner>.github.io/<repo>/smoke-fr/` |
| Smoke EN (nightly) | `https://<owner>.github.io/<repo>/smoke-en/` |
| E2E FR (nightly) | `https://<owner>.github.io/<repo>/e2e-fr/` |
| E2E EN (weekly) | `https://<owner>.github.io/<repo>/e2e-en/` |

On push-only runs, **E2E** and **Smoke EN** keep the **last published** report until the next scheduled job (site cache).

### Artifacts (fallback)

| Artifact | Job | When | Contents |
|----------|-----|------|----------|
| **`allure-report-smoke-fr`** | smoke-fr | Always (if tests ran) | Allure HTML zip |
| **`allure-report-smoke-en`** | smoke-en | Weekly | Allure HTML zip |
| **`allure-report-e2e-fr`** | e2e-fr | Nightly / flag | Allure HTML zip |
| **`allure-report-e2e-en`** | e2e-en | Weekly | Allure HTML zip |
| **`test-results-smoke-fr`** / **`test-results-e2e-fr`** / **`test-results-e2e-en`** | respective job | Failure only | Screenshots, videos, traces |
| **`test-results-smoke`** / **`test-results-e2e`** | smoke / e2e | Failure only | Screenshots, videos, traces |

Allure includes failed-test screenshots, video, trace links, suite tree, environment (origin, OS, CI).

Trace / screenshot / video are kept on failure only (`playwright.config.ts`).

All generated HTML lives under **`playwright/reports/`** (gitignored):

| Subfolder | Contents |
|-----------|----------|
| `reports/allure-results/` | Raw Allure data (input for `allure generate`) |
| `reports/allure-report/` | Generated Allure HTML |
| `reports/playwright-html/` | Playwright HTML report (code-first) |
| `reports/bdd-html/` | Playwright HTML report (BDD track, local only) |
| `reports/features-gen/` | BDD generated specs (local only) |

### Local reports

```bash
cd playwright
npm run test:smoke:fr

# Playwright HTML
npx playwright show-report reports/playwright-html

# Allure
npm run report:allure

# Clean all generated reports
npm run clean:reports
```

## Failed tests — trace & video

On failure, Playwright keeps:

- **Trace** (timeline, DOM, network) — open from HTML report or `trace.zip` in `test-results/`
- **Video** (`.webm`) — in `test-results/` for the failed test
- **Screenshot** — in `test-results/`

**CI:** **`publish-report`** → GitHub Pages; **`allure-report-smoke-fr`** artifact as fallback; **`test-results-smoke-fr`** if failed.

**Local:**

```bash
cd playwright
npm run test:smoke:fr
npx playwright show-report reports/playwright-html
```

Click a failed test → **Trace** / **Video** tabs in the report.

