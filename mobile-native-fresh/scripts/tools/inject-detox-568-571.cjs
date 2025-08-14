#!/usr/bin/env node
/**
 * Inject a soft Detox step into 568 and 571 if missing.
 * Keeps NB-runner wrappers, absolute outputs, idempotent.
 * Does not execute patches.
 */
const fs = require('fs');
const path = require('path');

const PRIMARY = process.env.P6_PRIMARY || "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions";
const FALLBACK = process.env.P6_FALLBACK || "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6";
const TARGETS = [
  "patch-v1.6.568(P6.6.016)_organization-preferences-surfacing.json",
  "patch-v1.6.571(P6.6.019)_validation-tightening.json"
];
const DETOX_CMD = process.env.NB_DETOX_SOFT ||
  "node scripts/nb.cjs --ttl 420s --label detox --log validations/logs/detox.log --status validations/status -- bash -lc 'DETox_RESULTS_DIR=/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/visual npx detox test --record-logs all || true'";

function findPatch(name){
  const p1 = path.join(PRIMARY, name);
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(FALLBACK, name);
  if (fs.existsSync(p2)) return p2;
  return null;
}

let changed = 0, missing = [];
for (const fname of TARGETS){
  const p = findPatch(fname);
  if (!p) { missing.push(fname); continue; }
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  if (!j.postMutationBuild) j.postMutationBuild = {};
  const sh = Array.isArray(j.postMutationBuild.shell) ? j.postMutationBuild.shell : [];
  const hasDetox = sh.some(s => String(s).includes("validation/visual"));
  if (!hasDetox) {
    // Place Detox after Maestro if present, else after route-assert, else at end
    const iMaestro = sh.findIndex(s => String(s).includes("maestro "));
    const iRoute = sh.findIndex(s => String(s).includes("route-assert"));
    if (iMaestro >= 0) sh.splice(iMaestro + 1, 0, DETOX_CMD);
    else if (iRoute >= 0) sh.splice(iRoute + 1, 0, DETOX_CMD);
    else sh.push(DETOX_CMD);
    j.postMutationBuild.shell = sh;
    fs.writeFileSync(p, JSON.stringify(j, null, 2));
    process.stdout.write(`injected detox: ${p}\n`);
    changed++;
  } else {
    process.stdout.write(`already has detox: ${p}\n`);
  }
}
const OUT = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/inject-detox-568-571.report.json";
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({generatedAt:new Date().toISOString(), changed, missing}, null, 2));
console.log("done:", OUT);


