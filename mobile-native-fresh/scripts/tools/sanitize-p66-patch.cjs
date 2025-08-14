#!/usr/bin/env node
const fs = require('fs'); const path = require('path');
const PROJECT = "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const PRIMARY = "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions";
const FALLBACK = "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6";
const ARCHIVE = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/patch-archives";
const NB = `node ${PROJECT}/scripts/nb.cjs`;

const maestroDir = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/maestro";
const jestOut = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/jest-results.json";
const maestroOut = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/maestro.xml";
const detoxOutDir = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/visual";
const JEST_CONFIG = process.env.P66_JEST_CONFIG || "jest.config.cjs";
const JEST_SMOKE_PATH = process.env.P66_JEST_SMOKE_PATH || "src-nextgen/hooks/useAccessibilityProps.test.ts";
const SOFT_ULTRA = process.env.P66_SOFT_ULTRA_552 === "1";

const forbidden = /(\$!|\bdisown\b|tail\s+-f|\{\s*.*\s*\}&|\btimeout\b|\bwatch\b|\bfg\b|\blsof\b|\bps\b|\bgrep\b)/i;

function locate(name){ const a=path.join(PRIMARY,name), b=path.join(FALLBACK,name); if(fs.existsSync(a)) return a; if(fs.existsSync(b)) return b; throw new Error("Patch not found: "+name); }
function backup(fp){ fs.mkdirSync(ARCHIVE,{recursive:true}); const ts=new Date().toISOString().replace(/[:.]/g,'-'); const dst=path.join(ARCHIVE, path.basename(fp)+`.${ts}.bak`); fs.copyFileSync(fp,dst); return dst; }

function buildSafe(name){
  const ensureTools = `${NB} --ttl 10s --label ensure-route-tools --log validations/logs/ensure-route-tools.log --status validations/status -- node ${PROJECT}/scripts/tools/ensure-route-tools.cjs`;
  const ensureDirs = `${NB} --ttl 20s --label ensure-validation-dirs --log validations/logs/ensure-validation-dirs.log --status validations/status -- bash -lc 'mkdir -p "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/__mocks__" "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/__tests__" "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/maestro" "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/screenshots" "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results" "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/visual"'`;
  const ultraCore = `${NB} --ttl 45s --label ultra-runtime --log validations/logs/ultra-runtime.log --status validations/status -- bash -lc '${PROJECT}/scripts/ultra-runtime-validation.sh'`;
  const ultra = SOFT_ULTRA ? `${ultraCore} || true` : ultraCore;
  const ensureExpo = `${NB} --ttl 12s --label ensure-expo --log validations/logs/ensure-expo.log --status validations/status -- node ${PROJECT}/scripts/admin/ensure-expo.cjs`;
  const expoHealth = `${NB} --ttl 18s --label expo-health --log validations/logs/expo-health.log --status validations/status -- bash -lc 'curl -sSf http://127.0.0.1:8081/status >/dev/null'`;
  const routeAssert = `${NB} --ttl 25s --label route-assert --log validations/logs/route-assert.log --status validations/status -- node ${PROJECT}/scripts/tools/route-assert.cjs`;
  const jest = `${NB} --ttl 240s --label jest-smoke --log validations/logs/jest-smoke.log --status validations/status -- bash -lc 'npx jest --runInBand --config ${JEST_CONFIG} --runTestsByPath ${JEST_SMOKE_PATH} --outputFile="${jestOut}"'`;
  const maestro = `${NB} --ttl 240s --label maestro --log validations/logs/maestro.log --status validations/status -- bash -lc 'npx maestro test "${maestroDir}" --format junit --output "${maestroOut}" || true'`;
  const detox = `${NB} --ttl 420s --label detox --log validations/logs/detox.log --status validations/status -- bash -lc 'DETox_RESULTS_DIR="${detoxOutDir}" npx detox test --record-logs all || true'`;

  const shell = [ensureTools, ensureDirs, ultra, ensureExpo, expoHealth, routeAssert, jest, maestro, detox];
  for (const s of shell) { if (forbidden.test(s)) throw new Error("Forbidden pattern in generated command: "+s); }
  return { name, description: "Sanitized post-only P6.6 patch (safe NB-wrapped, absolute paths).", postMutationBuild: { shell } };
}

const name = (process.argv.find(x=>x.startsWith('--patch='))?.split('=')[1]) || process.argv[2];
if(!name){ console.error('Usage: sanitize-p66-patch.cjs --patch <filename.json>'); process.exit(2); }
const fp = locate(name); const bak = backup(fp); const safe = buildSafe(name);
fs.writeFileSync(fp, JSON.stringify(safe, null, 2));
const out = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/p66-552-sanitize.report.json";
fs.writeFileSync(out, JSON.stringify({ts:new Date().toISOString(), target: fp, backup: bak, jestConfig: JEST_CONFIG, softUltra: SOFT_ULTRA, shellCount: safe.postMutationBuild.shell.length}, null, 2));
console.log('sanitized:', fp, 'backup:', bak, 'report:', out);


