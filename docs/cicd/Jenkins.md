# Jenkins (simple)

**Git = the `QA` folder only.** Script Path: **`jenkins/Jenkinsfile`**.

### What the Jenkins machine needs

- **Git** (already there if checkout works)
- **Docker CLI** + permission to talk to the Docker daemon  
  - If Jenkins runs **inside Docker**: mount the socket when you start Jenkins, e.g.  
    `-v /var/run/docker.sock:/var/run/docker.sock`  
    and install the **`docker`** client in the image if it is missing (official `jenkins/jenkins` image often does not include it — use a small custom image or `apt-get install docker.io` in a derived Dockerfile).

The pipeline runs **Node / Maven / Playwright inside `docker run`**, so the controller does **not** need Node installed.

### URLs for tests

Default: **`host.docker.internal:3333`** and **`:8000`** so containers can reach Next + Laravel on the **host**. Override on the job with **`PLAYWRIGHT_ORIGIN`** and **`PLAYWRIGHT_API_BASE_URL`** if needed.

### Optional: `jenkins/Jenkinsfile.docker`

Same stages using the **Docker Pipeline** plugin (`agent { docker { ... } }`). Install that plugin and point Script Path there if you prefer that style.

### Full Biomedica repo (not only QA)

Script Path: **`QA/jenkins/Jenkinsfile`**.
