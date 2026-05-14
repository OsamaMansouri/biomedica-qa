// Biomedica QA — minimal Jenkins pipeline (no Docker-in-pipeline).
// Agent must have: Git, Node 20+, JDK 17+, Maven, and `sh` (Linux agent or Git Bash on Windows).
// API smoke in embedded mode also needs PHP 8.3+, Composer, curl, and extensions: mbstring, xml, ctype, fileinfo, pdo_sqlite, bcmath.
// Job: Pipeline from SCM → this repo → Script Path: Jenkinsfile
// Env (optional): PLAYWRIGHT_ORIGIN, PLAYWRIGHT_API_BASE_URL, API_BASE_URL, PLAYWRIGHT_TEST_PRODUCT_SLUG.
// PLAYWRIGHT_WORKERS defaults to 3 (same as playwright.config); set job env to 1 if staging overloads.
//
// API smoke (Maven / REST Assured):
// - external (default): set API_BASE_URL / PLAYWRIGHT_API_BASE_URL to any reachable Laravel (staging, host.docker.internal, prod, etc.).
// - embedded: API_SMOKE_MODE=embedded — starts Laravel from ./backend (monorepo) or clones BACKEND_REPO_URL into ./backend-ci (SQLite, migrate, seed, artisan serve), then runs Maven against http://127.0.0.1:8000 (no external URL).
// - auto (default): leave API_SMOKE_MODE unset — if ./backend/composer.json exists and API_BASE_URL is localhost/127.0.0.1 (or unset → default localhost), the pipeline uses embedded mode; otherwise external.
// - skip: SKIP_API_SMOKE=true
// Docker Desktop + API on host: API_BASE_URL=http://host.docker.internal:8000
// Optional: ALLOW_LOCALHOST_API=true if Laravel already listens on localhost:8000 on the same agent (external mode only).

pipeline {
  agent any

  options {
    timestamps()
    timeout(time: 45, unit: 'MINUTES')
  }

  environment {
    CI = 'true'
    // Unset job param → __AUTO__ (resolved at API smoke stage: monorepo + local URL → embedded).
    API_SMOKE_MODE = "${env.API_SMOKE_MODE ?: '__AUTO__'}"
    PLAYWRIGHT_ORIGIN = "${env.PLAYWRIGHT_ORIGIN ?: 'http://localhost:3333'}"
    // REST Assured reads API_BASE_URL then PLAYWRIGHT_API_BASE_URL (see QA/api/.../HttpBase.java).
    API_BASE_URL = "${env.API_BASE_URL ?: env.PLAYWRIGHT_API_BASE_URL ?: 'http://localhost:8000'}"
    PLAYWRIGHT_API_BASE_URL = "${env.PLAYWRIGHT_API_BASE_URL ?: env.API_BASE_URL ?: 'http://localhost:8000'}"
    PLAYWRIGHT_TEST_PRODUCT_SLUG = "${env.PLAYWRIGHT_TEST_PRODUCT_SLUG ?: 'argan-et-figue-de-barbarie'}"
    PLAYWRIGHT_WORKERS = "${env.PLAYWRIGHT_WORKERS ?: '3'}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Quality gate') {
      steps {
        sh 'node scripts/quality-gate.mjs'
      }
    }

    stage('Playwright typecheck') {
      steps {
        dir('playwright') {
          sh 'npm ci'
          sh 'npm run typecheck'
        }
      }
    }

    stage('API smoke') {
      when {
        expression {
          return !(env.SKIP_API_SMOKE ?: '').trim().equalsIgnoreCase('true')
        }
      }
      steps {
        script {
          def mode = (env.API_SMOKE_MODE ?: '').trim()
          if (!mode || mode == '__AUTO__') {
            def api = (env.API_BASE_URL ?: '').trim()
            def localUrl =
              api.isEmpty() ||
              api.startsWith('http://localhost:') ||
              api.startsWith('http://127.0.0.1:')
            if (fileExists('backend/composer.json') && localUrl) {
              env.API_SMOKE_MODE = 'embedded'
              echo '[API smoke] API_SMOKE_MODE=embedded (auto: monorepo backend + local API URL).'
            } else {
              env.API_SMOKE_MODE = 'external'
              echo '[API smoke] API_SMOKE_MODE=external (auto).'
            }
          }
          def embedded = (env.API_SMOKE_MODE ?: '').trim().equalsIgnoreCase('embedded')
          if (embedded && !fileExists('backend/composer.json')) {
            checkout([
              $class                           : 'GitSCM',
              branches                          : [[name: "${env.BACKEND_GIT_BRANCH ?: '*/main'}"]],
              extensions                        : [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'backend-ci']],
              userRemoteConfigs                 : [[
                url: "${env.BACKEND_REPO_URL ?: 'https://github.com/OsamaMansouri/biomedica-back.git'}"
              ]]
            ])
          }
        }
        dir('api') {
          sh '''
            set -e
            echo "[API smoke] API_SMOKE_MODE=${API_SMOKE_MODE:-external}"
            echo "[API smoke] Effective API_BASE_URL=$API_BASE_URL"
            echo "[API smoke] PLAYWRIGHT_API_BASE_URL=$PLAYWRIGHT_API_BASE_URL"

            if [ "${API_SMOKE_MODE:-external}" = "embedded" ]; then
              WS="${WORKSPACE:?WORKSPACE unset}"
              if [ -f "$WS/backend/composer.json" ]; then
                BE_DIR="$WS/backend"
              elif [ -f "$WS/backend-ci/composer.json" ]; then
                BE_DIR="$WS/backend-ci"
              else
                echo "embedded mode: need \$WORKSPACE/backend (monorepo) or \$WORKSPACE/backend-ci (clone). Missing composer.json."
                exit 1
              fi
              echo "[API smoke] embedded backend: $BE_DIR"
              command -v php >/dev/null 2>&1 || { echo "embedded mode requires php on PATH"; exit 1; }
              command -v composer >/dev/null 2>&1 || { echo "embedded mode requires composer on PATH"; exit 1; }

              (
                cd "$BE_DIR"
                rm -f .env
                cp .env.example .env
                php artisan key:generate --no-interaction
                mkdir -p database
                touch database/database.sqlite
                composer install --no-interaction --prefer-dist
                php artisan migrate --force --no-interaction
                php artisan db:seed --force --no-interaction
                nohup php artisan serve --host=127.0.0.1 --port=8000 > /tmp/laravel-jenkins-qa.log 2>&1 &
                echo $! > /tmp/laravel-jenkins-qa.pid
              )
              for i in $(seq 1 60); do
                if curl -sf "http://127.0.0.1:8000/api/products?per_page=1" >/dev/null; then
                  echo "[API smoke] Laravel ready"
                  break
                fi
                if [ "$i" -eq 60 ]; then
                  echo "--- laravel log ---"
                  cat /tmp/laravel-jenkins-qa.log || true
                  exit 1
                fi
                sleep 1
              done
              cleanup_embedded() {
                if [ -f /tmp/laravel-jenkins-qa.pid ]; then
                  kill "$(cat /tmp/laravel-jenkins-qa.pid)" 2>/dev/null || true
                  rm -f /tmp/laravel-jenkins-qa.pid
                fi
              }
              trap cleanup_embedded EXIT
              export API_BASE_URL=http://127.0.0.1:8000
              export PLAYWRIGHT_API_BASE_URL=http://127.0.0.1:8000
              mvn -B -q verify -Dqa.api.baseUrl=http://127.0.0.1:8000
              cleanup_embedded
              trap - EXIT
              exit 0
            fi

            case "$API_BASE_URL" in
              http://localhost:8000|http://127.0.0.1:8000)
                if [ "${ALLOW_LOCALHOST_API:-}" != "true" ]; then
                  echo ""
                  echo "========================================"
                  echo "API smoke: nothing serves $API_BASE_URL inside this agent (Connection refused)."
                  echo ""
                  echo "Pick one:"
                  echo "  API_SMOKE_MODE=embedded  (PHP+Composer on agent; Laravel from backend/ or clone backend-ci)"
                  echo "  API_BASE_URL=https://your-reachable-api"
                  echo "  Docker host API: API_BASE_URL=http://host.docker.internal:8000"
                  echo "  Laravel on this agent: ALLOW_LOCALHOST_API=true"
                  echo "  Skip: SKIP_API_SMOKE=true"
                  echo "========================================"
                  exit 1
                fi
                ;;
            esac
            mvn -B -q verify -Dqa.api.baseUrl="${API_BASE_URL}"
          '''
        }
      }
      post {
        always {
          junit testResults: 'api/target/surefire-reports/TEST-*.xml', allowEmptyResults: true
          archiveArtifacts artifacts: 'api/target/surefire-reports/**,api/target/reports/**', allowEmptyArchive: true
        }
      }
    }

    stage('E2E') {
      steps {
        dir('playwright') {
          sh 'npm ci'
          sh 'npx playwright install chromium'
          sh 'npx playwright test --reporter=list,junit'
        }
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
