# QA (Biomedica)

**Standalone git repository** — tests and QA docs only. Not bundled with `front/`, `backend/`, or `admin/` CI.

Tests target the live storefront via Playwright; each app repo keeps its own git and pipelines.

## Model

| What | Where | CI |
|------|--------|-----|
| **Automated E2E** | `playwright/code-first/` | CI smoke on **biomedica.ma** every PR |
| **Manual checks** | `test-coverage.csv` + smoke/e2e catalogs | QA sign-off on staging |
| **Acceptance criteria** | `playwright/bdd/features/` + Jira | Not executed in CI |
| **User stories** | `US/stories/` | Pair cards (PO title + QA proof) |

**PO:** story title in Jira. **QA:** AC, Playwright automation, manual steps where needed.

## Layout

```text
QA/
├── US/                  ← Pair backlog
├── docs/
│   ├── qa-process.md
│   └── spreadsheets/    ← test-coverage, smoke/e2e catalogs
├── playwright/
│   ├── code-first/      ← automation (smoke + e2e)
│   └── bdd/features/    ← Gherkin AC catalog
├── run-ci.mjs           ← local: typecheck + smoke FR
├── qa.config.json
└── package.json
```

## Commands (repo root)

| Command | Purpose |
|---------|---------|
| `npm run qa:smoke:fr` | **Main PR gate** — fast automated smoke |
| `npm run qa:e2e:fr` | Deeper automated flows |
| `npm run qa:typecheck` | Typecheck Playwright specs |
| `npm run qa:ci:local` | typecheck + smoke (storefront must be up) |

**Prerequisites:** storefront on **3333** (`npm run dev` in `front/`). API needed for catalog/checkout tests.

**Docs:** [`docs/qa-process.md`](docs/qa-process.md) · [`docs/github-actions.md`](docs/github-actions.md) · CI: [`qa-ci.yml`](.github/workflows/qa-ci.yml) · Nightly: [`qa-nightly.yml`](.github/workflows/qa-nightly.yml).
