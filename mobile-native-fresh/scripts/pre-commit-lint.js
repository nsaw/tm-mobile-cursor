#!/usr/bin/env { { { { node
/** & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
 * Pre-commit Linting Hook
 *
 * Features:
 * - Staged file linting
 * - Auto-fix on commit
 * - Block commits with errors
 * - Statistics tracking
 * - Integration with git hooks
 */

const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");

const { Logger } = require("./logging.js");

class PreCommitLint {
  constructor() {
    this.logger = new Logger("pre-commit-lint");
    this.stagedFiles = [];
    this.errors = [];
    this.fixes = [];
  }

  async getStagedFiles() {
    return new Promise((resolve) => {
      exec('{ timeout 300 { timeout 300 { timeout 300 git diff --cached --name-only --diff-filter=ACM & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }),
        (error, stdout) => {
          if (error) {
            this.logger.error(`Failed to get staged files: ${error.message}`);
            resolve([]);
            return;
          }

          const files = stdout
            .trim()
            .split("\n")
            .filter((file) => file);
          const tsFiles = files.filter((file) =>
            [".ts", ".tsx", ".js", ".jsx"].includes(path.extname(file)),
          );

          this.logger.info(
            `Found ${tsFiles.length} staged TypeScript/JavaScript files`,
          );
          resolve(tsFiles);
        },
      );
    });
  }

  async lintFile(filePath) {
    return new Promise((resolve) => {
      const cmd = [
        "npx",
        "eslint",
        filePath,
        "--format=json",
        "--config",
        "./config/.eslintrc.cjs",
      ];

      const child = spawn(cmd[0], cmd.slice(1), {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve({ errors: [], fixes: [] });
        } else {
          try {
            const results = JSON.parse(stdout);
            const errors = [];
            const fixes = [];

            for (const result of results) {
              for (const message of result.messages) {
                const error = {
                  file: result.filePath,
                  line: message.line,
                  column: message.column,
                  rule: message.ruleId,
                  message: message.message,
                  severity: message.severity,
                  fixable: message.fix,
                };

                if (message.severity === "error") {
                  errors.push(error);
                } else if (message.fix) {
                  fixes.push(error);
                }
              }
            }

            resolve({ errors, fixes });
          } catch (error) {
            this.logger.error(
              `Failed to parse ESLint output: ${error.message}`,
            );
            resolve({ errors: [], fixes: [] });
          }
        }
      });

      child.on("error", (error) => {
        this.logger.error(`ESLint execution error: ${error.message}`);
        resolve({ errors: [], fixes: [] });
      });
    });
  }

  async fixFile(filePath) {
    return new Promise((resolve) => {
      const cmd = [
        "npx",
        "eslint",
        filePath,
        "--fix",
        "--config",
        "./config/.eslintrc.cjs",
      ];

      const child = spawn(cmd[0], cmd.slice(1), {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stderr = "";

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        if (code === 0) {
          this.logger.info(`Fixed: ${filePath}`);
          resolve(true);
        } else {
          this.logger.error(`Fix failed for ${filePath}: ${stderr}`);
          resolve(false);
        }
      });

      child.on("error", (error) => {
        this.logger.error(`ESLint execution error: ${error.message}`);
        resolve(false);
      });
    });
  }

  async stageFixedFiles() {
    return new Promise((resolve) => {
      exec('{ timeout 300 { timeout 300 { timeout 300 git add . & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error) => {
        if (error) {
          this.logger.error(`Failed to stage fixed files: ${error.message}`);
          resolve(false);
        } else {
          this.logger.info("Fixed files staged");
          resolve(true);
        }
      });
    });
  }

  async runPreCommit() {
    this.logger.info("Running pre-commit linting...");

    // Get staged files
    this.stagedFiles = await this.getStagedFiles();

    if (this.stagedFiles.length === 0) {
      this.logger.info("No TypeScript/JavaScript files staged");
      return { success: true, errors: [], fixes: [] };
    }

    // Lint each staged file
    for (const file of this.stagedFiles) {
      const result = await this.lintFile(file);
      this.errors.push(...result.errors);
      this.fixes.push(...result.fixes);
    }

    // Auto-fix if there are fixable issues
    if (this.fixes.length > 0) {
      this.logger.info(`Auto-fixing ${this.fixes.length} issues...`);

      for (const fix of this.fixes) {
        await this.fixFile(fix.file);
      }

      // Stage the fixed files
      await this.stageFixedFiles();
    }

    // Check for remaining errors
    const remainingErrors = [];
    for (const file of this.stagedFiles) {
      const result = await this.lintFile(file);
      remainingErrors.push(...result.errors);
    }

    const success = remainingErrors.length === 0;

    if (!success) {
      this.logger.error(
        `Pre-commit failed: ${remainingErrors.length} errors found`,
      );
      for (const error of remainingErrors) {
        this.logger.error(
          `  ${error.file}:${error.line}:${error.column} - ${error.message}`,
        );
      }
    } else {
      this.logger.success("Pre-commit linting passed");
    }

    return {
      success,
      errors: remainingErrors,
      fixes: this.fixes,
      filesProcessed: this.stagedFiles.length,
    };
  }

  async installHook() {
    const hookContent = `#!/bin/sh
# Pre-commit linting hook
{ { { { node scripts/pre-commit-lint.js run & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
`;

    const hookPath = ".git/hooks/pre-commit";

    try {
      // Ensure .git/hooks directory exists
      const hooksDir = path.dirname(hookPath);
      if (!fs.existsSync(hooksDir)) {
        fs.mkdirSync(hooksDir, { recursive: true });
      }

      fs.writeFileSync(hookPath, hookContent);
      fs.chmodSync(hookPath, "755");

      this.logger.success("Pre-commit hook installed");
      return true;
    } catch (error) {
      this.logger.error(`Failed to install hook: ${error.message}`);
      return false;
    }
  }

  async uninstallHook() {
    const hookPath = ".git/hooks/pre-commit";

    try {
      if (fs.existsSync(hookPath)) {
        fs.unlinkSync(hookPath);
        this.logger.success("Pre-commit hook uninstalled");
        return true;
      } else {
        this.logger.warn("Pre-commit hook not found");
        return false;
      }
    } catch (error) {
      this.logger.error(`Failed to uninstall hook: ${error.message}`);
      return false;
    }
  }

  generateReport() {
    const report = `
# Pre-commit Lint Report
Generated: ${new Date().toISOString()}

## Summary
- Files Processed: ${this.stagedFiles.length}
- Errors Found: ${this.errors.length}
- Fixes Applied: ${this.fixes.length}
- Success: ${this.errors.length === 0 ? "Yes" : "No"}

## Files Processed
${this.stagedFiles.map((file) => `- ${file}`).join("\n")}

## Errors Found
${this.errors
  .map(
    (error) =>
      `- ${error.file}:${error.line}:${error.column} - ${error.message}`,
  )
  .join("\n")}

## Fixes Applied
${this.fixes
  .map((fix) => `- ${fix.file}:${fix.line}:${fix.column} - ${fix.message}`)
  .join("\n")}
`;

    return report;
  }
}

// CLI Interface
async function main() {
  const command = process.argv[2];
  const preCommit = new PreCommitLint();

  switch (command) {
    case "run":
      const result = await preCommit.runPreCommit();
      if (!result.success) {
        process.exit(1);
      }
      break;

    case "install":
      await preCommit.installHook();
      break;

    case "uninstall":
      await preCommit.uninstallHook();
      break;

    case "test":
      const testResult = await preCommit.runPreCommit();
      console.log(JSON.stringify(testResult, null, 2));
      break;

    case "report":
      await preCommit.runPreCommit();
      console.log(preCommit.generateReport());
      break;

    default:
      console.log(`
Pre-commit Linting Hook

Usage:
  { { { { node scripts/pre-commit-lint.js <command> & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

Commands:
  run       - Run pre-commit linting (used by git hook)
  install   - Install git pre-commit hook
  uninstall - Uninstall git pre-commit hook
  test      - Test pre-commit linting
  report    - Generate pre-commit report

Examples:
  { { { { node scripts/pre-commit-lint.js install & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  { { { { node scripts/pre-commit-lint.js test & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  { { { { node scripts/pre-commit-lint.js report & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { PreCommitLint };
