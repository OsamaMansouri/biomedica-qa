# Jenkins (simple)

**Git = the `QA` folder only.** Jenkins clones that repo. The pipeline file is **`jenkins/Jenkinsfile`** inside it.

**In Jenkins**

1. New job → **Pipeline** → **Pipeline script from SCM** → Git.
2. **Repository URL** = your **QA** repo.
3. **Script Path** = **`jenkins/Jenkinsfile`**
4. **Save** → **Build Now**.

**If Git is the whole Biomedica project** (not only QA), same job but **Script Path** = **`QA/jenkins/Jenkinsfile`**.

You need **Docker** on the machine that runs builds, and Jenkins **Docker Pipeline** plugin. If Jenkins runs in Docker, mount the host Docker socket (see old notes or Docker docs).

Start **storefront + API** before E2E, or set job env **`PLAYWRIGHT_ORIGIN`** and **`PLAYWRIGHT_API_BASE_URL`** to URLs the containers can reach.
