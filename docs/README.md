# Global QA hub (Biomedica)

Single entry for **strategy**, **BDD**, **reporting**, **templates**, and **API checks**. Jenkins lives next to tests: **`QA/jenkins/Jenkinsfile`**.

| Topic | Location |
|--------|-----------|
| Jenkins | [`cicd/Jenkins.md`](cicd/Jenkins.md), [`../jenkins/Jenkinsfile`](../jenkins/Jenkinsfile) |
| Reporting | [`reporting.md`](reporting.md) |
| BDD / Gherkin | [`bdd/README.md`](bdd/README.md), features under [`bdd/features/`](bdd/features/) |
| REST Assured (API) | [`../api/`](../api/) |
| E2E (Playwright) | [`../playwright/`](../playwright/) |
| VPS deploy (human runbook) | [`../../VPS_DEPLOY_PLAYBOOK.md`](../../VPS_DEPLOY_PLAYBOOK.md) |
| Spreadsheets (Excel / CSV) | [`spreadsheets/`](spreadsheets/) |
| Templates (bugs, cases, stories) | [`templates/`](templates/) |

## Blueprint vs docs vs automation (who owns what)

| Deliverable | Role | When you touch it |
|-------------|------|-------------------|
| [`blueprint/user-stories.json`](../blueprint/user-stories.json) | Canonical backlog: epics, story IDs, acceptance criteria, priority (P0/P1…) | New feature, changed acceptance criteria, reprioritisation |
| [`blueprint/`](../blueprint/) (traceability CSV — path in [`qa.config.json`](../qa.config.json)) | **Maps each story** to evidence: Playwright paths, Java test classes, or manual-only notes | New P0 story, new spec file, API test renamed |
| [`qa.config.json`](../qa.config.json) | Paths + **quality gate** column indexes + CI parity order | Rarely; when CSV shape or gate rules change |
| This `docs/` tree | **Process & runbooks** (how to run, report, BDD templates) | Onboarding, reporting expectations; **Jenkins** → `docs/cicd/Jenkins.md` |
| `QA/api/`, `QA/playwright/` | **Executable tests** | Every behaviour change that needs regression |

The **quality gate** (`npm run qa:gate` from `QA/`) does **not** run tests. It checks CSV rules: every **P0** row must list at least one of **Playwright ref**, **API ref**, or **Manual_Only_Notes** so critical scope cannot “exist only in someone’s head.”

## After smoke and E2E pass (senior QA checklist)

1. **Keep evidence:** HTML report under `QA/playwright/playwright-report/`, JUnit `junit.xml`, traces/videos on failure — attach or link in the ticket / release note as needed.
2. **API layer:** `cd QA/api && mvn test` (or your CI job) — same release should not rely on UI alone for contracts.
3. **Gate:** `cd QA && npm run gate` — confirms P0 traceability rows still satisfy the rule after any CSV edits.
4. **Parity with CI (optional):** from repo root `npm run qa:ci:local` — runs gate → Maven API → Playwright `test:ci` in order (`QA/scripts/run-ci.mjs`).
5. **Update blueprint when scope moved:** if you added a new critical path or spec, add/update the story in `user-stories.json` and the **same Story_ID** row in the traceability CSV referenced by `qa.config.json` (see [`blueprint/README.md`](../blueprint/README.md)).
6. **Gaps:** rows that say `Manual_Only_Notes` or `Future …` are **intentional debt** — schedule exploratory or business testing before release, or promote to automation.

## Principles

1. **Pyramid:** fast API checks + few stable E2E; avoid duplicating everything in FR and EN unless the client pays for it.
2. **BDD as documentation:** `.feature` files describe behaviour; automation can stay Playwright-first, or you add Cucumber later.
3. **One pipeline truth:** Jenkins runs the same commands developers run locally; artifacts = proof.

## Quick commands (local)

```bash
# E2E
cd QA/playwright && npm ci && npx playwright install chromium && npm test

# API (needs Java 17+)
cd QA/api && mvn -q test
```
