# Jenkins (simple)

1. **Job** → Pipeline → **Pipeline script from SCM** → Git URL = this `biomedica-qa` repo.
2. **Branch** → `*/main`
3. **Script Path** → `Jenkinsfile`
4. Turn **Lightweight checkout** **off** (recommended).
5. **Save** → **Build Now**.

The machine that runs the build (**agent**) needs **Node 20+**, **Java 17**, **Maven**, and **Git**. The default **Jenkins Docker image does not include Node/Maven** — use a normal PC/VM as agent, or a custom image where you installed those tools.

Optional job environment variables: `PLAYWRIGHT_ORIGIN`, `PLAYWRIGHT_API_BASE_URL`, `PLAYWRIGHT_TEST_PRODUCT_SLUG` (defaults use `http://localhost:3333` and `http://localhost:8000`).

If Git breaks with “not in a git directory”, wipe the job workspace once or add Git behaviour **Wipe out repository & force clone**.

Monorepo (whole Biomedica in one Git): **Script Path** → `QA/Jenkinsfile`.
