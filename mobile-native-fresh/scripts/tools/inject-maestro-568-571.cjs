#!/usr/bin/env node
/**
 * Inject a soft Maestro step into 568 and 571 if missing.
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
const MAESTRO_CMD = process.env.NB_MAESTRO_SOFT ||
  "node scripts/nb.cjs --ttl 240s --label maestro --log validations/logs/maestro.log --status validations/status -- bash -lc 'npx maestro test /Users/sawyer/gitSync/.cursor-cache/MAIN/validation/maestro --format junit --output /Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/maestro.xml || true'";

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
  const hasMaestro = sh.some(s => String(s).includes(" maestro "));
  if (!hasMaestro) {
    const iRoute = sh.findIndex(s => String(s).includes("route-assert"));
    if (iRoute >= 0) sh.splice(iRoute + 1, 0, MAESTRO_CMD);
    else sh.push(MAESTRO_CMD);
    j.postMutationBuild.shell = sh;
    fs.writeFileSync(p, JSON.stringify(j, null, 2));
    process.stdout.write(`injected maestro: ${p}\n`);
    changed++;
  } else {
    process.stdout.write(`already has maestro: ${p}\n`);
  }
}
const OUT = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/inject-maestro-568-571.report.json";
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({generatedAt:new Date().toISOString(), changed, missing}, null, 2));
console.log("done:", OUT);


