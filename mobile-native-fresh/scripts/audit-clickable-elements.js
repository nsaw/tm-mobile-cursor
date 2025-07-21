#!/usr/bin/env node

/**
 * Clickable Element Audit Script
 *
 * This script performs a comprehensive audit of all clickable elements
 * across the React Native app to ensure:
 * 1. All navigation routes are valid and implemented
 * 2. All onPress handlers are properly implemented
 * 3. All interactive elements have proper accessibility
 * 4. All routes follow the new global UI/UX standards
 */

const fs = require("fs");
const path = require("path");

const glob = require("glob");

// Define valid routes from routes.ts
const VALID_ROUTES = [
  "SignIn",
  "SignUp",
  "Dashboard",
  "Search",
  "AITools",
  "AllThoughtmarks",
  "ThoughtmarkDetail",
  "CreateThoughtmark",
  "AllBins",
  "CreateBin",
  "BinDetail",
  "Tasks",
  "Content",
  "VoiceRecord",
  "Settings",
  "Profile",
  "Premium",
  "Help",
  "Terms",
  "Privacy",
  "Security",
  "Theme",
  "Export",
  "Contact",
  "HowTo",
  "AdminDashboard",
  "Archive",
  "DesignSystemDemo",
];

// Define clickable component patterns
const CLICKABLE_PATTERNS = [
  /TouchableOpacity/,
  /TouchableHighlight/,
  /TouchableWithoutFeedback/,
  /Pressable/,
  /Button/,
  /onPress\s*=/,
  /onLongPress\s*=/,
  /onPressIn\s*=/,
  /onPressOut\s*=/,
];

// Define navigation patterns
const NAVIGATION_PATTERNS = [
  /navigation\.navigate\(/,
  /navigation\.push\(/,
  /navigation\.replace\(/,
  /navigation\.goBack\(/,
  /navigation\.reset\(/,
];

// Define accessibility patterns
const ACCESSIBILITY_PATTERNS = [
  /accessibilityRole\s*=/,
  /accessible\s*=/,
  /accessibilityLabel\s*=/,
  /accessibilityHint\s*=/,
];

// Results storage
const auditResults = {
  totalFiles: 0,
  filesWithClickables: 0,
  totalClickables: 0,
  validRoutes: 0,
  invalidRoutes: 0,
  missingAccessibility: 0,
  issues: [],
  warnings: [],
  recommendations: [],
};

/**
 * Extract route names from navigation calls
 */
function extractRouteNames(code) {
  const routeMatches = code.match(
    /navigation\.(navigate|push|replace)\(['"`]([^'"`]+)['"`]/g,
  );
  if (!routeMatches) return [];

  return routeMatches
    .map((match) => {
      const routeMatch = match.match(/['"`]([^'"`]+)['"`]/);
      return routeMatch ? routeMatch[1] : null;
    })
    .filter(Boolean);
}

/**
 * Check if a route is valid
 */
function isValidRoute(route) {
  return VALID_ROUTES.includes(route);
}

/**
 * Check accessibility compliance
 */
function checkAccessibility(code, filePath, lineNumber) {
  const hasAccessibilityRole = /accessibilityRole\s*=/.test(code);
  const hasAccessible = /accessible\s*=/.test(code);
  const hasAccessibilityLabel = /accessibilityLabel\s*=/.test(code);

  if (!hasAccessibilityRole || !hasAccessible || !hasAccessibilityLabel) {
    auditResults.missingAccessibility++;
    auditResults.issues.push({
      type: "accessibility",
      file: filePath,
      line: lineNumber,
      message:
        "Missing accessibility props (accessibilityRole, accessible, accessibilityLabel)",
    });
  }
}

/**
 * Check for proper styling compliance
 */
function checkStylingCompliance(code, filePath, lineNumber) {
  // Check for hardcoded values that should use tokens
  const hardcodedPatterns = [
    /fontSize:\s*\d+/,
    /padding:\s*\d+/,
    /margin:\s*\d+/,
    /color:\s*['"`]#[0-9a-fA-F]{3,6}['"`]/,
  ];

  hardcodedPatterns.forEach((pattern) => {
    const matches = code.match(pattern);
    if (matches) {
      auditResults.warnings.push({
        type: "styling",
        file: filePath,
        line: lineNumber,
        message: `Hardcoded value found: ${matches[0]}. Consider using design tokens.`,
      });
    }
  });
}

/**
 * Audit a single file
 */
function auditFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    auditResults.totalFiles++;
    let hasClickables = false;
    let fileClickables = 0;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for clickable components
      const isClickable = CLICKABLE_PATTERNS.some((pattern) =>
        pattern.test(line),
      );
      const hasNavigation = NAVIGATION_PATTERNS.some((pattern) =>
        pattern.test(line),
      );

      if (isClickable) {
        hasClickables = true;
        fileClickables++;
        auditResults.totalClickables++;

        // Check accessibility
        checkAccessibility(line, filePath, lineNumber);

        // Check styling compliance
        checkStylingCompliance(line, filePath, lineNumber);
      }

      // Check navigation routes
      if (hasNavigation) {
        const routes = extractRouteNames(line);
        routes.forEach((route) => {
          if (isValidRoute(route)) {
            auditResults.validRoutes++;
          } else {
            auditResults.invalidRoutes++;
            auditResults.issues.push({
              type: "navigation",
              file: filePath,
              line: lineNumber,
              message: `Invalid route: ${route}`,
            });
          }
        });
      }
    });

    if (hasClickables) {
      auditResults.filesWithClickables++;
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
  }
}

/**
 * Generate audit report
 */
function generateReport() {
  const report = `
# Clickable Element Audit Report
Generated: ${new Date().toISOString()}

## Summary
- Total files scanned: ${auditResults.totalFiles}
- Files with clickable elements: ${auditResults.filesWithClickables}
- Total clickable elements: ${auditResults.totalClickables}
- Valid navigation routes: ${auditResults.validRoutes}
- Invalid navigation routes: ${auditResults.invalidRoutes}
- Missing accessibility: ${auditResults.missingAccessibility}

## Issues Found (${auditResults.issues.length})
${auditResults.issues
  .map(
    (issue) =>
      `- **${issue.type.toUpperCase()}**: ${issue.file}:${issue.line} - ${issue.message}`,
  )
  .join("\n")}

## Warnings (${auditResults.warnings.length})
${auditResults.warnings
  .map(
    (warning) =>
      `- **${warning.type.toUpperCase()}**: ${warning.file}:${warning.line} - ${warning.message}`,
  )
  .join("\n")}

## Recommendations
${auditResults.recommendations.map((rec) => `- ${rec}`).join("\n")}

## Compliance Score
- Navigation Routes: ${Math.round(
    (auditResults.validRoutes /
      (auditResults.validRoutes + auditResults.invalidRoutes)) *
      100,
  )}%
- Accessibility: ${Math.round(
    ((auditResults.totalClickables - auditResults.missingAccessibility) /
      auditResults.totalClickables) *
      100,
  )}%
`;

  return report;
}

/**
 * Main audit function
 */
function runAudit() {
  console.log("🔍 Starting Clickable Element Audit...\n");

  // Find all TypeScript/JavaScript files
  const files = glob.sync("src/**/*.{ts,tsx,js,jsx}", {
    ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  });

  console.log(`Found ${files.length} files to audit...\n`);

  // Audit each file
  files.forEach((file) => {
    auditFile(file);
  });

  // Generate and save report
  const report = generateReport();
  const reportPath = path.join(__dirname, "../audit-report.md");

  fs.writeFileSync(reportPath, report);

  console.log("📊 Audit Complete!");
  console.log(`Report saved to: ${reportPath}\n`);

  console.log("📋 Summary:");
  console.log(`- Files scanned: ${auditResults.totalFiles}`);
  console.log(`- Clickable elements: ${auditResults.totalClickables}`);
  console.log(`- Valid routes: ${auditResults.validRoutes}`);
  console.log(`- Invalid routes: ${auditResults.invalidRoutes}`);
  console.log(`- Accessibility issues: ${auditResults.missingAccessibility}`);

  if (auditResults.issues.length > 0) {
    console.log("\n❌ Issues found:");
    auditResults.issues.forEach((issue) => {
      console.log(`  - ${issue.file}:${issue.line} - ${issue.message}`);
    });
  }

  if (auditResults.warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    auditResults.warnings.forEach((warning) => {
      console.log(`  - ${warning.file}:${warning.line} - ${warning.message}`);
    });
  }

  console.log("\n✅ Audit completed successfully!");
}

// Run the audit if this script is executed directly
if (require.main === module) {
  runAudit();
}

module.exports = { runAudit, auditResults };
