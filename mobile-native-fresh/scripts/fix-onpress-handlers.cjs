const fs = require('fs');
const path = require('path');

function fixOnPressHandlers(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fixedContent = content;

    // Fix corrupted onPress/onPressIn/onPressOut handlers
    // Pattern: onPress={... = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> functionCall()}
    // Should be: onPress={() => functionCall()} accessibilityRole="button" accessible={true} accessibilityLabel="Button"
    const handlerPattern = /(onPress(?:In|Out)?=)\{\(.*?\) = accessibilityRole="button" accessible=\{true\} accessibilityLabel="Button"> ([^}]+)\}/g;
    fixedContent = fixedContent.replace(handlerPattern, (match, handler, fn) => {
      return `${handler}{() => ${fn}} accessibilityRole="button" accessible={true} accessibilityLabel="Button"`;
    });

    // Fix corrupted navigation or function calls with accessibility props inside
    // Pattern: navigation.navigate(...) accessibilityRole="button" ...
    // Should be: navigation.navigate(...), then accessibility props as separate
    const navPattern = /(onPress(?:In|Out)?=\{\(.*?\) => [^}]+\}) accessibilityRole="button" accessible=\{true\} accessibilityLabel="Button"/g;
    fixedContent = fixedContent.replace(navPattern, (match, handler) => {
      return `${handler} accessibilityRole="button" accessible={true} accessibilityLabel="Button"`;
    });

    // Fix object literal with accessibility props appended
    // Pattern: { ... } accessibilityRole="button" ...
    // Should be: { ... }, then accessibility props as separate
    const objPattern = /(\{[^}]+\}) accessibilityRole="button" accessible=\{true\} accessibilityLabel="Button"/g;
    fixedContent = fixedContent.replace(objPattern, (match, obj) => {
      return `${obj} accessibilityRole="button" accessible={true} accessibilityLabel="Button"`;
    });

    // Remove accessibility props from inside object literals (e.g. { text: 'Cancel', ... accessibilityRole: ... })
    fixedContent = fixedContent.replace(/,?\s*accessibilityRole:\s*['"][^'"]+['"],?/g, '');
    fixedContent = fixedContent.replace(/,?\s*accessible:\s*(true|false),?/g, '');
    fixedContent = fixedContent.replace(/,?\s*accessibilityLabel:\s*['"][^'"]+['"],?/g, '');

    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed onPress handlers in: ${filePath}`);
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
    if (dir === path.resolve(__dirname, '..', 'src') && file === 'reference') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixedCount += findAndFixFiles(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixOnPressHandlers(filePath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

// Run 3 passes
const srcDir = path.join(__dirname, '..', 'src');
for (let i = 1; i <= 3; i++) {
  console.log(`Pass ${i}: Searching for corrupted onPress handlers...`);
  const fixedFiles = findAndFixFiles(srcDir);
  console.log(`Pass ${i}: Fixed onPress handlers in ${fixedFiles} files.`);
  if (fixedFiles === 0) break;
} 