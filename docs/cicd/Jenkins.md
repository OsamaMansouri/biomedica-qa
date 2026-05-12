# Jenkins (simple)

**Git = the `QA` folder only.** Jenkins clones that repo.

**In Jenkins**

1. **Pipeline** → **Pipeline script from SCM** → Git.
2. **Repository URL** = your **QA** repo (e.g. `biomedica-qa`).
3. **Script Path** = **`jenkins/Jenkinsfile`** (default: runs on the agent with **Node + Java 17 + Maven**, no Docker plugin).
4. **Save** → **Build Now**.

**If Git is the whole Biomedica project** (not only QA), use **Script Path** = **`QA/jenkins/Jenkinsfile`**.

### Default vs Docker

| Script Path | Needs |
|-------------|--------|
| **`jenkins/Jenkinsfile`** | Jenkins agent with **Node 20+**, **Java 17+**, **Maven**, **Git**, and **`sh`** (Linux agent or Git Bash on Windows). Playwright installs Chromium in the E2E stage. |
| **`jenkins/Jenkinsfile.docker`** | Jenkins plugin **Docker Pipeline** + agent that can run **Docker**. Uses `host.docker.internal` for app URLs (Docker Desktop). |

Start **storefront + API** before E2E, or set **`PLAYWRIGHT_ORIGIN`** and **`PLAYWRIGHT_API_BASE_URL`** on the job.
