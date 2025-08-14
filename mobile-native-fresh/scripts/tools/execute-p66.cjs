#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs'); const path = require('path'); const { spawnSync } = require('child_process');
const PROJECT = "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const PLAN = "/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/P6.6_execution-plan.json";
const PRIMARY = "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions";
const FALLBACK = "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6";
const STATE = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/p66-execution.state.json";
const mode = (process.argv.includes('--mode') ? process.argv[process.argv.indexOf('--mode')+1] : 'plan');
const NB_ABS = `node ${PROJECT}/scripts/nb.cjs`;
const JEST_CFG = process.env.P66_JEST_CONFIG || "jest.config.cjs";
const JEST_SMOKE = process.env.P66_JEST_SMOKE_PATH || "";
const ULTRA_SOFT = process.env.P66_ULTRA_SOFT || "1"; // default to soft during execution

function loadPlan(){ if(!fs.existsSync(PLAN)) throw new Error("Missing plan JSON: "+PLAN); return JSON.parse(fs.readFileSync(PLAN,'utf8')); }
function findPatch(p){ const p1=path.join(PRIMARY,p); if(fs.existsSync(p1)) return p1; const p2=path.join(FALLBACK,p); if(fs.existsSync(p2)) return p2; throw new Error("Patch not found: "+p); }
function loadJson(fp){ return JSON.parse(fs.readFileSync(fp,'utf8')); }

function normalizeNbPath(line){
  if (!line) return line; let s = String(line);
  const variants = [
    /(?:^|\s)node\s+\.?\/?scripts\/nb\.cjs\b/gi,
    /(?:^|\s)node\s+"\.?\/?scripts\/nb\.cjs"\b/gi,
    /(?:^|\s)node\s+'\.?\/?scripts\/nb\.cjs'\b/gi,
    /bash\s+-lc\s+'node\s+\.?\/?scripts\/nb\.cjs/gi,
    /bash\s+-lc\s+"node\s+\.?\/?scripts\/nb\.cjs/gi,
    /(?:^|\s)node\s+\$?\{?PWD\}?(?:\/|\\)scripts\/nb\.cjs\b/gi,
    /(?:^|\s)\.\/scripts\/nb\.cjs\b/gi,
    /(?:^|\s)"\.\/scripts\/nb\.cjs"\b/gi,
    /(?:^|\s)'\.\/scripts\/nb\.cjs'\b/gi
  ];
  for (const rx of variants) s = s.replace(rx, NB_ABS);
  s = s.replace(/\bnode\s+node\s+/g, 'node ');
  return s;
}

function rewriteUltra(line){
  let s = String(line);
  if (s.includes('--label ultra-runtime')) {
    // Ensure NB TTL is sufficient
    s = s.replace(/--ttl\s+\d+[sm]/, '--ttl 600s');
    // Replace the bash -lc payload to call the ultra wrapper directly
    s = s.replace(/bash\s+-lc\s+'[^']*ultra-runtime-validation\.sh[^']*'/, `bash -lc 'node ${PROJECT}/scripts/tools/ultra-wrapper.cjs'`);
    // Inject soft env for ultra
    if (s.includes(NB_ABS) && !/P66_ULTRA_SOFT=/.test(s)) {
      s = s.replace(NB_ABS, `P66_ULTRA_SOFT=${ULTRA_SOFT} ${NB_ABS}`);
    }
  }
  return s;
}

function rewriteJest(line){
  let s = String(line);
  if (/\bnpx\s+jest\b/.test(s) && !/\s--config\s+/.test(s)) {
    s = s.replace(/\bnpx\s+jest\b/, `npx jest --config ${JEST_CFG}`);
  }
  if (JEST_SMOKE && /\bnpx\s+jest\b/.test(s) && !/\s--runTestsByPath\s+/.test(s)) {
    s = s.replace(/\bnpx\s+jest\b/, `npx jest --runTestsByPath ${JEST_SMOKE}`);
  }
  return s;
}

function rewriteRouteAssert(line){
  let s = String(line);
  // Prefer the ensured tools path for route-assert
  s = s.replace(/node\s+[^\s]*scripts\/(validation|tools)\/route-assert\.cjs/g, `node ${PROJECT}/scripts/tools/route-assert.cjs`);
  return s;
}

function rewriteLine(line){
  let s = String(line);
  s = normalizeNbPath(s);
  s = rewriteUltra(s);
  s = rewriteJest(s);
  s = rewriteRouteAssert(s);
  return s;
}

function mergeShell(j){
  const post = (((j||{}).postMutationBuild||{}).shell)||[];
  return [].concat(post).map(x => rewriteLine(x));
}

function runShell(cmd){
  const normalized = rewriteLine(cmd);
  const r = spawnSync("bash", ["-lc", normalized], { stdio:"inherit", cwd: PROJECT, env: { ...process.env, P66_JEST_CONFIG: JEST_CFG, P66_JEST_SMOKE_PATH: JEST_SMOKE, P66_ULTRA_SOFT: ULTRA_SOFT } });
  return r.status===0;
}
function readState(){ try{ return JSON.parse(fs.readFileSync(STATE,'utf8')); }catch{ return {completed:[],inProgress:null}; } }
function writeState(st){ fs.mkdirSync(path.dirname(STATE),{recursive:true}); fs.writeFileSync(STATE, JSON.stringify(st,null,2)); }

const plan = loadPlan(); const list = plan.executeInOrder || [];
if (mode === "plan"){ list.forEach((x,i)=>console.log(`${i+1}. ${x}`)); process.exit(0); }

const state = readState();
let start = 0;
if (mode === "resume") {
  if (state.inProgress) start = list.findIndex(x => x===state.inProgress);
  else if (state.completed?.length) start = state.completed.length;
}

for (let i=start; i<list.length; i++){
  const name = list[i]; const fp = findPatch(name); const shell = mergeShell(loadJson(fp));
  console.log(`\n=== P6.6 EXEC (${i+1}/${list.length}) :: ${name} ===\n`);
  writeState({completed: state.completed||[], inProgress: name, ts:new Date().toISOString()});
  for (const cmd of shell){
    if (!runShell(cmd)){
      console.error(`FAILED step in: ${name}`);
      writeState({completed: state.completed||[], inProgress: name, failedAt: cmd, failedTs: new Date().toISOString()});
      process.exit(2);
    }
  }
  state.completed = (state.completed||[]).concat([name]);
  writeState({completed: state.completed, inProgress: null, ts: new Date().toISOString()});
}
console.log("P6.6 execution complete."); process.exit(0);


