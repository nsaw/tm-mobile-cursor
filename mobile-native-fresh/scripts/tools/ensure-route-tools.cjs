#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PROJECT = "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const toolsDir = path.join(PROJECT, 'scripts', 'tools');
fs.mkdirSync(toolsDir, { recursive: true });

const routeAssertPath = path.join(toolsDir, 'route-assert.cjs');

const routeAssertSource = `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PROJECT = ${JSON.stringify(PROJECT)};
const navDir = path.join(PROJECT, 'src-nextgen', 'navigation');
const screensDir = path.join(PROJECT, 'src-nextgen', 'screens');
const outFile = '/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/route-assert.json';

function listFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...listFilesRecursive(p)); else files.push(p);
  }
  return files;
}

function readFileSafe(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }

function resolveScreenImport(importPath, fromFile) {
  let abs;
  if (importPath.startsWith('.')) abs = path.resolve(path.dirname(fromFile), importPath);
  else if (importPath.startsWith('..')) abs = path.resolve(path.dirname(fromFile), importPath);
  else if (importPath.includes('/screens/')) abs = path.join(PROJECT, 'src-nextgen', importPath);
  else return null;

  const candidates = [abs + '.tsx', abs + '.ts', abs, path.join(abs, 'index.tsx'), path.join(abs, 'index.ts')];
  for (const c of candidates) { if (fs.existsSync(c)) return c; }
  return null;
}

function collect() {
  const navFiles = listFilesRecursive(navDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  const missing = [];
  let okCount = 0;
  for (const nf of navFiles) {
    const src = readFileSafe(nf);
    const re = /import\s+\{?\s*([A-Za-z0-9_,\s]+)\s*\}?\s+from\s+['\"]([^'\"]+)['\"]/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      const from = m[2];
      if (!from.includes('/screens/')) continue;
      const target = resolveScreenImport(from, nf);
      if (target) okCount++; else missing.push({ navigator: path.relative(PROJECT, nf), importFrom: from });
    }
  }
  return { okCount, missing };
}

const { okCount, missing } = collect();
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ generatedAt: new Date().toISOString(), okCount, missingCount: missing.length, missing }, null, 2));

if (missing.length) { console.error('Route assert failed:', missing.length); process.exit(3); }
console.log('Route assert PASS. okCount=', okCount);
`;

if (!fs.existsSync(routeAssertPath)) {
  fs.writeFileSync(routeAssertPath, routeAssertSource);
  try { fs.chmodSync(routeAssertPath, 0o755); } catch {}
  process.stdout.write(`created: ${routeAssertPath}\n`);
} else {
  process.stdout.write(`exists: ${routeAssertPath}\n`);
}

console.log('ensure-route-tools complete');


