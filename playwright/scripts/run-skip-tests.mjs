/**
 * Runs @skip specs (real order / contact email) against the configured origin.
 * Use only on a safe env — these hit the live DB and send real messages.
 */
const { spawnSync } = require("child_process");
const path = require("path");

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["playwright", "test", "e2e", "--grep", "@skip"],
  {
    cwd: path.resolve(__dirname, ".."),
    stdio: "inherit",
    env: { ...process.env, PLAYWRIGHT_RUN_SKIP: "1" },
    shell: true,
  },
);

process.exit(result.status ?? 1);
