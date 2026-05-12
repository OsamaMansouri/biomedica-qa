# Jenkins (simple)

**Git = the `QA` folder only.**

**In the Jenkins job**

- **Script Path:** **`Jenkinsfile`** (file at the **root** of this repo — that is what Jenkins uses by default).

The pipeline downloads a static **Docker client** into the job workspace and runs **Node / Maven / Playwright** via `docker run`.

## Docker socket (required)

The Jenkins container must use the **host’s Docker daemon**. Otherwise you see:

`Cannot connect to the Docker daemon at unix:///var/run/docker.sock`

**Fix:** recreate Jenkins with the socket mounted.

| Host | Extra `docker run` argument |
|------|------------------------------|
| **Docker Desktop (Windows/macOS)** | `-v //var/run/docker.sock:/var/run/docker.sock` |
| **Linux** | `-v /var/run/docker.sock:/var/run/docker.sock` |

Example for **Windows PowerShell**: see **`jenkins/run-jenkins-docker-desktop.ps1`** in this repo (copy-paste `docker run` block).

### Optional

- **`jenkins/Jenkinsfile.docker`** — same stages with the **Docker Pipeline** plugin (`agent { docker { ... } }`). You still need the **socket mount** for that plugin to spawn containers.

### Monorepo (whole Biomedica in one Git)

**Script Path:** **`QA/Jenkinsfile`**.
