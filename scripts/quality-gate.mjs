/**
 * QA quality gate: validates traceability CSV rules from qa.config.json.
 * Run from repo root: npm run qa:gate  OR  cd QA && npm run gate
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsvLine } from "./csv-parse.mjs";

const qaRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(qaRoot, "qa.config.json");
if (!existsSync(configPath)) {
  console.error("Missing QA/qa.config.json");
  process.exit(1);
}
const config = JSON.parse(readFileSync(configPath, "utf8"));
const csvRel =
  config.paths?.traceabilityCsv ?? "blueprint/traceability-matrix.csv";
const csvPath = join(qaRoot, csvRel);
if (!existsSync(csvPath)) {
  console.error("Missing traceability CSV:", csvPath);
  process.exit(1);
}

const { priority, playwrightRef, apiRef, manualNotes } =
  config.qualityGate.traceabilityColumns;

const raw = readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
const header = raw[0];
if (!header.includes("Story_ID") || !header.includes("Priority")) {
  console.error("Unexpected CSV header");
  process.exit(1);
}

const errors = [];
for (let i = 1; i < raw.length; i++) {
  const line = raw[i];
  if (!line.trim()) continue;
  const cols = parseCsvLine(line);
  if (cols.length < 8) {
    errors.push(`Line ${i + 1}: expected 8 columns, got ${cols.length}`);
    continue;
  }
  const pri = (cols[priority] ?? "").trim();
  if (pri !== "P0") continue;
  const pw = (cols[playwrightRef] ?? "").trim();
  const api = (cols[apiRef] ?? "").trim();
  const man = (cols[manualNotes] ?? "").trim();
  if (!pw && !api && !man) {
    errors.push(
      `Line ${i + 1} (${cols[0]?.trim()}): P0 story must have Playwright ref, API ref, or Manual_Only_Notes`,
    );
  }
}

if (errors.length) {
  console.error("Quality gate FAILED:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("Quality gate OK - P0 traceability rules satisfied.");
