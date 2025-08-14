#!/usr/bin/env node
const fs = require('fs'); const path = require('path');
const PRIMARY="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions";
const FALLBACK="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6";
const PROJECT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const NB=`node ${PROJECT}/scripts/nb.cjs`;
const forbid=/(\$!|\bdisown\b|tail\s+-f|\{\s*.*\s*\}&|\btimeout\b|\bwatch\b|\bfg\b|\blsof\b|\bps\b|\bgrep\b)/i;
function locate(n){ const a=path.join(PRIMARY,n), b=path.join(FALLBACK,n); if(fs.existsSync(a)) return a; if(fs.existsSync(b)) return b; throw new Error("not found:"+n); }
const name=(process.argv.find(x=>x.startsWith("--patch="))?.split("=")[1])||process.argv[2];
if(!name){ console.error("Usage: verify-p66-patch-post-only.cjs --patch <filename.json>"); process.exit(2); }
const fp=locate(name);
let j; try{ j=JSON.parse(fs.readFileSync(fp,'utf8')); }catch(err){ console.error('JSON parse error:', err.message); process.exit(3); }
const keys=Object.keys(j||{});
const shell=(((j||{}).postMutationBuild||{}).shell)||[];
const status = {
  onlyPost: (!keys.includes('preMutationBuild') && !keys.includes('mutations') && shell.length>0),
  allNB: shell.every(s=>String(s).includes(NB)),
  absPaths: shell.every(s=>String(s).includes('/Users/sawyer/gitSync/')),
  noForbidden: shell.every(s=>!forbid.test(String(s)))
};
const ok = status.onlyPost && status.allNB && status.absPaths && status.noForbidden;
const out="/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/p66-552-verify.report.json";
fs.writeFileSync(out, JSON.stringify({file:fp,status,ok,ts:new Date().toISOString()},null,2));
console.log("verified:", fp, ok ? "OK" : "FAIL", "report:", out);
process.exit(ok?0:3);


