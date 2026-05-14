# Attaches https://github.com/OsamaMansouri/biomedica-qa to this QA folder by copying
# a fresh clone's .git into QA\.git (same approach as front/back/admin).
# Run from PowerShell:  powershell -ExecutionPolicy Bypass -File .\scripts\attach-biomedica-qa-git.ps1
$ErrorActionPreference = "Stop"

$qaRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$biomedicaRoot = (Resolve-Path (Join-Path $qaRoot "..")).Path
$tmp = Join-Path $biomedicaRoot ".qa-repo-temp"
$remote = "https://github.com/OsamaMansouri/biomedica-qa.git"

Write-Host "QA root: $qaRoot"

if (Test-Path (Join-Path $qaRoot ".git")) {
  Write-Host "Removing existing QA\.git ..."
  Remove-Item -Recurse -Force (Join-Path $qaRoot ".git")
}

if (Test-Path $tmp) {
  Write-Host "Removing stale temp clone: $tmp"
  Remove-Item -Recurse -Force $tmp
}

Write-Host "Cloning $remote ..."
git clone $remote $tmp

$srcGit = Join-Path $tmp ".git"
if (-not (Test-Path $srcGit)) {
  throw "Clone failed: missing $srcGit"
}

Write-Host "Copying .git into QA folder ..."
Copy-Item -Path $srcGit -Destination (Join-Path $qaRoot ".git") -Recurse -Force

Write-Host "Removing temp clone ..."
Remove-Item -Recurse -Force $tmp

Write-Host "Verifying ..."
git -C $qaRoot remote -v
git -C $qaRoot status -sb

Write-Host "Done. Commit and push from QA when ready."
