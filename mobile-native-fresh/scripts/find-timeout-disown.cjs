#!/usr/bin/env node
'use strict';
// Self-contained scanner to avoid any nested spawns. CJS-compatible.
const fs = require('fs');
const path = require('path');

const repoRoot = process.argv[2] || path.resolve(__dirname, '..');
const outDir = path.join(repoRoot, 'validations');
const outFile = path.join(outDir, 'migration-report.md');

const IGNORE = new Set(['node_modules', '.git', 'build', 'dist', '.expo', '.next', 'ios/build', 'android/build', 'ios/Pods', '.turbo', '.cache']);
const FILE_EXTS = new Set(['.js', '.cjs', '.mjs', '.ts', '.tsx', '.json', '.md', '.sh', '.zsh', '.yaml', '.yml', '.rules']);

// Match common forms: timeout/gtimeout ... & disown (with or without braces/nohup/redirections)
const RE = /\b(?:g?timeout)\b[^\n]*?&\s*disown\b/i;

const hits = [];
function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const ent of entries) {
    if (IGNORE.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    try {
      const st = fs.lstatSync(p);
      if (st.isSymbolicLink()) continue;
      if (st.isDirectory()) { walk(p); continue; }
      const ext = path.extname(ent.name).toLowerCase();
      if (!FILE_EXTS.has(ext)) continue;
      const text = fs.readFileSync(p, 'utf8');
      const lines = text.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const ln = lines[i];
        if (RE.test(ln)) hits.push({ file: p, line: i + 1, code: ln.trim() });
      }
    } catch { /* ignore unreadable */ }
  }
}

walk(repoRoot);
fs.mkdirSync(outDir, { recursive: true });
const md = ['# Timeout + disown occurrences', '', `Root: ${repoRoot}`, '', ...hits.map(h => `- ${h.file}:${h.line}: \`${h.code}\``)].join('\n');
fs.writeFileSync(outFile, md);
console.log(`Wrote report: ${outFile} (hits=${hits.length})`);
