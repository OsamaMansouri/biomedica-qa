# Run Jenkins on Docker Desktop (Windows) with the Docker socket so CI can `docker run`.
# Usage: powershell -ExecutionPolicy Bypass -File .\jenkins\run-jenkins-docker-desktop.ps1

$ErrorActionPreference = "Stop"

Write-Host "Stopping/removing old container jenkins-biomedica (if any)..."
docker stop jenkins-biomedica 2>$null
docker rm jenkins-biomedica 2>$null

Write-Host "Starting Jenkins on http://localhost:9090 ..."
docker run -d --name jenkins-biomedica `
  -p 9090:8080 `
  -p 50000:50000 `
  -v jenkins_biomedica_home:/var/jenkins_home `
  -v //var/run/docker.sock:/var/run/docker.sock `
  jenkins/jenkins:lts-jdk17

Write-Host "Done. Get initial password with:"
Write-Host "  docker exec jenkins-biomedica cat /var/jenkins_home/secrets/initialAdminPassword"
