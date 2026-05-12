# Jenkins (simple)

**Git = the `QA` folder only.**

**In the Jenkins job**

- **Script Path:** **`Jenkinsfile`** (file at the **root** of this repo — that is what Jenkins uses by default).

The pipeline downloads a static **Docker client** into the job workspace and runs **Node / Maven / Playwright** via `docker run`. You still need the **Docker socket** mounted on the Jenkins container, e.g. `-v /var/run/docker.sock:/var/run/docker.sock`.

### Optional

- **`jenkins/Jenkinsfile.docker`** — same stages with the **Docker Pipeline** plugin (`agent { docker { ... } }`). Set Script Path to that file only after the plugin is installed.

### Monorepo (whole Biomedica in one Git)

**Script Path:** **`QA/Jenkinsfile`**.
