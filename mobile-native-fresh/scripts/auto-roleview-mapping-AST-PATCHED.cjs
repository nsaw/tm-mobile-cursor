// AST-based AutoRoleView mapping scaffold

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const COMPONENTS = [
  'View',
  'ScrollView',
  'SafeAreaView',
  'SectionList',
  'FlatList',
];

const AUTO_ROLEVIEW_IMPORT = `import { AutoRoleView } from '../components/ui/AutoRoleView';`;
const AUTO_ROLEVIEW_IMPORT_ALT = `import { AutoRoleView } from '../../components/ui/AutoRoleView';`;

const report = [];

function getAutoRoleProps(line, file) {
  // Heuristic: If className or style contains 'card', 'section', 'container', 'header', etc.
  const lower = line.toLowerCase();
  if (lower.includes('card')) return { role: 'card', accessibilityRole: 'summary' };
  if (lower.includes('section')) return { role: 'region', accessibilityRole: 'summary' };
  if (lower.includes('header')) return { role: 'header', accessibilityRole: 'header' };
  if (lower.includes('container')) return { role: 'group', accessibilityRole: 'none' };
  if (lower.includes('list')) return { role: 'list', accessibilityRole: 'list' };
  if (lower.includes('footer')) return { role: 'contentinfo', accessibilityRole: 'none' };
  // Default: ambiguous
  report.push({ file, line, reason: 'Ambiguous role for View-like component' });
  return null;
}

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  let importAdded = false;
  let lines = content.split('\n');
  let newLines = [];

  // Only operate on files that import View-like components
  const importRegex = new RegExp(`import\s+\{([^}]+)\}\s+from ['\"]react-native['\"];?`);
  let importLineIdx = -1;
  lines.forEach((line, idx) => {
    if (importRegex.test(line)) importLineIdx = idx;
  });
  if (importLineIdx === -1) return false;

  // Add AutoRoleView import if not present
  if (!content.includes('AutoRoleView')) {
    // Try to guess correct import path
    const importPath = file.includes('/features/') ? AUTO_ROLEVIEW_IMPORT_ALT : AUTO_ROLEVIEW_IMPORT;
    lines.splice(importLineIdx + 1, 0, importPath);
    importAdded = true;
    changed = true;
  }

  // Replace eligible components
  const tagRegex = new RegExp(`<(${COMPONENTS.join('|')})([\s>])`, 'g');
  const closeTagRegex = new RegExp(`</(${COMPONENTS.join('|')})>`, 'g');

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    // Skip if already AutoRoleView or custom wrapper
    if (line.includes('<AutoRoleView') || line.includes('as={AutoRoleView}')) {
      newLines.push(line);
      continue;
    }
    // Replace opening tag
    let replaced = false;
    line = line.replace(tagRegex, (match, tag, after) => {
      // Heuristic: skip if pre-tagged or custom wrapper
      if (line.includes('role=') || line.includes('accessibilityRole=') || line.includes('as={')) {
        report.push({ file, line, reason: 'Skipped: already has role/accessibilityRole or custom as' });
        return match;
      }
      const props = getAutoRoleProps(line, file);
      if (props) {
        replaced = true;
        changed = true;
        return `<AutoRoleView role="${props.role}" accessibilityRole="${props.accessibilityRole}"${after}`;
      } else {
        replaced = true;
        changed = true;
        return `<AutoRoleView${after}`;
      }
    });
    // Replace closing tag
    line = line.replace(closeTagRegex, '</AutoRoleView>');
    newLines.push(line);
  }

  if (changed) {
    fs.writeFileSync(file, newLines.join('\n'), 'utf8');
  }
  return changed;
}

function main() {
  const files = glob.sync('src/**/*.{tsx,ts}', { cwd: process.cwd() });
  let changedFiles = 0;
  files.forEach(file => {
    if (processFile(file)) changedFiles++;
  });
  fs.writeFileSync('/tmp/auto-roleview-report.json', JSON.stringify(report, null, 2));
  console.log(`AutoRoleView mapping complete. Changed files: ${changedFiles}`);
  console.log(`Ambiguous/skipped tags logged to /tmp/auto-roleview-report.json`);
}

if (require.main === module) {
  main();
} 