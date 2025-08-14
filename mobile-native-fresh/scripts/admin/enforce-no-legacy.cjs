// @ts-nocheck
const fs = require('fs'), path = require('path');
const mm = (pat, str) => {
  const esc = s => s.replace(/[.+^${}()|[\]\\]/g,'\\$&');
  let rx = '^' + pat.split('**').map(p => esc(p).replace(/\*/g,'[^/]*')).join('.*') + '$';
  return new RegExp(rx).test(str);
};
const ROOT = '/Users/sawyer/gitSync/tm-mobile-cursor';
const LOG_DIR = path.join(ROOT, 'mobile-native-fresh', 'validations', 'logs');
const OUT_DIR = path.join(ROOT, 'mobile-native-fresh', 'validations', 'verify');
fs.mkdirSync(LOG_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// Args/env
const args = process.argv.slice(2);
const getArg = (k, d = null) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const cfgPath = getArg('--config', path.join(ROOT, 'mobile-native-fresh', 'scripts', 'admin', 'enforcer.config.json'));
const modeArg = getArg('--mode', null);
const envMode = process.env.ENFORCER_MODE || null;

const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const MODE = (modeArg || envMode || cfg.mode || 'warn').toLowerCase();
const targets = cfg.targets || [];
const ignoreDirs = new Set(cfg.ignoreDirs || []);
const exts = new Set((cfg.extensions || []).map(s => s.toLowerCase()));
const waives = (cfg.waiveFiles || []).map(String);

const FILE_RE = new RegExp(`\\.(${Array.from(exts).join('|')})$`, 'i');
const BAD = [
  /\bdisown\b/i, /\$\!/g, /\btail\s+-[Ff]\b/i,
  /\bg?timeout\s+\d+[smh]?/i, /\{\s*[^}]*\}\s*&/i, /\([^)]+\)\s*&/i,
  /\bgrep\b/i, /\bps\s+aux\b/i, /\bsleep\b/i, /\bfg\b/i,
  /\bwatch\b/i, /(^|\s)read(\s|$)/i, /\byes\s*\|/i,
  /\bnc\s+-l\b/i, /\bnetcat\b.*\b-l\b/i,
  /\blsof\s+-ti:8081\b/i, /\bpgrep\b/i, /\bpkill\b/i, /\bkillall\b/i,
  /xcrun\s+simctl\s+.*\blog\s+stream\b/i
];

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ignoreDirs.has(ent.name)) continue;
      out.push(...walk(p));
    } else {
      if (FILE_RE.test(ent.name)) out.push(p);
    }
  }
  return out;
};

const isWaived = (absPath) => waives.some(pat => mm(pat, absPath));

const files = targets.flatMap(walk);
const violations = [];
for (const f of files) {
  if (isWaived(f)) continue;
  let txt; try { txt = fs.readFileSync(f, 'utf8'); } catch { continue; }
  if (BAD.some(re => re.test(txt))) violations.push(f);
}

const jsonOut = path.join(OUT_DIR, 'enforce-no-legacy.violations.json');
const mdOut = path.join(OUT_DIR, 'enforce-no-legacy.violations.md');
fs.writeFileSync(jsonOut, JSON.stringify({ mode: MODE, count: violations.length, files: violations.slice(0, 1000) }, null, 2));
fs.writeFileSync(mdOut, ['# Enforcer Violations', `mode: ${MODE}`, `count: ${violations.length}`, '', ...violations.map(v => `- ${v}`)].join('\n'));

if (violations.length) {
  const msg = `Legacy/terminal-blocking patterns found in ${violations.length} file(s).`;
  if (MODE === 'error') { console.error(`❌ ${msg}`); process.exit(2); }
  console.warn(`⚠️ ${msg} (WARN mode)`);
} else {
  console.log('✅ Repo clean.');
}
