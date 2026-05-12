// Biomedica QA — repo root file for Jenkins default Script Path: "Jenkinsfile"
// (Same pipeline as before under jenkins/ — use this path in the job.)
//
// Uses `docker run` for Node/Maven/Playwright. Downloads static Docker client into workspace.
// Mount Docker socket on the Jenkins container, e.g. -v /var/run/docker.sock:/var/run/docker.sock
//
// Defaults: host.docker.internal for storefront/API (Docker Desktop host).

pipeline {
  agent any

  options {
    timestamps()
    timeout(time: 45, unit: 'MINUTES')
  }

  environment {
    CI = 'true'
    PLAYWRIGHT_ORIGIN = "${env.PLAYWRIGHT_ORIGIN ?: 'http://host.docker.internal:3333'}"
    PLAYWRIGHT_API_BASE_URL = "${env.PLAYWRIGHT_API_BASE_URL ?: 'http://host.docker.internal:8000'}"
    PLAYWRIGHT_TEST_PRODUCT_SLUG = "${env.PLAYWRIGHT_TEST_PRODUCT_SLUG ?: 'argan-et-figue-de-barbarie'}"
  }

  stages {
    stage('Bootstrap Docker CLI') {
      steps {
        sh '''
          echo "=== Biomedica QA pipeline (downloads Docker CLI if missing) ==="
          set -eu
          TOOLS="${WORKSPACE}/.jenkins-tools"
          mkdir -p "$TOOLS"
          if [ -x "$TOOLS/docker" ]; then
            echo "Using cached Docker CLI: $TOOLS/docker"
            exit 0
          fi
          ARCH=$(uname -m)
          case "$ARCH" in
            x86_64) DARCH=x86_64 ;;
            aarch64|arm64) DARCH=aarch64 ;;
            *) echo "Unsupported CPU: $ARCH (need x86_64 or aarch64)"; exit 1 ;;
          esac
          VER=27.4.1
          echo "Downloading Docker CLI ${VER} (${DARCH}) ..."
          curl -fsSL "https://download.docker.com/linux/static/stable/${DARCH}/docker-${VER}.tgz" \
            | tar xz -C "$TOOLS"
          mv "$TOOLS/docker/docker" "$TOOLS/docker.bin"
          rm -rf "$TOOLS/docker"
          mv "$TOOLS/docker.bin" "$TOOLS/docker"
          chmod +x "$TOOLS/docker"
          echo "Installed: $TOOLS/docker"
        '''
      }
    }

    stage('Precheck Docker daemon') {
      steps {
        sh '''
          export PATH="${WORKSPACE}/.jenkins-tools:\$PATH"
          if docker version >/dev/null 2>&1; then
            echo "Docker daemon OK."
            exit 0
          fi
          if [ -S /var/run/docker.sock ]; then
            echo "=== Socket exists but this user cannot use Docker ==="
            ls -la /var/run/docker.sock
            echo ""
            echo "Docker Desktop often mounts the socket as root:root (mode 660)."
            echo "Recreate Jenkins with user root, e.g. add -u root to docker run"
            echo "(see jenkins/run-jenkins-docker-desktop.ps1 in this repo)."
            exit 1
          fi
          echo "=== No Docker socket in this container ==="
          ls -la /var/run/docker.sock 2>/dev/null || echo "(no /var/run/docker.sock)"
          echo ""
          echo "Mount the host socket, e.g.:"
          echo "  Linux:   -v /var/run/docker.sock:/var/run/docker.sock"
          echo "  Win/Mac: -v //var/run/docker.sock:/var/run/docker.sock"
          echo "See jenkins/run-jenkins-docker-desktop.ps1"
          exit 1
        '''
      }
    }

    stage('Quality gate') {
      steps {
        sh """
          export PATH="${WORKSPACE}/.jenkins-tools:\$PATH"
          docker run --rm \\
            -v "${WORKSPACE}:/ws" \\
            -w /ws \\
            node:22-bookworm \\
            node scripts/quality-gate.mjs
        """
      }
    }

    stage('Playwright typecheck') {
      steps {
        sh """
          export PATH="${WORKSPACE}/.jenkins-tools:\$PATH"
          docker run --rm \\
            -v "${WORKSPACE}:/ws" \\
            -w /ws/playwright \\
            node:22-bookworm \\
            bash -lc 'npm ci && npm run typecheck'
        """
      }
    }

    stage('API smoke (REST Assured)') {
      steps {
        sh """
          export PATH="${WORKSPACE}/.jenkins-tools:\$PATH"
          docker run --rm \\
            -v "${WORKSPACE}:/ws" \\
            -w /ws/api \\
            -e PLAYWRIGHT_API_BASE_URL="${PLAYWRIGHT_API_BASE_URL}" \\
            maven:3.9.9-eclipse-temurin-17 \\
            mvn -B -q verify
        """
      }
      post {
        always {
          junit testResults: 'api/target/surefire-reports/TEST-*.xml', allowEmptyResults: true
          archiveArtifacts artifacts: 'api/target/surefire-reports/**,api/target/reports/**', allowEmptyArchive: true
        }
      }
    }

    stage('E2E (Playwright)') {
      steps {
        sh """
          export PATH="${WORKSPACE}/.jenkins-tools:\$PATH"
          docker run --rm \\
            -v "${WORKSPACE}:/ws" \\
            -w /ws/playwright \\
            -e CI=true \\
            -e PLAYWRIGHT_ORIGIN="${PLAYWRIGHT_ORIGIN}" \\
            -e PLAYWRIGHT_API_BASE_URL="${PLAYWRIGHT_API_BASE_URL}" \\
            -e PLAYWRIGHT_TEST_PRODUCT_SLUG="${PLAYWRIGHT_TEST_PRODUCT_SLUG}" \\
            mcr.microsoft.com/playwright:v1.50.1-jammy \\
            bash -lc 'npm ci && npx playwright test --reporter=list,junit'
        """
      }
      post {
        always {
          junit 'playwright/junit.xml'
          archiveArtifacts artifacts: 'playwright/playwright-report/**', allowEmptyArchive: true
        }
      }
    }
  }
}
