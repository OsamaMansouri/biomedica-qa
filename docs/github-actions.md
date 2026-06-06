# GitHub Actions — Playwright on Netlify + prod API

**This workflow belongs to the QA git repo only** (`QA/.github/workflows/qa.yml`).  
`front/`, `backend/`, and `admin/` are separate repos — they do not run this pipeline.

CI targets **Netlify storefront** + **production API**. Local dev stays on localhost.

## URLs

| Role | URL |
|------|-----|
| Storefront (CI) | `https://biomedica-test.netlify.app` |
| API | `https://api.biomedica.ma` |
| Test PDP slug | `argan-et-figue-de-barbarie-60ml` |

Configured in [`.github/workflows/qa.yml`](../.github/workflows/qa.yml) and [`qa.config.json`](../qa.config.json).

## What runs (QA repo only)

| Job | Runner | What |
|-----|--------|------|
| `typecheck` | GitHub cloud (`ubuntu-latest`) | Typecheck specs |
| `smoke` | GitHub cloud (`ubuntu-latest`) | Smoke FR on Netlify |
| `e2e` | GitHub cloud (`ubuntu-latest`) | If `ENABLE_PLAYWRIGHT_E2E=true` **or** nightly schedule (03:00 UTC) |

### Run the workflow

1. **GitHub** → `biomedica-qa` → **Actions** → **QA** → **Run workflow** (branch `main`).
2. Or **push** any commit to `main` / open a PR — workflow runs automatically.
3. **Nightly** — full E2E runs at **03:00 UTC** without setting `ENABLE_PLAYWRIGHT_E2E`.

Ensure **API CORS** allows `https://biomedica-test.netlify.app` on the Laravel backend.

## Optional overrides

QA repo → **Settings** → **Actions** → **Variables**:

| Variable | Default |
|----------|---------|
| `PLAYWRIGHT_ORIGIN` | `https://biomedica-test.netlify.app` |
| `PLAYWRIGHT_API_BASE_URL` | `https://api.biomedica.ma` |
| `PLAYWRIGHT_TEST_PRODUCT_SLUG` | `argan-et-figue-de-barbarie-60ml` |
| `ENABLE_PLAYWRIGHT_E2E` | off (use nightly schedule, or set `true` for E2E on every push) |

## Branch protection (require smoke before merge)

One-time on **`biomedica-qa`** (needs repo admin):

1. **Settings** → **Rules** → **Rulesets** → **New ruleset** (or **Branches** → **Add rule** on `main`).
2. Target branch: **`main`**.
3. Enable **Require status checks to pass**.
4. After at least one green **QA** workflow run, add required checks:
   - **`typecheck`**
   - **`smoke`**
5. Enable **Require branches to be up to date before merging** (recommended).
6. Save.

PRs cannot merge until **smoke** (and **typecheck**) pass. E2E stays optional on PRs unless you set `ENABLE_PLAYWRIGHT_E2E=true`.

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

## Reports in GitHub

| Artifact | Job | When | Contents |
|----------|-----|------|----------|
| **`playwright-report-smoke`** / **`playwright-report-e2e`** | smoke / e2e | Always | Playwright HTML report |
| **`allure-report-smoke`** / **`allure-report-e2e`** | smoke / e2e | Always | Allure HTML (history, categories, attachments) |
| **`test-results-smoke`** / **`test-results-e2e`** | smoke / e2e | Failure only | Screenshots, videos, traces |

**Playwright HTML:** unzip → open **`index.html`**.

**Allure:** unzip **`allure-report-smoke`** (or `-e2e`) → open **`index.html`**.  
Allure includes failed-test screenshots, video, trace links, suite tree, environment (origin, OS, CI).

Trace / screenshot / video are kept on failure only (`playwright.config.ts`).

### Local reports

```bash
cd playwright
npm run test:smoke:fr

# Playwright HTML
npx playwright show-report

# Allure
npm run report:allure
```

## Failed tests — trace & video

On failure, Playwright keeps:

- **Trace** (timeline, DOM, network) — open from HTML report or `trace.zip` in `test-results/`
- **Video** (`.webm`) — in `test-results/` for the failed test
- **Screenshot** — in `test-results/`

**CI:** **`playwright-report-smoke`** + **`allure-report-smoke`** (always); **`test-results-smoke`** (if failed).

**Local:**

```bash
cd playwright
npm run test:smoke:fr
npx playwright show-report
```

Click a failed test → **Trace** / **Video** tabs in the report.

