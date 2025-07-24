#!/usr/bin/env { { node

/** & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
 * Non-Blocking Terminal Pattern Validator
 * Detects and fixes blocking terminal commands throughout the codebase
 * Enforces the mandatory non-blocking pattern: { command & } >/dev/null 2>&1 & disown
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NonBlockingValidator {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.violations = [];
        this.fixes = [];
        this.stats = {
            filesScanned: 0,
            violationsFound: 0,
            fixesApplied: 0,
            errors: 0
        };
        
        // Patterns to detect blocking commands
        this.blockingPatterns = [
            // execSync patterns
            {
                pattern: /execSync\s*\(\s*['"`]([^'"`]+)['"`]/g,
                type: 'execSync',
                description: 'Synchronous command execution'
            },
            // exec patterns (potentially blocking)
            {
                pattern: /exec\s*\(\s*['"`]([^'"`]+)['"`]/g,
                type: 'exec',
                description: 'Asynchronous command execution (may block)'
            },
            // Direct command execution
            {
                pattern: /(?:bash|npm|npx|node|python3|curl|ps|tar|rsync|ping|nmap)\s+[^;}\n]+/g,
                type: 'direct',
                description: 'Direct command execution'
            }
        ];
        
        // Safe commands that don't need non-blocking pattern
        this.safeCommands = [
            'ls', 'pwd', 'echo', 'cat', 'git status', 'which', 'test', 'true', 'false'
        ];
        
        // File extensions to scan
        this.scanExtensions = ['.js', '.ts', '.sh', '.bash', '.py', '.md'];
        
        // Directories to exclude
        this.excludeDirs = [
            'node_modules', '.git', '.cursor-cache', 'dist', 'build', 'coverage'
        ];
    }

    // Check if command is safe (doesn't need non-blocking pattern)
    isSafeCommand(command) {
        return this.safeCommands.some(safe => command.trim().startsWith(safe));
    }

    // Generate non-blocking pattern for command
    generateNonBlockingPattern(command, type) {
        // For execSync, convert to non-blocking pattern
        if (type === 'execSync') {
            return `execSync('{ ${command} & } >/dev/null 2>&1 & disown', { stdio: 'pipe' })`;
        }
        
        // For exec, ensure non-blocking pattern
        if (type === 'exec') {
            if (command.includes('{') && command.includes('&') && command.includes('disown')) {
                return command; // Already has pattern
            }
            return `{ ${command} & } >/dev/null 2>&1 & disown`;
        }
        
        // For direct commands, wrap in non-blocking pattern
        return `{ ${command} & } >/dev/null 2>&1 & disown`;
    }

    // Scan a single file for violations
    scanFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const violations = [];
            
            this.blockingPatterns.forEach(({ pattern, type, description }) => {
                let match;
                while ((match = pattern.exec(content)) !== null) {
                    const command = match[1] || match[0];
                    
                    // Skip if it's already a non-blocking pattern
                    if (command.includes('{') && command.includes('&') && command.includes('disown')) {
                        continue;
                    }
                    
                    // Skip safe commands
                    if (this.isSafeCommand(command)) {
                        continue;
                    }
                    
                    violations.push({
                        line: content.substring(0, match.index).split('\n').length,
                        command: command,
                        type: type,
                        description: description,
                        match: match[0]
                    });
                }
            });
            
            return violations;
        } catch (error) {
            console.error(`❌ Error scanning ${filePath}:`, error.message);
            this.stats.errors++;
            return [];
        }
    }

    // Fix violations in a file
    fixFile(filePath, violations) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let fixesApplied = 0;
            
            violations.forEach(violation => {
                const newPattern = this.generateNonBlockingPattern(violation.command, violation.type);
                content = content.replace(violation.match, newPattern);
                fixesApplied++;
            });
            
            if (fixesApplied > 0) {
                fs.writeFileSync(filePath, content, 'utf8');
                this.stats.fixesApplied += fixesApplied;
                return fixesApplied;
            }
            
            return 0;
        } catch (error) {
            console.error(`❌ Error fixing ${filePath}:`, error.message);
            this.stats.errors++;
            return 0;
        }
    }

    // Scan directory recursively
    scanDirectory(dirPath) {
        try {
            const items = fs.readdirSync(dirPath);
            
            items.forEach(item => {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // Skip excluded directories
                    if (!this.excludeDirs.includes(item)) {
                        this.scanDirectory(fullPath);
                    }
                } else if (stat.isFile()) {
                    const ext = path.extname(item);
                    if (this.scanExtensions.includes(ext)) {
                        this.stats.filesScanned++;
                        const violations = this.scanFile(fullPath);
                        
                        if (violations.length > 0) {
                            this.violations.push({
                                file: fullPath,
                                violations: violations
                            });
                            this.stats.violationsFound += violations.length;
                        }
                    }
                }
            });
        } catch (error) {
            console.error(`❌ Error scanning directory ${dirPath}:`, error.message);
            this.stats.errors++;
        }
    }

    // Apply fixes to all violations
    applyFixes() {
        console.log('🔧 Applying fixes to violations...');
        
        this.violations.forEach(({ file, violations }) => {
            const fixesApplied = this.fixFile(file, violations);
            if (fixesApplied > 0) {
                console.log(`✅ Fixed ${fixesApplied} violations in ${path.relative(this.projectRoot, file)}`);
            }
        });
    }

    // Generate validation report
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            stats: this.stats,
            violations: this.violations,
            summary: {
                totalFiles: this.stats.filesScanned,
                totalViolations: this.stats.violationsFound,
                totalFixes: this.stats.fixesApplied,
                totalErrors: this.stats.errors
            }
        };
        
        return report;
    }

    // Run validation
    run() {
        console.log('🔍 Starting non-blocking pattern validation...');
        console.log(`📁 Scanning: ${this.projectRoot}`);
        
        this.scanDirectory(this.projectRoot);
        
        console.log('\n📊 Validation Results:');
        console.log(`   Files scanned: ${this.stats.filesScanned}`);
        console.log(`   Violations found: ${this.stats.violationsFound}`);
        console.log(`   Fixes applied: ${this.stats.fixesApplied}`);
        console.log(`   Errors: ${this.stats.errors}`);
        
        if (this.stats.violationsFound > 0) {
            console.log('\n🚨 Violations found:');
            this.violations.forEach(({ file, violations }) => {
                console.log(`\n📄 ${path.relative(this.projectRoot, file)}:`);
                violations.forEach(violation => {
                    console.log(`   Line ${violation.line}: ${violation.description}`);
                    console.log(`   Command: ${violation.command}`);
                });
            });
        }
        
        return this.generateReport();
    }

    // Run validation with fixes
    runWithFixes() {
        const report = this.run();
        
        if (this.stats.violationsFound > 0) {
            console.log('\n🔧 Applying automatic fixes...');
            this.applyFixes();
            
            console.log('\n✅ Fixes applied successfully!');
            console.log(`   Total fixes: ${this.stats.fixesApplied}`);
        } else {
            console.log('\n✅ No violations found - all patterns are compliant!');
        }
        
        return report;
    }
}

// CLI interface
const validator = new NonBlockingValidator();

const command = process.argv[2];

switch (command) {
    case 'scan':
        validator.run();
        break;
    case 'fix':
        validator.runWithFixes();
        break;
    case 'report':
        const report = validator.run();
        console.log('\n📋 Detailed Report:');
        console.log(JSON.stringify(report, null, 2));
        break;
    default:
        console.log('🔍 Non-Blocking Pattern Validator');
        console.log('');
        console.log('Usage: { { node validate-non-blocking-patterns.js [scan|fix|report]') & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown;
        console.log('');
        console.log('Commands:');
        console.log('  scan   - Scan for violations without fixing');
        console.log('  fix    - Scan and automatically fix violations');
        console.log('  report - Generate detailed validation report');
        console.log('');
        console.log('This validator ensures all terminal commands use non-blocking patterns');
        console.log('to prevent Cursor UI freezing and agent chat blocking.');
} 