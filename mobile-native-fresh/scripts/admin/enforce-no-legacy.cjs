// @ts-nocheck
const fs = require('fs');
const path = require('path');

const ROOT_MAIN = '/Users/sawyer/gitSync/tm-mobile-cursor';
const ROOT_APP  = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh';

const TARGETS = [
  path.join(ROOT_APP, 'tasks'),
  path.join(ROOT_APP, 'scripts'),
  path.join(ROOT_APP, 'src-nextgen', 'patches'),
  path.join(ROOT_MAIN, '.cursor', 'rules'),
].filter(p => fs.existsSync(p));

const FILE_RE = /\.(cjs|js|mjs|sh|zsh|ts|tsx)$/i; // exclude docs/json

// Known exemptions that contain controlled backgrounding patterns required by legacy tooling
const EXEMPT = new Set([
  path.join(ROOT_APP, 'scripts', 'admin', 'safe-launch-expo.sh')
]);

const BAD = [
  /\bdisown\b/i,
  /\$\!/g,
  /\btail\s+-[Ff]\b/i,
  /\bg?timeout\s+\d+[smh]?/i,
  /\{\s*[^}]*\}\s*&/i,   // brace group background
  /\([^)]+\)\s*&/i,       // subshell background
  /\bgrep\b/i,
  /\bps\s+aux\b/i,
  /\bsleep\b/i,
  /\bfg\b/i,
  /\bwatch\b/i,
  /(^|\s)read(\s|$)/i,
  /\byes\s*\|/i,
  /\bnc\s+-l\b/i,
  /\bnetcat\b.*\b-l\b/i,
  /\blsof\s+-ti:8081\b/i,
  /\bpgrep\b/i,
  /\bpkill\b/i,
  /\bkillall\b/i,
  /xcrun\s+simctl\s+.*\blog\s+stream\b/i
];

const IGNORE_DIRS = new Set(['node_modules','.git','validations','logs','artifacts','.expo','.expo-shared','scripts/.mypy_cache','tasks/summaries','.cursor/rules/.archive']);
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && IGNORE_DIRS.has(path.relative(ROOT_APP, full)) ) continue;
    if (EXEMPT.has(full)) continue;
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (FILE_RE.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

let hits = [];
for (const target of TARGETS) {
  const files = walk(target);
  for (const f of files) {
    const t = fs.readFileSync(f, 'utf8');
    if (BAD.some(re => re.test(t))) hits.push(f);
  }
}

if (hits.length) {
  console.error(`❌ Blocking/legacy patterns in ${hits.length} file(s):`);
  console.error(hits.slice(0, 500).join('\n'));
  process.exit(2);
}
console.log('✅ Clean.');
