// Biomedica QA — minimal Jenkins pipeline (no Docker-in-pipeline).
// Agent must have: Git, Node 20+, JDK 17+, Maven, and `sh` (Linux agent or Git Bash on Windows).
// Job: Pipeline from SCM → this repo → Script Path: Jenkinsfile
// Env (optional): PLAYWRIGHT_ORIGIN, PLAYWRIGHT_API_BASE_URL, PLAYWRIGHT_TEST_PRODUCT_SLUG.
// PLAYWRIGHT_WORKERS defaults to 3 (same as playwright.config); set job env to 1 if staging overloads.

pipeline {
  agent any

  options {
    timestamps()
    timeout(time: 45, unit: 'MINUTES')
  }

  environment {
    CI = 'true'
    PLAYWRIGHT_ORIGIN = "${env.PLAYWRIGHT_ORIGIN ?: 'http://localhost:3333'}"
    PLAYWRIGHT_API_BASE_URL = "${env.PLAYWRIGHT_API_BASE_URL ?: 'http://localhost:8000'}"
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
      steps {
        dir('api') {
          sh 'mvn -B -q verify'
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
