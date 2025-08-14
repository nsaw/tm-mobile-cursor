#!/usr/bin/env node
/**
 * normalize-maestro-output.cjs
 * Idempotently rewrites any Maestro invocation inside postMutationBuild.shell of Phase-6.6 patch JSON files to:
 *   ... maestro test <suite> --format junit --output /Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/maestro.xml
 * Preserves NB-runner wrapper and any trailing "|| true". Does not execute patches.
 */
const fs = require('fs');
const path = require('path');

const PRIMARY = process.env.P6_PRIMARY || "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions";
const FALLBACK = process.env.P6_FALLBACK || "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6";
const MAESTRO_OUT = process.env.MAESTRO_OUT || "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/maestro.xml";
const PATCHES = [
  "patch-v1.6.552(P6.6.000)_navigator-route-consolidation.json",
  "patch-v1.6.553(P6.6.001)_search-screen-implementation.json",
  "patch-v1.6.554(P6.6.002)_thoughtmarks-all-screen.json",
  "patch-v1.6.555(P6.6.003)_auth-trio-screens.json",
  "patch-v1.6.556(P6.6.004)_settings-subpages.json",
  "patch-v1.6.557(P6.6.005)_bins-and-tags-navigation.json",
  "patch-v1.6.558(P6.6.006)_bulk-operations-surfacing.json",
  "patch-v1.6.559(P6.6.007)_onboarding-modal-canonicalization.json",
  "patch-v1.6.560(P6.6.008)_voice-recorder-route-fix.json",
  "patch-v1.6.561(P6.6.009)_route-assert-validator.json",
  "patch-v1.6.562(P6.6.010)_screen-smoke-tests.json",
  "patch-v1.6.563(P6.6.011)_bottomnav-alignment.json",
  "patch-v1.6.564(P6.6.012)_dashboard-quickactions-wiring.json",
  "patch-v1.6.565(P6.6.013)_error-boundary-route-guards.json",
  "patch-v1.6.566(P6.6.014)_dead-code-and-dup-scan.json",
  "patch-v1.6.567(P6.6.015)_security-settings-wiring.json",
  "patch-v1.6.568(P6.6.016)_organization-preferences-surfacing.json",
  "patch-v1.6.569(P6.6.017)_storekit-deferral-stubs.json",
  "patch-v1.6.570(P6.6.018)_ai-tools-stabilization.json",
  "patch-v1.6.571(P6.6.019)_validation-tightening.json",
  "patch-v1.6.572(P6.6.020)_docs-and-readme-updates.json",
];

function findPatch(name){
  const p1 = path.join(PRIMARY, name);
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(FALLBACK, name);
  if (fs.existsSync(p2)) return p2;
  return null;
}

function normalizeMaestro(shellStr){
  if (!/maestro\s+test/.test(shellStr)) return shellStr;

  // Preserve existing NB-runner wrapper and any trailing guards (|| true)
  const parts = shellStr.split('||');
  let left = parts[0];
  const tail = parts.slice(1).join('||');

  // Remove any existing --output/--format flags
  left = left
    .replace(/--output\s+(".*?"|'.*?'|\S+)/g, '')
    .replace(/--format\s+\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Append canonical flags right after 'maestro test' command segment
  left = left.replace(/(maestro\s+test[^\n'"}]*)/, (m) => `${m} --format junit --output ${MAESTRO_OUT}`);

  return tail ? `${left} || ${tail.trim()}` : left;
}

let scanned = 0, changed = 0, missing = [];
for (const fname of PATCHES){
  const p = findPatch(fname);
  if (!p){ missing.push(fname); continue; }
  scanned++;
  let j;
  try { j = JSON.parse(fs.readFileSync(p, 'utf8')); } catch(e){ process.stderr.write(`PARSE_ERROR: ${p} ${e}\n`); continue; }

  const sh = (((j||{}).postMutationBuild||{}).shell) || [];
  if (!Array.isArray(sh) || sh.length === 0) continue;

  let touched = false;
  const newShell = sh.map(s => {
    const str = String(s);
    const rew = normalizeMaestro(str);
    if (rew !== str) touched = true;
    return rew;
  });

  if (touched){
    if (!j.postMutationBuild) j.postMutationBuild = {};
    j.postMutationBuild.shell = newShell;
    fs.writeFileSync(p, JSON.stringify(j, null, 2));
    changed++;
    process.stdout.write(`maestro normalized: ${p}\n`);
  } else {
    process.stdout.write(`ok (no changes): ${p}\n`);
  }
}

const OUT = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/maestro-normalize-report.json";
fs.mkdirSync(path.dirname(OUT), {recursive:true});
fs.writeFileSync(OUT, JSON.stringify({generatedAt:new Date().toISOString(), scanned, changed, missing}, null, 2));
console.log("done:", OUT);


