#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PROJECT = "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const navDir = path.join(PROJECT, 'src-nextgen', 'navigation');
const screensDir = path.join(PROJECT, 'src-nextgen', 'screens');
const outFile = '/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/route-assert.json';
const EXTS = ['.tsx', '.ts', '/index.tsx', '/index.ts'];

function listFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...listFilesRecursive(p)); else if (/\.(tsx?|jsx?)$/.test(p)) files.push(p);
  }
  return files;
}

function readFileSafe(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }

function resolveScreenImport(importPath, fromFile) {
  let abs;
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    abs = path.resolve(path.dirname(fromFile), importPath);
  } else if (importPath.startsWith('src-nextgen/')) {
    abs = path.join(PROJECT, importPath);
  } else if (importPath.includes('/screens/')) {
    abs = path.join(PROJECT, 'src-nextgen', importPath);
  } else {
    return '__external__';
  }

  for (const ext of EXTS) {
    const candidate = abs + ext;
    if (fs.existsSync(candidate)) return candidate;
  }
  return abs; // unresolved path for reporting
}

function collect() {
  const navFiles = listFilesRecursive(navDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  const missing = [];
  let okCount = 0;
  for (const nf of navFiles) {
    const src = readFileSafe(nf);
    const re = /import\s+(?:[\w\s,{}*\n]+)\s+from\s+['\"]([^'\"]+)['\"]/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      const from = m[1];
      const target = resolveScreenImport(from, nf);
      if (target === '__external__') continue;
      const exists = target && fs.existsSync(target);
      if (exists) okCount++; else missing.push({ navigator: path.relative(PROJECT, nf), importFrom: from, resolved: target });
    }
  }
  return { okCount, missing };
}

const { okCount, missing } = collect();
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ generatedAt: new Date().toISOString(), okCount, missingCount: missing.length, missing }, null, 2));

if (missing.length) { console.error('Route assert failed:', missing.length); process.exit(3); }
console.log('Route assert PASS. okCount=', okCount);
