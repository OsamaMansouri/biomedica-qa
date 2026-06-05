# GitHub Actions — Playwright on biomedica.ma

**This workflow belongs to the QA git repo only** (`QA/.github/workflows/qa.yml`).  
`front/`, `backend/`, and `admin/` are separate repos — they do not run this pipeline.

CI targets **production** URLs. Local dev stays on localhost.

## URLs

| Role | URL |
|------|-----|
| Storefront | `https://biomedica.ma` |
| API | `https://api.biomedica.ma` |
| Test PDP slug | `argan-et-figue-de-barbarie-60ml` |

Configured in [`.github/workflows/qa.yml`](../.github/workflows/qa.yml) and [`qa.config.json`](../qa.config.json).

## What runs (QA repo only)

| Job | Runner | What |
|-----|--------|------|
| `typecheck` | GitHub cloud (`ubuntu-latest`) | Typecheck specs |
| `smoke` | **Self-hosted (VPS)** | Smoke FR on biomedica.ma |
| `e2e` | **Self-hosted (VPS)** | Only if `ENABLE_PLAYWRIGHT_E2E=true` |

### Why self-hosted?

GitHub cloud runners **cannot connect** to `biomedica.ma` (firewall/CDN → `ConnectTimeoutError`).  
Your VPS can reach the site — register it as a **self-hosted runner** for the QA repo.

## One-time: self-hosted runner on VPS

1. **GitHub** → `biomedica-qa` → **Settings** → **Actions** → **Runners** → **New self-hosted runner** → Linux.
2. On the VPS (SSH), run the commands GitHub shows (download, `./config.sh`, `./run.sh`).
3. Install once on the VPS:

```bash
# Node 20+ required; then Playwright system deps (Ubuntu/Debian)
sudo npx playwright install-deps chromium
```

4. Re-run the workflow — **smoke** should pick up the runner (label `self-hosted`).

Keep the runner as a service (systemd) so it stays online — GitHub docs link on the runner setup page.

Until the runner is registered, the **smoke** job stays **Queued**.

## Optional overrides

QA repo → **Settings** → **Actions** → **Variables**:

| Variable | Default |
|----------|---------|
| `PLAYWRIGHT_ORIGIN` | `https://biomedica.ma` |
| `PLAYWRIGHT_API_BASE_URL` | `https://api.biomedica.ma` |
| `PLAYWRIGHT_TEST_PRODUCT_SLUG` | `argan-et-figue-de-barbarie-60ml` |
| `ENABLE_PLAYWRIGHT_E2E` | off |

## Local vs CI

| | Local | CI |
|---|--------|-----|
| Storefront | `http://localhost:3333` | `https://biomedica.ma` |
| API | `http://localhost:8000` | `https://api.biomedica.ma` |
| Slug | `argan-et-figue-de-barbarie` | `argan-et-figue-de-barbarie-60ml` |

### Match CI locally

```bash
# playwright/.env (inside QA repo)
PLAYWRIGHT_ORIGIN=https://biomedica.ma
PLAYWRIGHT_API_BASE_URL=https://api.biomedica.ma
PLAYWRIGHT_TEST_PRODUCT_SLUG=argan-et-figue-de-barbarie-60ml

cd playwright
npm run test:smoke:fr
```

From monorepo checkout: same paths under `QA/playwright/`.

## Troubleshooting

| Failure | Fix |
|---------|-----|
| `ConnectTimeoutError` on biomedica.ma | Use **self-hosted runner on VPS** (see above) |
| Smoke job **Queued** forever | Register self-hosted runner on repo |
| PDP 404 | Use `-60ml` slug on prod |
| API check | `https://api.biomedica.ma/api/products?per_page=1` → 200 |
| Workflow not running | Push must be to the **QA** GitHub repo, not front/backend |

## Reports in GitHub (vs GitLab JUnit)

| | **GitLab** | **GitHub Actions** |
|---|------------|---------------------|
| JUnit in UI | Built into MR **Tests** tab | Use **`publish-unit-test-result-action`** → **Checks** tab + job **Summary** table |
| HTML / trace / video | Artifacts | Artifacts: **`playwright-report`**, **`test-results`** (on failure) |

### Where to look on GitHub

1. **PR → Checks** — click **Playwright smoke** (or **Playwright e2e**): pass/fail counts, failed test names (from `junit.xml`).
2. **Actions run → Job → Summary** — same JUnit table at the bottom of the smoke/e2e job.
3. **Artifacts** (when tests fail) — download **`playwright-report`** for HTML; **`test-results`** for trace/video files.
4. **Artifact `junit.xml`** — raw file if you need to import elsewhere.

Playwright already writes `junit.xml` (see `playwright.config.ts` reporters). The workflow publishes it to GitHub after each run.

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

**CI:** download **`playwright-report`** and **`test-results`** from the failed GitHub Actions run → open `playwright-report/index.html` (traces/videos link from the report when `test-results` is beside it).

**Local:**

```bash
cd playwright
npm run test:smoke:fr
npx playwright show-report
```

Click a failed test → **Trace** / **Video** tabs in the report.

