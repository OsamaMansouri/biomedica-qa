# Jenkins (simple)

**Git = the `QA` folder only.**

**In the Jenkins job**

- **Script Path:** **`Jenkinsfile`** (file at the **root** of this repo — that is what Jenkins uses by default).

The pipeline downloads a static **Docker client** into the job workspace and runs **Node / Maven / Playwright** via `docker run`.

## Docker socket (required)

The Jenkins container must use the **host’s Docker daemon** via **`/var/run/docker.sock`**.

On **Docker Desktop**, the socket is often **`root:root` with mode `660`**. The default **`jenkins`** user then **cannot** open it even when the file is mounted. Start Jenkins **as root**:

```powershell
docker run -d --name jenkins-biomedica `
  -u root `
  -p 9090:8080 -p 50000:50000 `
  -v jenkins_biomedica_home:/var/jenkins_home `
  -v //var/run/docker.sock:/var/run/docker.sock `
  jenkins/jenkins:lts-jdk17
```

Full script: **`jenkins/run-jenkins-docker-desktop.ps1`**.

| Host | Typical fix |
|------|----------------|
| **Docker Desktop** | Socket mount **and** **`-u root`** |
| **Linux** | `-v /var/run/docker.sock:...` — if socket is `root:docker`, use **`--group-add $(getent group docker | cut -d: -f3)`** instead of `-u root` |

### Optional

- **`jenkins/Jenkinsfile.docker`** — same stages with the **Docker Pipeline** plugin (`agent { docker { ... } }`). You still need the **socket mount** for that plugin to spawn containers.

### Monorepo (whole Biomedica in one Git)

**Script Path:** **`QA/Jenkinsfile`**.
