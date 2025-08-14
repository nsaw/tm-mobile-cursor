#!/usr/bin/env node
const fs = require('fs'); const path = require('path');
const PRIMARY = "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions";
const FALLBACK = "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6";
const OUT = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/p6.6-ordering-verification.json";
const STRICT = !!process.env.P66_STRICT;                 // hard-fail on required checks
const STRICT_VISUALS = !!process.env.P66_STRICT_VISUALS; // require Jest/Maestro/Detox (docs-only excluded)
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
const DOCS_ONLY = /_docs-and-readme-updates\.json$/;

function findFile(name){ const a=path.join(PRIMARY,name), b=path.join(FALLBACK,name); return fs.existsSync(a)?a:fs.existsSync(b)?b:null; }
function mustHave(shell, sub){ return shell.some(s => String(s).includes(sub)); }
function inc(k, agg){ agg[k]=(agg[k]||0)+1; }

const totals = { analyzed:0, pass:0, fail:0, missing:0, n_a:0 };
const results = [];
for (const fn of PATCHES){
  const fp = findFile(fn);
  if (!fp){ results.push({file:fn, status:"MISSING"}); inc('missing', totals); continue; }
  const j = JSON.parse(fs.readFileSync(fp,'utf8'));
  const sh = (((j||{}).postMutationBuild||{}).shell)||[];
  const isDocs = DOCS_ONLY.test(fp);

  const checks = {
    ensureValidationDirs: mustHave(sh, "ensure-validation-dirs"),
    ultraBeforeExpo: (()=>{ const iU=sh.findIndex(s=>String(s).includes("ultra-runtime")); const iE=sh.findIndex(s=>String(s).includes("ensure-expo")); return (iU>=0 && iE>=0 && iU<iE); })(),
    expoHealthAfterEnsure: (()=>{ const iE=sh.findIndex(s=>String(s).includes("ensure-expo")); const iH=sh.findIndex(s=>String(s).includes("expo-health")); return (iE>=0 && iH>=0 && iE<iH); })(),
    routeAssert: isDocs ? "N/A" : mustHave(sh, "route-assert"),
    jestAbsolute: isDocs ? "N/A" : mustHave(sh, "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results"),
    maestroAbsolute: isDocs ? "N/A" : mustHave(sh, "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/maestro.xml"),
    detoxAbsolute: isDocs ? "N/A" : mustHave(sh, "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/visual"),
  };

  const required = [checks.ensureValidationDirs, checks.ultraBeforeExpo, checks.expoHealthAfterEnsure];
  if (!isDocs) required.push(checks.routeAssert);
  if (STRICT_VISUALS && !isDocs){ required.push(!!checks.jestAbsolute, !!checks.maestroAbsolute, !!checks.detoxAbsolute); }
  const ok = required.every(Boolean);

  results.push({file:fp, status: ok ? "PASS" : "FAIL", checks});
  inc('analyzed', totals); inc(ok? 'pass':'fail', totals); if(isDocs) inc('n_a', totals);
}

fs.mkdirSync(path.dirname(OUT), {recursive:true});
fs.writeFileSync(OUT, JSON.stringify({generatedAt:new Date().toISOString(), STRICT, STRICT_VISUALS, totals, results}, null, 2));
if (STRICT && results.some(r=>r.status==="FAIL")) { console.error("P6.6 STRICT verification failed"); process.exit(1); }
console.log("verification written:", OUT);


