#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixImportPaths(file) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Fix import paths based on file location
  if (file.includes('/components/ui/')) {
    // UI components should import from './AutoRoleView'
    content = content.replace(
      /import\s+\{\s*AutoRoleView\s*\}\s+from\s+['"]\.\.\/components\/ui\/AutoRoleView['"];?/g,
      "import { AutoRoleView } from './AutoRoleView';"
    );
    changed = true;
  } else if (file.includes('/features/')) {
    // Feature files should import from '../../../components/ui/AutoRoleView'
    content = content.replace(
      /import\s+\{\s*AutoRoleView\s*\}\s+from\s+['"]\.\.\/\.\.\/components\/ui\/AutoRoleView['"];?/g,
      "import { AutoRoleView } from '../../../components/ui/AutoRoleView';"
    );
    changed = true;
  } else if (file.includes('/navigation/')) {
    // Navigation files should import from '../components/ui/AutoRoleView'
    content = content.replace(
      /import\s+\{\s*AutoRoleView\s*\}\s+from\s+['"]\.\.\/components\/ui\/AutoRoleView['"];?/g,
      "import { AutoRoleView } from '../components/ui/AutoRoleView';"
    );
    changed = true;
  }
  
  // Fix ScrollView props that were incorrectly replaced
  const scrollViewProps = [
    'horizontal',
    'showsHorizontalScrollIndicator',
    'showsVerticalScrollIndicator',
    'contentContainerStyle',
    'keyboardShouldPersistTaps',
    'snapToInterval',
    'decelerationRate'
  ];
  
  scrollViewProps.forEach(prop => {
    const regex = new RegExp(`<AutoRoleView[^>]*\\s+${prop}=`, 'g');
    if (regex.test(content)) {
      console.log(`Found ScrollView prop '${prop}' in AutoRoleView in ${file}`);
      // This needs manual fixing - we'll revert these to ScrollView
    }
  });
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed imports in: ${file}`);
  }
  
  return changed;
}

function main() {
  const files = glob.sync('src/**/*.{tsx,ts}', { cwd: process.cwd() });
  let changedFiles = 0;
  
  files.forEach(file => {
    if (fixImportPaths(file)) {
      changedFiles++;
    }
  });
  
  console.log(`\nFixed import paths in ${changedFiles} files`);
  console.log('Note: Some ScrollView props may need manual fixing');
}

if (require.main === module) {
  main();
} 