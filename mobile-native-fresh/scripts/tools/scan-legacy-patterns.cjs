// @ts-nocheck
const fs=require('fs'), path=require('path');
const args=process.argv.slice(2);
const get=(k,d=null)=>{const i=args.indexOf(k);return i>=0?args[i+1]:d;};
const ROOT=get('--dir','');
if(!ROOT||!fs.existsSync(ROOT)){console.error('Missing/invalid --dir');process.exit(64);} 
const FILE_RE=/\.(cjs|js|mjs|sh|zsh|ts|tsx)$/i; // exclude docs and json to avoid false positives
const BAD=[
  /\bdisown\b/i, /\$\!/g, /\btail\s+-[Ff]\b/i, /\bg?timeout\s+\d+[smh]?/i,
  /\{\s*[^}]*\}\s*&/i, /\([^)]+\)\s*&/i, /\bgrep\b/i, /\bps\s+aux\b/i, /\bsleep\b/i, /\bfg\b/i,
  /\bwatch\b/i, /(^|\s)read(\s|$)/i, /\byes\s*\|/i, /\bnc\s+-l\b/i, /\bnetcat\b.*\b-l\b/i,
  /\blsof\s+-ti:8081\b/i, /\bpgrep\b/i, /\bpkill\b/i, /\bkillall\b/i, /xcrun\s+simctl\s+.*\blog\s+stream\b/i
];
const IGNORE_DIRS=new Set(['node_modules','.git','validations','logs','artifacts','.expo','.expo-shared','scripts/.mypy_cache']);
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{const p=path.join(d,e.name);if(e.isDirectory()){if(IGNORE_DIRS.has(e.name))return [];return walk(p);}return FILE_RE.test(e.name)?[p]:[];});
const files=walk(ROOT); const hits=[];
for(const f of files){ const t=fs.readFileSync(f,'utf8'); if(BAD.some(re=>re.test(t))) hits.push(f); }
if(hits.length){ console.error(`❌ Blocking/legacy patterns in ${hits.length} file(s):`); console.error(hits.slice(0,500).join('\n')); process.exit(2); }
console.log('✅ Clean.');

// @ts-nocheck
/**
 * scan-legacy-patterns.cjs
 * Usage: node scripts/tools/scan-legacy-patterns.cjs --dir "<ABS_PATH>"
 * Scans for legacy patterns: disown, $!, raw timeout, tail -f, brace groups,
 * and bare 'grep' tokens in executable/script-like files (not docs).
 */
const fs = require('fs'); const path = require('path');
const args = process.argv.slice(2);
const get = (k, d=null) => { const i=args.indexOf(k); return i>=0 ? args[i+1] : d; };
const ROOT = get('--dir', '');
if (!ROOT || !fs.existsSync(ROOT)) {
  console.error('Missing/invalid --dir path'); process.exit(64);
}
// Only scan executable/script-like files; exclude markdown/doc files
const FILE_RE = /\.(ya?ml|json|cjs|js|sh|zsh|ts|tsx)$/i;
const IGNORE_DIRS = new Set(['.archive', 'node_modules', '.git']);
const LEGACY = [
  /\bdisown\b/m, /\$\!/m, /\btail\s+-f\b/m,
  /\bg?timeout\s+\d+[smh]?/m, /\{\s*[^}]*\}\s*&/m,
  // grep: pipeline or start-of-line command; avoid matching mere mentions in text
  /(\|\s*grep\b|^\s*grep\b)/m
];
const walk = d => fs.readdirSync(d, { withFileTypes:true }).flatMap(ent => {
  const p=path.join(d, ent.name);
  if (ent.isDirectory()) {
    if (IGNORE_DIRS.has(ent.name)) return [];
    return walk(p);
  }
  if (FILE_RE.test(ent.name)) return [p];
  return [];
});
const files = walk(ROOT);
const hits = [];
for (const f of files) {
  let txt;
  try { txt = fs.readFileSync(f, 'utf8'); } catch { continue; }
  if (LEGACY.some(re => re.test(txt))) hits.push(f);
}
if (hits.length) {
  console.error(`❌ Legacy/bare-grep patterns detected in ${hits.length} file(s):`);
  console.error(hits.slice(0, 200).join('\n'));
  process.exit(2);
}
console.log('✅ No legacy/bare-grep patterns found.');
