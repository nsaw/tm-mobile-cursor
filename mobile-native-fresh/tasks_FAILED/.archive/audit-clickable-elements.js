// scripts/audit-clickable-elements.js
const fs = require('fs');
const path = require('path');

const CLICKABLES = [
  'TouchableOpacity',
  'Pressable',
  'Button',
  'TouchableHighlight',
  'TouchableWithoutFeedback',
  'TouchableNativeFeedback'
];

const ACCESS_PROPS = [
  'accessibilityRole',
  'accessible',
  'accessibilityLabel'
];

function walk(dir, filter, fileList = []) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full, filter, fileList);
    else if (filter.test(full)) fileList.push(full);
  });
  return fileList;
}

function fileSummary(filename) {
  const text = fs.readFileSync(filename, 'utf8');
  const lines = text.split('\n');
  let clickableBlocks = [];
  let useThemeCount = 0;
  let duplicateTokensFound = false;

  // Detect duplicate tokens hook per function
  const tokenLines = lines
    .map((line, idx) => (line.includes('useTheme()') ? idx + 1 : -1))
    .filter(idx => idx !== -1);
  if (tokenLines.length > 1) {
    duplicateTokensFound = true;
  }

  // Basic clickable block scan
  CLICKABLES.forEach(Clickable => {
    let regex = new RegExp(`<${Clickable}([^>]*)>`, 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const propsText = match[1];
      // Find handlers and accessibility pro{ { { ps in prop string & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
      let handlerFound = /(onPress|onPressIn|onPressOut)=\{([^\}]+)\}/.test(propsText);
      let handlerValue = propsText.match(/(onPress|onPressIn|onPressOut)=\{([^\}]+)\}/);
      let accessMissing = ACCESS_PROPS.filter(p => !propsText.includes(p));
      // Look for accessibility pro{ { { ps in handler (illegal) & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
      let illegalAccessInHandler = /\(\)\s*=>\s*[^}]*accessibilityRole/.test(propsText);

      clickableBlocks.push({
        element: Clickable,
        handlerFound,
        handlerValue: handlerValue ? handlerValue[2].trim() : null,
        accessMissing,
        illegalAccessInHandler
      });
    }
  });

  // Navigation check: are there any navigation.navigate calls with string literals?
  const navRouteRegex = /navigation\.navigate\(([^)]+)\)/g;
  let navIssues = [];
  let match;
  while ((match = navRouteRegex.exec(text)) !== null) {
    let routeArg = match[1].trim();
    // This can be improved by matching against your route manifest if needed
    if (routeArg.startsWith("'") || routeArg.startsWith('"')) {
      navIssues.push(`Hardcoded string route: ${routeArg}`);
    }
    if (routeArg === '' || routeArg === 'undefined') {
      navIssues.push(`Undefined or empty route: ${routeArg}`);
    }
  }

  // Report
  return {
    filename,
    duplicateTokensFound,
    clickableBlocks,
    navIssues,
  };
}

// --- MAIN ---
const files = walk(path.resolve(__dirname, '../src'), /\.tsx$/);
let totalClickables = 0, filesWithIssues = 0;

files.forEach(file => {
  const summary = fileSummary(file);
  let hasIssue = false;
  if (summary.duplicateTokensFound) {
    console.log(`❌ [${file}] Duplicate useTheme() hooks found in same scope. Fix!`);
    hasIssue = true;
  }
  summary.clickableBlocks.forEach((block, idx) => {
    totalClickables++;
    if (!block.handlerFound) {
      console.log(`❌ [${file}] <${block.element} #${idx+1}>: Missing onPress/onPressIn/onPressOut handler.`);
      hasIssue = true;
    }
    if (block.accessMissing.length > 0) {
      console.log(`❌ [${file}] <${block.element} #${idx+1}>: Missing accessibility props: ${block.accessMissing.join(', ')}`);
      hasIssue = true;
    }
    if (block.illegalAccessInHandler) {
      console.log(`❌ [${file}] <${block.element} #${idx+1}>: Accessibility pro{ { { ps must NOT be set inside handler!`) & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
      hasIssue = true;
    }
  });
  summary.navIssues.forEach(issue => {
    console.log(`❌ [${file}] NAVIGATION: ${issue}`);
    hasIssue = true;
  });
  if (hasIssue) filesWithIssues++;
});

console.log('\n==== Clickable Element Audit Summary ====');
console.log(`Scanned: ${files.length} files`);
console.log(`Clickables found: ${totalClickables}`);
console.log(`Files with issues: ${filesWithIssues}`);
console.log('Done.\n');

if (filesWithIssues > 0) {
  process.exitCode = 1;
}

