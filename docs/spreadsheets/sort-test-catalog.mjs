import fs from "node:fs";

const path = new URL("./test-catalog.csv", import.meta.url);
const raw = fs.readFileSync(path, "utf8").trimEnd().split(/\r?\n/);
function parseLine(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      q = !q;
      cur += c;
      continue;
    }
    if (!q && c === ",") {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out.map((cell) => {
    if (cell.length >= 2 && cell[0] === '"' && cell[cell.length - 1] === '"') {
      return cell.slice(1, -1).replace(/""/g, '"');
    }
    return cell;
  });
}

function escCell(s) {
  if (/[",\n]/.test(s)) return `"${String(s).replace(/"/g, '""')}"`;
  return s;
}

const STORY_ORDER = [
  "US-DIS-001",
  "US-DIS-002",
  "US-DIS-003",
  "US-DIS-004",
  "US-CART-001",
  "US-CART-002",
  "US-CART-003",
  "US-PAY-001",
  "US-PAY-002",
  "US-POST-001",
  "US-I18N-001",
  "US-I18N-002",
  "US-API-001",
  "US-API-002",
  "US-API-003",
  "US-ADM-001",
  "US-ADM-002",
  "US-ADM-003",
  "US-ADM-004",
  "US-QA-001",
  "US-QA-002",
  "US-QA-003",
];

/** Per-story execution order: API first, then manual checks, then smoke, then E2E */
const LAYER = { API: 1, Manual: 2, Smoke: 3, E2E: 4 };
const storyIndex = (id) => {
  const i = STORY_ORDER.indexOf(id);
  return i === -1 ? 999 : i;
};

const rows = raw.slice(1).map(parseLine);
let headerCells = parseLine(raw[0]);
const artifactIdx = headerCells.indexOf("Artifact");
if (artifactIdx >= 0) {
  headerCells = headerCells.filter((_, i) => i !== artifactIdx);
  for (const r of rows) r.splice(artifactIdx, 1);
}
const header = headerCells.map(escCell).join(",");

/** Column indices after optional Artifact strip: Run_Command = 9, Case_Title = 4 */
const RUN = 9;
const CASE = 4;

rows.sort((a, b) => {
  const sa = storyIndex(a[1]);
  const sb = storyIndex(b[1]);
  if (sa !== sb) return sa - sb;
  const la = LAYER[a[2]] ?? 9;
  const lb = LAYER[b[2]] ?? 9;
  if (la !== lb) return la - lb;
  const aa = a[RUN] ?? "";
  const bb = b[RUN] ?? "";
  if (aa !== bb) return aa.localeCompare(bb);
  return (a[CASE] ?? "").localeCompare(b[CASE] ?? "");
});

rows.forEach((cols, i) => {
  cols[0] = `TC-${String(i + 1).padStart(3, "0")}`;
});

const out = [header, ...rows.map((cols) => cols.map(escCell).join(","))].join("\n") + "\n";
fs.writeFileSync(path, out);
console.log(
  "Wrote",
  rows.length,
  "rows: Story_ID then API→Manual→Smoke→E2E; TC_ID renumbered TC-001…"
);
