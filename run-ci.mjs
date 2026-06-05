/**
 * Local pre-push check: Playwright smoke (FR).
 * Prerequisites: storefront on :3333, API reachable for catalog/checkout paths.
 */
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const qaRoot = dirname(fileURLToPath(import.meta.url));
const pw = join(qaRoot, "playwright");

function run(cwd, cmd, args) {
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: true });
  if (r.status !== 0 && r.status != null) process.exit(r.status);
  if (r.error) throw r.error;
}

run(pw, "npm", ["ci"]);
run(pw, "npx", ["playwright", "install", "chromium"]);
run(pw, "npm", ["run", "typecheck"]);
run(pw, "npm", ["run", "test:smoke:fr"]);
console.log("ci:local completed (typecheck + smoke FR).");
