const fs = require('fs');
const path = require('path');

function fixDuplicateTokens(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const fixedLines = [];
    let foundFirstTokens = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (trimmedLine === 'const { tokens } = useTheme();') {
        if (!foundFirstTokens) {
          fixedLines.push(line);
          foundFirstTokens = true;
        }
        // Skip duplicate lines
      } else {
        fixedLines.push(line);
      }
    }
    
    const fixedContent = fixedLines.join('\n');
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findAndFixFiles(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixedCount += findAndFixFiles(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixDuplicateTokens(filePath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

// Start from src directory
const srcDir = path.join(__dirname, '..', 'src');
console.log('Searching for duplicate tokens declarations...');
const fixedFiles = findAndFixFiles(srcDir);
console.log(`Fixed ${fixedFiles} files with duplicate tokens declarations.`); 