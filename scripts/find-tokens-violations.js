const fs = require('fs');
const path = require('path');

function walk(dir, ext, fileList = []) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full, ext, fileList);
    else if (full.endsWith(ext)) fileList.push(full);
  });
  return fileList;
}

function isAtModuleScope(lines, idx) {
  // Crude check: is it before first "function" or "=>" or "export const"
  for (let i = idx - 1; i >= 0; --i) {
    const l = lines[i].trim();
    if (l.startsWith('function') || l.includes('=>') || l.startsWith('export const')) return false;
    if (l.length > 0 && !l.startsWith('import') && !l.startsWith('//')) break;
  }
  return true;
}

const files = walk('./src', '.ts')
  .concat(walk('./src', '.tsx'));

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const indices = lines.map((l, i) => l.includes('const { tokens } = useTheme()') ? i : -1).filter(i => i !== -1);

  if (indices.length > 1) {
    console.log(`[MULTIPLE DECLARATIONS] ${file}: ${indices.length} found`);
    indices.forEach(idx => console.log(`  Line ${idx+1}: ${lines[idx].trim()}`));
  }
  for (const idx of indices) {
    if (isAtModuleScope(lines, idx)) {
      console.log(`[MODULE SCOPE] ${file}: Line ${idx+1} is likely at module scope`);
    }
  }
}


