#!/usr/bin/env node
/**
 * normalize-p66-ordering.cjs
 * Idempotently normalizes Phase 6.6 patch JSONs to required order and artifact paths.
 * - Prepend ensure-validation-dirs, ULTRA
 * - After ULTRA: ensure-expo, expo-health
 * - route-assert only in post (remove from mutations), placed after expo-health (preferred path)
 * - Ensure jest (absolute), maestro (exact output), detox (absolute) are present as soft steps
 * - Optionally add route-map for 552
 * No execution of the patches; JSON edit only.
 */
const fs = require('fs');
const path = require('path');

const PRIMARY = "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions";
const FALLBACK = "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6";

const NB = {
  ensureDirs: "node scripts/nb.cjs --ttl 10s --label ensure-validation-dirs --log validations/logs/ensure-validation-dirs.log --status validations/status -- bash -lc 'mkdir -p /Users/sawyer/gitSync/.cursor-cache/MAIN/validation/{__mocks__,__tests__,maestro,screenshots,test-results,visual}'",
  ultra:      "node scripts/nb.cjs --ttl 30s --label ultra-runtime --log validations/logs/ultra-runtime.log --status validations/status -- bash -lc '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/scripts/ultra-runtime-validation.sh'",
  ensureExpo: "node scripts/nb.cjs --ttl 12s --label ensure-expo --log validations/logs/ensure-expo.log --status validations/status -- node scripts/admin/ensure-expo.cjs",
  health:     "node scripts/nb.cjs --ttl 18s --label expo-health --log validations/logs/expo-health.log --status validations/status -- bash -lc 'curl -sSf http://127.0.0.1:8081/status >/dev/null'",
  routeMap:   "node scripts/nb.cjs --ttl 10s --label route-map --log validations/logs/route-map.log --status validations/status -- node scripts/tools/gen-route-map.cjs",
  routeAssertPreferred: "node scripts/nb.cjs --ttl 25s --label route-assert --log validations/logs/route-assert.log --status validations/status -- bash -lc 'node scripts/validation/route-assert.cjs'",
  routeAssertFallback:  "node scripts/nb.cjs --ttl 25s --label route-assert --log validations/logs/route-assert.log --status validations/status -- bash -lc 'node scripts/tools/route-assert.cjs'",
  jest:       "node scripts/nb.cjs --ttl 240s --label jest-smoke --log validations/logs/jest-smoke.log --status validations/status -- bash -lc 'npx jest --runInBand --outputFile=\"/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/jest-results.json\"'",
  maestro:    "node scripts/nb.cjs --ttl 240s --label maestro --log validations/logs/maestro.log --status validations/status -- bash -lc 'npx maestro test /Users/sawyer/gitSync/.cursor-cache/MAIN/validation/maestro --format junit --output /Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/maestro.xml || true'",
  detox:      "node scripts/nb.cjs --ttl 420s --label detox --log validations/logs/detox.log --status validations/status -- bash -lc 'DETox_RESULTS_DIR=/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/visual npx detox test --record-logs all || true'",
};

const PATCHES_EARLY = [
  "patch-v1.6.552(P6.6.000)_navigator-route-consolidation.json",
  "patch-v1.6.553(P6.6.001)_search-screen-implementation.json",
  "patch-v1.6.554(P6.6.002)_thoughtmarks-all-screen.json",
  "patch-v1.6.555(P6.6.003)_auth-trio-screens.json",
  "patch-v1.6.556(P6.6.004)_settings-subpages.json",
  "patch-v1.6.557(P6.6.005)_bins-and-tags-navigation.json",
  "patch-v1.6.558(P6.6.006)_bulk-operations-surfacing.json",
  "patch-v1.6.559(P6.6.007)_onboarding-modal-canonicalization.json",
];
const PATCHES_MID = [
  "patch-v1.6.566(P6.6.014)_dead-code-and-dup-scan.json",
  "patch-v1.6.567(P6.6.015)_security-settings-wiring.json",
];
const PATCHES_569 = [
  "patch-v1.6.569(P6.6.017)_storekit-deferral-stubs.json",
];

function findPatch(name){
  const p1 = path.join(PRIMARY, name);
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(FALLBACK, name);
  if (fs.existsSync(p2)) return p2;
  return null;
}

function hasStep(shellArr, needle){
  return shellArr.some(s => String(s).includes(needle));
}

function stripSteps(shellArr, needles){
  return shellArr.filter(s => !needles.some(n => String(s).includes(n)));
}

function upsertPostShell(j){
  if (!j.postMutationBuild) j.postMutationBuild = {};
  if (!Array.isArray(j.postMutationBuild.shell)) j.postMutationBuild.shell = [];
  return j.postMutationBuild.shell;
}

function normalizeOne(name, options){
  const p = findPatch(name);
  if (!p) return {file:name, status:"MISSING"};
  let j;
  try { j = JSON.parse(fs.readFileSync(p, 'utf8')); } catch(e){ return {file:p, status:"PARSE_ERROR", error:String(e)}; }

  // Remove route-assert from mutations entirely (duplicates cleanup)
  if (j.mutations && Array.isArray(j.mutations.shell)){
    j.mutations.shell = stripSteps(j.mutations.shell, ["route-assert"]);
  }

  const shell = upsertPostShell(j);

  // Remove any duplicates of key steps to re-order deterministically
  let work = stripSteps(shell, [
    "ensure-validation-dirs",
    "ultra-runtime",
    "ensure-expo",
    "expo-health",
    "route-map",
    "route-assert",
    "jest-smoke",
    " maestro ", // keep spaces to avoid matching non-maestro words
    " detox ",
  ]);

  // Prepend ensure dirs + ULTRA
  work = [NB.ensureDirs, NB.ultra, ...work];

  // Insert ensure-expo and expo-health after ULTRA
  work = [work[0], work[1], NB.ensureExpo, NB.health, ...work.slice(2)];

  // Optional: route-map for 552
  if (options && options.addRouteMap){
    // after expo-health
    work = [work[0], work[1], work[2], work[3], NB.routeMap, ...work.slice(4)];
  }

  // Insert route-assert (preferred path)
  // After expo-health (and route-map if present)
  const basePos = options && options.addRouteMap ? 5 : 4; // index after inserted steps
  work = [...work.slice(0, basePos), NB.routeAssertPreferred, ...work.slice(basePos)];

  // Ensure test + visuals present (soft)
  if (!hasStep(work, "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/jest-results.json")){
    work.push(NB.jest);
  }
  if (!hasStep(work, "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/maestro.xml")){
    work.push(NB.maestro);
  }
  if (!hasStep(work, "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/visual")){
    work.push(NB.detox);
  }

  j.postMutationBuild.shell = work;
  fs.writeFileSync(p, JSON.stringify(j, null, 2));
  return {file:p, status:"UPDATED"};
}

const results = [];
for (const f of PATCHES_EARLY){
  results.push(normalizeOne(f, {addRouteMap: f.startsWith("patch-v1.6.552") }));
}
for (const f of PATCHES_MID){
  results.push(normalizeOne(f));
}
for (const f of PATCHES_569){
  results.push(normalizeOne(f));
}

const OUT = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/p6.6-normalize-ordering-report.json";
fs.mkdirSync(path.dirname(OUT), {recursive:true});
fs.writeFileSync(OUT, JSON.stringify({generatedAt:new Date().toISOString(), results}, null, 2));
console.log("normalization report:", OUT);


