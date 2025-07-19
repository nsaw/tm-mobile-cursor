#!/usr/bin/env node

/**
 * Codemod script to refactor designTokens usage to useTheme()
 * Usage: node scripts/refactor-theme.js <file-or-directory>
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processFile(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Skip ThemeProvider.tsx
  if (filePath.includes("ThemeProvider.tsx")) {
    console.log("  Skipping ThemeProvider.tsx (allowed to use designTokens)");
    return;
  }

  // Remove designTokens imports
  const importRegex =
    /import\s*{\s*[^}]*designTokens[^}]*}\s*from\s*['"][^'"]*['"];?\s*\n?/g;
  if (importRegex.test(content)) {
    content = content.replace(importRegex, "");
    modified = true;
    console.log("  Removed designTokens import");
  }

  // Replace designTokens.* with tokens.* and wrap in getStyles function
  const designTokensRegex = /designTokens\.([a-zA-Z_][a-zA-Z0-9_]*)/g;
  if (designTokensRegex.test(content)) {
    // Check if we're in a component function
    const isInComponent =
      /export\s+(const|function)\s+\w+\s*[:=]\s*(React\.)?FC/.test(content);

    if (isInComponent) {
      // Add useTheme import if not present
      if (!content.includes("useTheme")) {
        const importMatch = content.match(
          /import\s+.*from\s+['"][^'"]*ThemeProvider['"]/,
        );
        if (importMatch) {
          content = content.replace(
            importMatch[0],
            importMatch[0].replace("}", ", useTheme }"),
          );
        } else {
          // Add new import
          const lastImport = content.lastIndexOf("import");
          const insertPos = content.indexOf("\n", lastImport) + 1;
          content =
            content.slice(0, insertPos) +
            "import { useTheme } from '../theme/ThemeProvider';\n" +
            content.slice(insertPos);
        }
      }

      // Add useTheme() call if not present
      if (!content.includes("const { tokens } = useTheme()")) {
        const componentMatch = content.match(
          /export\s+(const|function)\s+(\w+)\s*[:=]\s*(React\.)?FC/,
        );
        if (componentMatch) {
          const componentName = componentMatch[2];
          const componentStart = content.indexOf(
            `export ${componentMatch[1]} ${componentName}`,
          );
          const braceStart = content.indexOf("{", componentStart);
          const insertPos = content.indexOf("\n", braceStart) + 1;
          content =
            content.slice(0, insertPos) +
            "  const { tokens } = useTheme();\n\n" +
            content.slice(insertPos);
        }
      }

      // Replace designTokens.* with tokens.*
      content = content.replace(designTokensRegex, "tokens.$1");
      modified = true;
      console.log("  Replaced designTokens.* with tokens.*");
    } else {
      // For non-component files, wrap in getStyles function
      content = content.replace(designTokensRegex, (match, prop) => {
        return `getStyles(tokens).${prop}`;
      });

      // Add getStyles function if not present
      if (!content.includes("function getStyles(tokens)")) {
        const styleSheetMatch = content.match(
          /const\s+styles\s*=\s*StyleSheet\.create\(/,
        );
        if (styleSheetMatch) {
          const styleSheetStart = content.indexOf(
            "const styles = StyleSheet.create(",
          );
          const styleSheetEnd = content.indexOf("});", styleSheetStart) + 3;
          const styleSheetContent = content.slice(
            styleSheetStart,
            styleSheetEnd,
          );

          // Replace with getStyles function
          const getStylesFunction = `function getStyles(tokens) {
  return StyleSheet.create(${styleSheetContent.replace("const styles = StyleSheet.create(", "").replace("});", "")});
}`;

          content = content.replace(styleSheetContent, getStylesFunction);
          modified = true;
          console.log("  Wrapped styles in getStyles(tokens) function");
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`  ✅ Modified: ${filePath}`);
  } else {
    console.log(`  ⏭️  No changes needed: ${filePath}`);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      processFile(fullPath);
    }
  }
}

// Main execution
const target = process.argv[2] || "src";

if (fs.existsSync(target)) {
  const stat = fs.statSync(target);

  if (stat.isDirectory()) {
    console.log(`🔧 Refactoring theme usage in directory: ${target}`);
    processDirectory(target);
  } else {
    console.log(`🔧 Refactoring theme usage in file: ${target}`);
    processFile(target);
  }

  console.log("\n✅ Theme refactoring complete!");
  console.log('💡 Run "npm run lint" to check for any remaining issues');
} else {
  console.error(`❌ Target not found: ${target}`);
  process.exit(1);
}
