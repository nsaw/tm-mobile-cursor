#!/usr/bin/env node
'use strict';
// Robust migrator for */.cursor/rules/** files, converting timeout ... & disown -> nb.cjs
const fs = require('fs');
const path = require('path');

const root = process.argv[2] || path.resolve(__dirname, '..', '..');
const out = path.join(root, 'validations', 'migration-rules-report.md');

function listRuleFiles(base) {
  const results = [];
  function walk(d) {
    let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        // Recurse; capture any path ending in .cursor/rules
        if (e.name === '.cursor') {
          const rulesPath = path.join(p, 'rules');
          if (fs.existsSync(rulesPath)) walk(rulesPath);
        }
        walk(p);
      } else if (/\.(mdc|md|json|yaml|yml|rules)$/i.test(e.name)) {
        if (p.includes(`${path.sep}.cursor${path.sep}rules${path.sep}`)) results.push(p);
      }
    }
  }
  walk(base);
  return results;
}

// Regex catches variations including braces/nohup/redirs and gtimeout
const RE_ANY = /(\{[^\n]*?\}\s*&\s*)?(?:nohup\s+)?(?:g?timeout)\s+([^\n]*?)\s*&\s*disown\b/i;

function toNB(cmd) {
  // cmd is the part after timeout (e.g., "30s yarn test" OR just "yarn test")
  let ttl = '30s';
  let rest = cmd.trim();
  const m = rest.match(/^(\d+(?:s|m|h))\s+(.+)$/);
  if (m) { ttl = m[1]; rest = m[2]; }
  const firstTok = (rest.split(/\s+/)[0] || 'task').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 24) || 'task';
  return `node scripts/nb.cjs --ttl ${ttl} --label ${firstTok} --log validations/logs/${firstTok}.log --status validations/status -- ${rest}`;
}

function migrateFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split(/\r?\n/);
  let changed = 0;
  const out = lines.map((ln) => {
    const m = ln.match(RE_ANY);
    if (!m) return ln;
    const cmd = m[2] || '';
    const indent = (ln.match(/^\s*/) || [''])[0];
    const nb = toNB(cmd);
    changed++;
    // Replace the entire matched region with the nb command
    return indent + ln.replace(RE_ANY, nb);
  }).join('\n');
  if (changed) fs.writeFileSync(file, out);
  return changed;
}

const files = listRuleFiles(root);
const changes = [];
let total = 0;
for (const f of files) {
  const c = migrateFile(f);
  if (c) { total += c; changes.push({ file: f, count: c }); }
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, ['# .cursor/rules migration (timeout → nb.cjs)', '', `Root: ${root}`, '', ...changes.map(c => `- ${c.file}: ${c.count} replacement(s)`), '', `Total replacements: ${total}`].join('\n'));
console.log(`Rules migration complete. Files changed: ${changes.length}, replacements: ${total}. Report: ${out}`);
process.exit(0);
