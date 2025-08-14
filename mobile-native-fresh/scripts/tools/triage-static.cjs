// @ts-nocheck
const fs = require('fs'), path = require('path');
const ROOT = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh';
const LOG_DIR = path.join(ROOT, 'validations', 'logs');
const OUT_DIR = path.join(ROOT, 'validations', 'verify');
fs.mkdirSync(OUT_DIR, { recursive: true });
const tscLog = path.join(LOG_DIR, 'tsc.log');
const eslLog = path.join(LOG_DIR, 'eslint.log');

function parseTS(lines) {
  const errs = [];
  for (const ln of lines) {
    const m = ln.match(/(\/.*\.(ts|tsx))\((\d+),(\d+)\):\s+error\s+TS(\d+):\s+(.*)$/);
    if (m) errs.push({ file: m[1], line: +m[3], col: +m[4], code: `TS${m[5]}`, msg: m[6] });
  }
  return errs;
}
function parseESLint(lines) {
  const errs = [];
  for (const ln of lines) {
    const m = ln.match(/(\/.*\.(ts|tsx)):(\d+):(\d+):\s+(error|warning)\s+(.*)$/i);
    if (m) errs.push({ file: m[1], line: +m[3], col: +m[4], level: m[5].toLowerCase(), msg: m[6] });
  }
  return errs;
}

const tscLines = fs.existsSync(tscLog) ? fs.readFileSync(tscLog, 'utf8').split('\n') : [];
const eslLines = fs.existsSync(eslLog) ? fs.readFileSync(eslLog, 'utf8').split('\n') : [];
const triage = { ts: parseTS(tscLines), eslint: parseESLint(eslLines) };

fs.writeFileSync(path.join(OUT_DIR, 'static-triage.json'), JSON.stringify(triage, null, 2));
const md = ['# Static Triage', `TS errors: ${triage.ts.length}`, `ESLint findings: ${triage.eslint.length}`, ''];
const sample = [...triage.ts.slice(0, 10), ...triage.eslint.slice(0, 10)];
for (const s of sample) md.push(`- ${s.file}:${s.line}:${s.col} — ${s.msg}`);
fs.writeFileSync(path.join(OUT_DIR, 'static-triage.md'), md.join('\n'));
console.log(`Wrote triage to ${path.join(OUT_DIR, 'static-triage.json')}`);



