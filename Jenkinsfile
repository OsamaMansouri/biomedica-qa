// Biomedica QA — Jenkins pipeline (no Docker-in-pipeline).
// Agent: Git, Node 20+, JDK 17+, Maven, sh. With "Pipeline from SCM", Jenkins checks out the repo before stages run (no duplicate checkout in this file).
//
// --- You run Laravel + Next on your PC; Jenkins is in Docker (typical) ---
// Inside the container, "localhost" is NOT your PC. Either:
//   • Build with Parameters → enable REACH_PC_LOCAL_DEV, or
//   • Job → Configure → General → "This project is parameterized" → Boolean REACH_PC_LOCAL_DEV = true
// That forces API + Playwright to http://host.docker.internal:8000 and :3333 (same ports as local).
// On Windows host, bind services to all interfaces so Docker can reach them, e.g.:
//   php artisan serve --host=0.0.0.0 --port=8000
//   next dev --hostname 0.0.0.0 -p 3333   (or your project’s dev command with 0.0.0.0)
// If Jenkins runs directly on the same machine (no Docker agent), you can use real localhost and
// ALLOW_LOCALHOST_API=true for API smoke, or set API_BASE_URL=http://127.0.0.1:8000 yourself.
//
// --- CI without your PC (optional) ---
// SKIP_API_SMOKE=true | API_SMOKE_MODE=embedded (+ PHP/Composer on agent) | or set API_BASE_URL to staging/prod.

pipeline {
  agent any

  options {
    timestamps()
    timeout(time: 45, unit: 'MINUTES')
  }

  parameters {
    booleanParam(
      name: 'REACH_PC_LOCAL_DEV',
      defaultValue: false,
      description: 'Jenkins in Docker on your PC: hit Laravel :8000 and Next :3333 on Windows via host.docker.internal (run dev servers with --host 0.0.0.0).'
    )
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
    stage('Init') {
      steps {
        script {
          echo "[Init] WORKSPACE=${env.WORKSPACE}"
          def reach = (env.REACH_PC_LOCAL_DEV ?: '').trim()
          if (!reach) {
            try {
              def p = params.get('REACH_PC_LOCAL_DEV')
              reach = (p != null ? p.toString() : '').trim()
            } catch (Throwable ignored) {
              reach = ''
            }
          }
          if (reach.equalsIgnoreCase('true')) {
            env.API_BASE_URL = 'http://host.docker.internal:8000'
            env.PLAYWRIGHT_API_BASE_URL = 'http://host.docker.internal:8000'
            env.PLAYWRIGHT_ORIGIN = 'http://host.docker.internal:3333'
            env.API_SMOKE_MODE = 'external'
            echo '[Init] REACH_PC_LOCAL_DEV=true → host.docker.internal :8000 / :3333'
          } else {
            echo '[Init] REACH_PC_LOCAL_DEV off (use Build with Parameters to enable).'
          }
        }
      }
    }

    stage('Quality gate') {
      steps {
        sh '''
          set -e
          echo "[Quality gate] pwd=$(pwd) node=$(command -v node || echo MISSING)"
          node scripts/quality-gate.mjs
        '''
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
                  echo "  REACH_PC_LOCAL_DEV=true  (Jenkins in Docker → Laravel/Next on your Windows host, ports 8000/3333)"
                  echo "  API_BASE_URL=http://host.docker.internal:8000  (same idea, manual)"
                  echo "  API_SMOKE_MODE=embedded  (Laravel started inside Jenkins — needs PHP/Composer on agent)"
                  echo "  Laravel on this same agent: ALLOW_LOCALHOST_API=true"
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
