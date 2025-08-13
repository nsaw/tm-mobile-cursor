// @ts-nocheck
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const TARGETS = [
  path.join(ROOT, 'tasks'),                 // BRAUN/GHOST patch payloads
  path.join(ROOT, 'src-nextgen', 'patches') // nextgen patches, if present
];
const FILE_RE = /\.(json|ya?ml|md|cjs|js|zsh|sh)$/i;
const EXPO_GROUP = /\([\s\S]*?lsof\s+-ti:8081[\s\S]*?npx\s+expo\s+start\s+--ios\s+--clear[\s\S]*?\)/g;
const HINT = 'scripts/admin/safe-launch-expo.sh || true';

let changed = [];
const walk = (d) => {
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d, { withFileTypes: true }).flatMap(ent => {
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) return walk(p);
    if (FILE_RE.test(ent.name)) return [p];
    return [];
  });
};

for (const base of TARGETS) {
  for (const f of walk(base)) {
    let txt = fs.readFileSync(f, 'utf8');
    const before = txt;
    // Replace any inline Expo group with safe launcher
    txt = txt.replace(EXPO_GROUP, HINT);
    // Also strip stray 'disown $PID' and '$!' artifacts if any survived
    txt = txt.replace(/\bdisown\b[^\n]*/g, '# replaced by safe-launch-expo');
    txt = txt.replace(/\$\!/g, '# replaced: $! (unsafe in user shells)');
    if (txt !== before) {
      fs.writeFileSync(f, txt);
      changed.push(f);
    }
  }
}

const outDir = path.join(ROOT, 'validations', 'logs');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'sweep-legacy-launchers.changed.txt'), changed.join('\n'));
