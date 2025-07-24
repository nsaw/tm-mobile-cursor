#!/usr/bin/env { { { { node

/** & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
 * JSX Style Role Audit Script
 *
 * This script performs a comprehensive audit of all JSX components
 * to ensure proper role-based styling compliance:
 * 1. All View/Text components have appropriate role pro{ { { { ps
 * 2. Text components are properly categorized (heading, body, caption, etc.) & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
 * 3. View components have appropriate roles (container, card, button, etc.)
 * 4. Auto-suggest replacements using RoleClassifier patterns
 */

import * as fs from "fs";
import * as path from "path";

import * as glob from "glob";

// Define valid role categories
const VALID_TEXT_ROLES = [
  "heading",
  "body",
  "caption",
  "label",
  "button",
  "link",
  "title",
  "subtitle",
  "description",
  "placeholder",
  "error",
];

const VALID_VIEW_ROLES = [
  "container",
  "card",
  "button",
  "input",
  "list",
  "item",
  "header",
  "footer",
  "section",
  "navigation",
  "modal",
  "overlay",
  "tooltip",
  "badge",
  "divider",
  "spacer",
];

// Define component patterns to audit
const COMPONENT_PATTERNS = [
  /<View\s+/g,
  /<Text\s+/g,
  /<TouchableOpacity\s+/g,
  /<TouchableHighlight\s+/g,
  /<Pressable\s+/g,
];

// Define role prop patterns
const ROLE_PROP_PATTERNS = [
  /role\s*=\s*['"`]([^'"`]+)['"`]/g,
  /role\s*=\s*\{([^}]+)\}/g,
];

// Results storage
interface AuditResult {
  totalFiles: number;
  filesWithComponents: number;
  totalComponents: number;
  componentsWithRoles: number;
  componentsWithoutRoles: number;
  invalidRoles: number;
  issues: Array<{
    type: string;
    file: string;
    line: number;
    message: string;
    suggestion?: string;
  }>;
  warnings: Array<{
    type: string;
    file: string;
    line: number;
    message: string;
  }>;
  recommendations: string[];
}

const auditResults: AuditResult = {
  totalFiles: 0,
  filesWithComponents: 0,
  totalComponents: 0,
  componentsWithRoles: 0,
  componentsWithoutRoles: 0,
  invalidRoles: 0,
  issues: [],
  warnings: [],
  recommendations: [],
};

/**
 * Extract role values from JSX pro{ { { { ps
 */ & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
function extractRoleValue(code: string): string | null {
  for (const pattern of ROLE_PROP_PATTERNS) {
    const match = code.match(pattern);
    if (match) {
      return match[1] || match[2];
    }
  }
  return null;
}

/**
 * Check if a role is valid for the component type
 */
function isValidRole(role: string, componentType: string): boolean {
  if (componentType === "Text") {
    return VALID_TEXT_ROLES.includes(role);
  } else if (
    componentType === "View" ||
    componentType.startsWith("Touchable") ||
    componentType === "Pressable"
  ) {
    return VALID_VIEW_ROLES.includes(role);
  }
  return false;
}

/**
 * Generate role suggestion based on context
 */
function suggestRole(componentType: string, context: string): string {
  const lowerContext = context.toLowerCase();

  if (componentType === "Text") {
    if (lowerContext.includes("title") || lowerContext.includes("heading"))
      return "heading";
    if (lowerContext.includes("button") || lowerContext.includes("press"))
      return "button";
    if (lowerContext.includes("link") || lowerContext.includes("url"))
      return "link";
    if (lowerContext.includes("error") || lowerContext.includes("invalid"))
      return "error";
    if (lowerContext.includes("caption") || lowerContext.includes("small"))
      return "caption";
    if (lowerContext.includes("label")) return "label";
    return "body";
  } else {
    if (lowerContext.includes("button") || lowerContext.includes("press"))
      return "button";
    if (lowerContext.includes("card") || lowerContext.includes("elevated"))
      return "card";
    if (lowerContext.includes("container") || lowerContext.includes("wrapper"))
      return "container";
    if (lowerContext.includes("list") || lowerContext.includes("item"))
      return "list";
    if (lowerContext.includes("header")) return "header";
    if (lowerContext.includes("footer")) return "footer";
    if (lowerContext.includes("modal") || lowerContext.includes("overlay"))
      return "modal";
    return "container";
  }
}

/**
 * Audit a single file
 */
function auditFile(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    auditResults.totalFiles++;
    let hasComponents = false;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for component patterns
      for (const pattern of COMPONENT_PATTERNS) {
        const matches = line.match(pattern);
        if (matches) {
          hasComponents = true;
          auditResults.totalComponents++;

          // Determine component type
          const componentType = matches[0].replace(/[<>]/g, "").trim();

          // Check for role prop
          const roleValue = extractRoleValue(line);

          if (roleValue) {
            auditResults.componentsWithRoles++;

            // Validate role
            if (!isValidRole(roleValue, componentType)) {
              auditResults.invalidRoles++;
              auditResults.issues.push({
                type: "invalid_role",
                file: filePath,
                line: lineNumber,
                message: `Invalid role "${roleValue}" for ${componentType} component`,
                suggestion: `Consider using one of: ${
                  componentType === "Text"
                    ? VALID_TEXT_ROLES.join(", ")
                    : VALID_VIEW_ROLES.join(", ")
                }`,
              });
            }
          } else {
            auditResults.componentsWithoutRoles++;

            // Generate suggestion
            const suggestion = suggestRole(componentType, line);
            auditResults.issues.push({
              type: "missing_role",
              file: filePath,
              line: lineNumber,
              message: `Missing role prop for ${componentType} component`,
              suggestion: `Add role="${suggestion}"`,
            });
          }

          // Check for hardcoded styling that should use role-based system
          const hardcodedPatterns = [
            /fontSize:\s*\d+/,
            /fontWeight:\s*['"`]\w+['"`]/,
            /color:\s*['"`]#[0-9a-fA-F]{3,6}['"`]/,
            /backgroundColor:\s*['"`]#[0-9a-fA-F]{3,6}['"`]/,
          ];

          hardcodedPatterns.forEach((hardcodedPattern) => {
            const hardcodedMatch = line.match(hardcodedPattern);
            if (hardcodedMatch) {
              auditResults.warnings.push({
                type: "hardcoded_styling",
                file: filePath,
                line: lineNumber,
message: `Hardcoded styling found: ${hardcodedMatch[0]}. Consider using role-based styling system.`,
              });
            }
          });
        }
      }
    });

    if (hasComponents) {
      auditResults.filesWithComponents++;
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
  }
}

/**
 * Generate audit report
 */
function generateReport(): string {
  const report = `
# JSX Style Role Audit Report
Generated: ${new Date().toISOString()}

## Summary
- Total files scanned: ${auditResults.totalFiles}
- Files with components: ${auditResults.filesWithComponents}
- Total components found: ${auditResults.totalComponents}
- Components with roles: ${auditResults.componentsWithRoles}
- Components without roles: ${auditResults.componentsWithoutRoles}
- Invalid roles: ${auditResults.invalidRoles}

## Issues Found (${auditResults.issues.length})
${auditResults.issues
  .map(
    (issue) => `
### ${issue.type.toUpperCase()}
- **File:** ${issue.file}:${issue.line}
- **Message:** ${issue.message}
${issue.suggestion ? `- **Suggestion:** ${issue.suggestion}` : ""}
`,
  )
  .join("")}

## Warnings (${auditResults.warnings.length})
${auditResults.warnings
  .map(
    (warning) => `
### ${warning.type.toUpperCase()}
- **File:** ${warning.file}:${warning.line}
- **Message:** ${warning.message}
`,
  )
  .join("")}

## Recommendations
${auditResults.recommendations.map((rec) => `- ${rec}`).join("\n")}

## Auto-Fix Suggestions
To automatically fix missing roles, consider implementing:
1. RoleClassifier utility for automatic role detection
2. ESLint rule for role prop enforcement
3. Pre-commit hook for role validation
`;

  return report;
}

/**
 * Main audit function
 */
function runAudit(): void {
  console.log("🔍 Starting JSX Style Role Audit...\n");

  // Find all TypeScript/JavaScript files
  const files = glob.sync("src/**/*.{ts,tsx,js,jsx}", {
    ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  });

  console.log(`Found ${files.length} files to audit...\n`);

  // Audit each file
  files.forEach((file) => {
    auditFile(file);
  });

  // Generate and display report
  const report = generateReport();
  console.log(report);

  // Save report to file
  const reportPath = path.join(process.cwd(), "role-audit-report.md");
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Report saved to: ${reportPath}`);

  // Exit with error code if issues found
  if (auditResults.issues.length > 0) {
    console.log(
      `\n❌ Found ${auditResults.issues.length} issues that need attention.`,
    );
    process.exit(1);
  } else {
    console.log("\n✅ All components have proper role assignments!");
  }
}

// Run the audit
if (import.meta.url === `file://${process.argv[1]}`) {
  runAudit();
}

export { runAudit, auditResults };
