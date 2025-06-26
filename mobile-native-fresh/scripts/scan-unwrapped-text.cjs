#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Patterns to match unwrapped text strings in JSX
const unwrappedTextPatterns = [
  // Text between JSX tags that's not wrapped in <Text>
  />\s*([^<>{}\n]+[a-zA-Z][^<>{}\n]*)\s*</g,
  // Text in JSX expressions that might be unwrapped
  /{\s*['"`]([^'"`]+)['"`]\s*}/g,
];

// Components that are already text-like
const textLikeComponents = [
  'Text', 'TextInput', 'Title', 'Paragraph', 'Caption', 'Label', 'Heading', 'Subheading', 'BodyText'
];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];

    lines.forEach((line, lineNumber) => {
      // Skip lines that are already text-like components
      if (textLikeComponents.some(comp => line.includes(`<${comp}`))) {
        return;
      }

      // Check for unwrapped text patterns
      unwrappedTextPatterns.forEach(pattern => {
        const matches = line.matchAll(pattern);
        for (const match of matches) {
          const text = match[1]?.trim();
          if (text && text.length > 0 && /[a-zA-Z]/.test(text)) {
            issues.push({
              line: lineNumber + 1,
              text: text,
              fullLine: line.trim()
            });
          }
        }
      });
    });

    return issues;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function scanDirectory(dir) {
  const files = [];
  
  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walkDir(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

// Main execution
const srcDir = path.join(__dirname, '..', 'src');
const tsxFiles = scanDirectory(srcDir);

console.log('Scanning for unwrapped text strings...\n');

let totalIssues = 0;
const filesWithIssues = [];

for (const file of tsxFiles) {
  const issues = scanFile(file);
  if (issues.length > 0) {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`\n${relativePath}:`);
    issues.forEach(issue => {
      console.log(`  Line ${issue.line}: "${issue.text}"`);
      console.log(`    ${issue.fullLine}`);
    });
    totalIssues += issues.length;
    filesWithIssues.push({ file: relativePath, issues });
  }
}

console.log(`\nTotal issues found: ${totalIssues}`);
console.log(`Files with issues: ${filesWithIssues.length}`);

if (totalIssues > 0) {
  process.exit(1);
} else {
  console.log('No unwrapped text strings found!');
} 