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
| `e2e` | GitHub cloud (`ubuntu-latest`) | Only if `ENABLE_PLAYWRIGHT_E2E=true` |

### Run the workflow

1. **GitHub** → `biomedica-qa` → **Actions** → **QA** → **Run workflow** (branch `main`).
2. Or **push** any commit to `main` / open a PR — workflow runs automatically.
3. If a run is stuck on **“Waiting for a runner”** with label `self-hosted`, **Cancel** it and push the updated workflow (cloud runners).

Ensure **API CORS** allows `https://biomedica-test.netlify.app` on the Laravel backend.

## Optional overrides

QA repo → **Settings** → **Actions** → **Variables**:

| Variable | Default |
|----------|---------|
| `PLAYWRIGHT_ORIGIN` | `https://biomedica-test.netlify.app` |
| `PLAYWRIGHT_API_BASE_URL` | `https://api.biomedica.ma` |
| `PLAYWRIGHT_TEST_PRODUCT_SLUG` | `argan-et-figue-de-barbarie-60ml` |
| `ENABLE_PLAYWRIGHT_E2E` | off |

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
| API check | `https://api.biomedica.ma/api/products?per_page=1` → 200 |
| Workflow not running | Push must be to the **QA** GitHub repo, not front/backend |

## Reports in GitHub

| Artifact | When | Contents |
|----------|------|----------|
| **`playwright-report`** | Always | HTML report (smoke; smoke + E2E if e2e job ran) |
| **`test-results`** | Failure only | Screenshots, videos, traces |

**Actions run → Artifacts** → **`playwright-report`** → unzip → **`index.html`**.

Trace / screenshot / video are kept on failure only (`playwright.config.ts`).

### Local (same as always)

```bash
cd playwright
npx playwright show-report
```

## Failed tests — trace & video

On failure, Playwright keeps:

- **Trace** (timeline, DOM, network) — open from HTML report or `trace.zip` in `test-results/`
- **Video** (`.webm`) — in `test-results/` for the failed test
- **Screenshot** — in `test-results/`

**CI:** **`playwright-report`** (always) + **`test-results`** (if failed).

**Local:**

```bash
cd playwright
npm run test:smoke:fr
npx playwright show-report
```

Click a failed test → **Trace** / **Video** tabs in the report.

