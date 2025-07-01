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
  if (lower.includes('content')) return { role: 'main', accessibilityRole: 'none' };
  if (lower.includes('wrapper')) return { role: 'group', accessibilityRole: 'none' };
  // Default: ambiguous
  report.push({ file, line, reason: 'Ambiguous role for View-like component' });
  return null;
}

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  let lines = content.split('\n');
  let newLines = [];

  // Check if file imports View-like components from react-native
  const hasReactNativeImport = content.includes('from \'react-native\'') || content.includes('from "react-native"');
  const hasViewLikeImport = COMPONENTS.some(comp => content.includes(comp));
  
  if (!hasReactNativeImport || !hasViewLikeImport) {
    return false;
  }

  // Add AutoRoleView import if not present
  if (!content.includes('AutoRoleView')) {
    // Find the last import line
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('import ')) {
        lastImportIdx = i;
      }
    }
    
    if (lastImportIdx !== -1) {
      const importPath = file.includes('/features/') ? AUTO_ROLEVIEW_IMPORT_ALT : AUTO_ROLEVIEW_IMPORT;
      lines.splice(lastImportIdx + 1, 0, importPath);
      changed = true;
    }
  }

  // Replace eligible components
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Skip if already AutoRoleView or custom wrapper
    if (line.includes('<AutoRoleView') || line.includes('as={AutoRoleView}')) {
      newLines.push(line);
      continue;
    }
    
    // Skip if already has role/accessibilityRole
    if (line.includes('role=') || line.includes('accessibilityRole=')) {
      report.push({ file, line: i + 1, reason: 'Skipped: already has role/accessibilityRole' });
      newLines.push(line);
      continue;
    }
    
    // Replace opening tags
    let modifiedLine = line;
    COMPONENTS.forEach(component => {
      const openTagRegex = new RegExp(`<${component}([\\s>])`, 'g');
      modifiedLine = modifiedLine.replace(openTagRegex, (match, after) => {
        const props = getAutoRoleProps(line, file);
        if (props) {
          changed = true;
          return `<AutoRoleView role="${props.role}" accessibilityRole="${props.accessibilityRole}"${after}`;
        } else {
          changed = true;
          return `<AutoRoleView${after}`;
        }
      });
      
      // Replace closing tags
      const closeTagRegex = new RegExp(`</${component}>`, 'g');
      modifiedLine = modifiedLine.replace(closeTagRegex, '</AutoRoleView>');
    });
    
    newLines.push(modifiedLine);
  }

  if (changed) {
    fs.writeFileSync(file, newLines.join('\n'), 'utf8');
  }
  return changed;
}

function main() {
  const files = glob.sync('src/**/*.{tsx,ts}', { cwd: process.cwd() });
  let changedFiles = 0;
  
  console.log(`Scanning ${files.length} files for View-like components...`);
  
  files.forEach(file => {
    if (processFile(file)) {
      changedFiles++;
      console.log(`Modified: ${file}`);
    }
  });
  
  fs.writeFileSync('/tmp/auto-roleview-report.json', JSON.stringify(report, null, 2));
  console.log(`\nAutoRoleView mapping complete. Changed files: ${changedFiles}`);
  console.log(`Ambiguous/skipped tags logged to /tmp/auto-roleview-report.json`);
  console.log(`Report entries: ${report.length}`);
}

if (require.main === module) {
  main();
} 