# QA (Biomedica)

Everything under **`QA/`** is **tests and QA process** — not the storefront or Laravel app.  
Your real apps stay where they always were: **`front/`**, **`backend/`**, **`admin/`**.

## Simple mental model

| If you want to test… | Use this folder | Technology | In one sentence |
|------------------------|-----------------|------------|-----------------|
| The **website in a browser** (click, forms, FR/EN) | **`playwright/`** | TypeScript + Playwright | A robot **opens Chrome** like a user. |
| The **HTTP JSON API** without a browser | **`api/`** | Java + Maven + REST Assured | A robot **calls URLs** (`GET /api/products`, etc.) and checks status + JSON. |
| **Rules / stories / traceability** | **`blueprint/`** + **`docs/`** | CSV, JSON, markdown | What we **promise** to cover + how the **quality gate** checks P0 work. |
| **Scripts CI runs too** | **`scripts/`** | Node (`.mjs`) | Traceability check, local “run everything” helper. |

**REST Assured** = Java library used inside **`QA/api/`**. It sends HTTP requests to your **running** Laravel API (`npm run api`). Think **Postman in code**, runnable by **`mvn test`**. It does **not** replace PHPUnit in `backend/tests/`; PHPUnit tests **from inside** PHP, REST Assured tests **from outside** over HTTP.

## Folder layout (at a glance)

```text
QA/
├── api/                      ← Java/Maven project ONLY for API HTTP tests (Postman: repo root **`api/Biomedica-API.postman_collection.json`**, regen **`node api/build-postman-collection.mjs`**)
│   ├── pom.xml               ← Maven config (Surefire runs tests)
│   └── src/test/java/        ← REST Assured: qa.api.<domain> (short; module is already QA/api)
├── playwright/               ← Node project ONLY for browser E2E
│   ├── package.json
│   ├── playwright.config.ts
│   └── tests/                ← *.spec.ts
├── scripts/                  ← quality-gate.mjs, run-ci.mjs
├── blueprint/                ← user-stories.json, traceability CSV (see qa.config.json), …
├── Jenkinsfile               ← Jenkins (simple; agent needs Node + Java + Maven)
├── docs/                     ← Jenkins how-to, spreadsheets (test catalog)
├── qa.config.json            ← paths + gate settings
├── package.json              ← npm run gate | api | e2e | …
└── README.md                 ← this file
```

Tests use **`src/test/java`** with a short package root **`qa.api`** so paths are not `com/biomedica/qa/...` on top of **`QA/api/`**.

| Path | Contents |
|------|----------|
| **`docs/`** | Jenkins how-to (`docs/cicd/`), test catalog CSV (`docs/spreadsheets/`) |
| **`playwright/`** | E2E tests (storefront, i18n projects `fr` / `en`) |
| **`api/`** | REST Assured (Java) — HTTP checks against Laravel |
| **`scripts/`** | `quality-gate.mjs` (P0 traceability), `run-ci.mjs` (local CI parity) |
| **`blueprint/`** | `user-stories.json`, traceability matrix CSV (`qa.config.json` → `paths.traceabilityCsv`) |
| **`docs/spreadsheets/`** | `test-catalog.csv` (cahier / execution sign-off) |
| **`qa.config.json`** | Single QA config (paths, gate rules, CI pointers) |

**Run from repo root:** `npm run qa:gate` · `npm run qa:api` · `npm run qa:e2e` / `npm run qa:smoke` (fr+en par défaut) · `npm run qa:e2e:fr` / `npm run qa:smoke:fr` (fr seul) · `npm run qa:ci:local` (needs API + storefront up for full run).

**Playwright `ERR_CONNECTION_REFUSED` on `localhost:3333`:** start the storefront first (`npm run dev` from repo root, or `cd front` then `npm run dev`), then rerun smoke/E2E.

**Extension Playwright OK but `npm run qa:e2e` flaky (especially one locale):** the CLI run executes **both FR and EN** with more parallelism than a typical VS Code run; see `QA/playwright/README.md` → *Extension VS Code vs npm* and optional `PLAYWRIGHT_WORKERS` in `QA/playwright/.env.example`.

GitHub Actions: [`.github/workflows/qa.yml`](../.github/workflows/qa.yml).

Jenkins: [`Jenkinsfile`](Jenkinsfile) · [how-to](docs/cicd/Jenkins.md). Test catalog: [`docs/spreadsheets/README.md`](docs/spreadsheets/README.md).
