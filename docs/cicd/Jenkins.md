# Jenkins (simple)

**Git = the `QA` folder only.**

**In the Jenkins job**

- **Script Path:** **`Jenkinsfile`** (file at the **root** of this repo — that is what Jenkins uses by default).
- Turn **Lightweight checkout** **off**. If it stays on, the job must still run a full **`checkout scm`** (the root `Jenkinsfile` includes a **Checkout** stage so `scripts/`, `api/`, etc. exist before Docker runs).

The pipeline runs **Node / Maven / Playwright** via `docker run`.

- If Jenkins runs **inside Docker**, bind-mounting `"$WORKSPACE:/ws"` points at the **Docker host** path, not your clone — child containers see an **empty** tree. The `Jenkinsfile` uses **`--volumes-from $(hostname)`** when `/.dockerenv` exists so sibling containers share Jenkins’s volumes.
- On a **normal VM/agent** (no `/.dockerenv`), it keeps the simple `-v "$WORKSPACE:/ws"` bind mount.

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

### Optional: Docker Pipeline plugin

- **`jenkins/Jenkinsfile.docker`** — same stages with the **Docker Pipeline** plugin (`agent { docker { ... } }`). You still need the **socket mount** for that plugin to spawn containers.

### Monorepo (whole Biomedica in one Git)

**Script Path:** **`QA/Jenkinsfile`**.

### Error: `fatal: not in a git directory` when fetching `origin`

The job workspace is **not** a healthy clone (missing or broken `.git`).

**Fix:**

1. Stop any running build for this job.
2. **Delete the job workspace** so the next build does a **fresh clone**:
   - On the machine that holds Jenkins data, delete  
     `.../workspace/Biomedica`  
     (inside `JENKINS_HOME`, often `/var/jenkins_home/workspace/Biomedica` in Docker).
   - Or install the **Workspace Cleanup** plugin and add **“Delete workspace before build starts”** on the job.
3. Under Git **Additional Behaviours**, use **“Wipe out repository & force clone”** once, **Save**, then build.
4. **Uncheck “Lightweight checkout”** on the Pipeline definition if it is still checked.

**Git tool message:** “Selected Git installation does not exist” → **Manage Jenkins → Global Tool Configuration → Git** — either define a Git installation or open the job’s Git **Advanced** section and clear a bad “Git executable” / tool name so Jenkins uses the default `git` on `PATH`.
