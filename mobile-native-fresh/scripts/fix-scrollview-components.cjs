#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixScrollViewComponents(file) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // ScrollView props that indicate this should be a ScrollView, not AutoRoleView
  const scrollViewProps = [
    'horizontal',
    'showsHorizontalScrollIndicator',
    'showsVerticalScrollIndicator',
    'contentContainerStyle',
    'keyboardShouldPersistTaps',
    'snapToInterval',
    'decelerationRate',
    'refreshControl',
    'onScroll',
    'scrollEventThrottle'
  ];
  
  // Check if AutoRoleView has ScrollView props
  const hasScrollViewProps = scrollViewProps.some(prop => 
    content.includes(`<AutoRoleView`) && content.includes(`${prop}=`)
  );
  
  if (hasScrollViewProps) {
    console.log(`Fixing ScrollView in: ${file}`);
    
    // Replace AutoRoleView with ScrollView for components that have ScrollView props
    content = content.replace(/<AutoRoleView/g, '<ScrollView');
    content = content.replace(/<\/AutoRoleView>/g, '</ScrollView>');
    
    // Add ScrollView import if not present
    if (!content.includes('import { ScrollView')) {
      const importRegex = /import\s+\{[^}]*\}\s+from\s+['"]react-native['"];?/;
      const match = content.match(importRegex);
      if (match) {
        const importLine = match[0];
        if (!importLine.includes('ScrollView')) {
          const newImport = importLine.replace('}', ', ScrollView }');
          content = content.replace(importLine, newImport);
        }
      }
    }
    
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ScrollView in: ${file}`);
  }
  
  return changed;
}

function main() {
  const files = glob.sync('src/**/*.{tsx,ts}', { cwd: process.cwd() });
  let changedFiles = 0;
  
  files.forEach(file => {
    if (fixScrollViewComponents(file)) {
      changedFiles++;
    }
  });
  
  console.log(`\nFixed ScrollView components in ${changedFiles} files`);
}

if (require.main === module) {
  main();
} 