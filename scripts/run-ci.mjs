/**
 * Local CI parity: REST Assured (expects API already running) then Playwright CI reporter.
 * For full stack: start `npm run api` (Laravel) and storefront in other terminals first.
 */
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const qaRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function run(cwd, cmd, args) {
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: true });
  if (r.status !== 0 && r.status != null) process.exit(r.status);
  if (r.error) throw r.error;
}

run(qaRoot, "npm", ["run", "gate"]);
run(qaRoot, "mvn", ["-B", "-f", "api/pom.xml", "verify"]);
const pw = join(qaRoot, "playwright");
run(pw, "npm", ["ci"]);
run(pw, "npx", ["playwright", "install", "chromium"]);
run(pw, "npm", ["run", "test:ci"]);
console.log("ci:local completed.");
