#!/usr/bin/env { { node

/** & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
 * Compliance Monitor
 * Monitors agent compliance with non-blocking patterns
 * Part of Phase 3: Agent Training
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class ComplianceMonitor {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.logDir = path.join(this.projectRoot, 'logs');
        this.complianceLog = path.join(this.logDir, 'compliance-monitor.log');
        this.agentLog = path.join(this.logDir, 'agent-compliance.log');
        
        // Ensure log directory exists
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
        
        this.stats = {
            agentsMonitored: 0,
            complianceChecks: 0,
            violationsDetected: 0,
            warningsIssued: 0,
            trainingSessions: 0,
            errors: 0
        };
        
        // Agent definitions
        this.agents = [
            {
                name: 'BRAUN',
                description: 'Main agent for patch execution',
                paths: ['scripts/', 'mobile-native-fresh/scripts/'],
                patterns: ['execSync', 'exec', '{ { node scripts/', 'bash scripts/'], & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
                complianceLevel: 'HIGH'
            },
            {
                name: 'DEV',
                description: 'Development agent for code changes',
                paths: ['scripts/', 'mobile-native-fresh/scripts/'],
                patterns: ['execSync', 'exec', '{ { npm run', 'npx'], & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
                complianceLevel: 'HIGH'
            },
            {
                name: 'GHOST',
                description: 'Ghost runner agent',
                paths: ['scripts/ghost/', 'gpt_cursor_runner/'],
                patterns: ['execSync', 'exec', '{ { python3 -m'], & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
                complianceLevel: 'CRITICAL'
            }
        ];
        
        // Compliance rules
        this.complianceRules = [
            {
                rule: 'NON_BLOCKING_PATTERNS',
                description: 'All terminal commands must use non-blocking patterns',
                pattern: /(?:execSync|exec|bash|npm|npx|node|python3)\s+[^;}\n]+/g,
                severity: 'CRITICAL',
                fix: 'Use { command & } >/dev/null 2>&1 & disown pattern'
            },
            {
                rule: 'VALIDATION_GATES',
                description: 'All patches must include validation gates',
                pattern: /"enforceValidationGate":\s*true/g,
                severity: 'HIGH',
                fix: 'Add enforceValidationGate: true to patch configuration'
            },
            {
                rule: 'MUTATION_PROOF',
                description: 'All patches must require mutation proof',
                pattern: /"requireMutationProof":\s*true/g,
                severity: 'HIGH',
                fix: 'Add requireMutationProof: true to patch configuration'
            },
            {
                rule: 'RUNTIME_AUDIT',
                description: 'All patches must include runtime audit',
                pattern: /"strictRuntimeAudit":\s*true/g,
                severity: 'HIGH',
                fix: 'Add strictRuntimeAudit: true to patch configuration'
            }
        ];
        
        this.isMonitoring = false;
        this.agentStatus = new Map();
    }

    // Log compliance event
    logEvent(level, message, details = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            details,
            stats: { ...this.stats }
        };
        
        const logLine = `[${timestamp}] [${level}] ${message} ${JSON.stringify(details)}\n`;
        fs.appendFileSync(this.complianceLog, logLine);
        
        // Also log to console for real-time feedback
        const emoji = level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️' : level === 'INFO' ? 'ℹ️' : '✅';
        console.log(`${emoji} [${level}] ${message}`);
    }

    // Log agent-specific event
    logAgentEvent(agentName, level, message, details = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            agent: agentName,
            level,
            message,
            details
        };
        
        const logLine = `[${timestamp}] [${agentName}] [${level}] ${message} ${JSON.stringify(details)}\n`;
        fs.appendFileSync(this.agentLog, logLine);
        
        // Update agent status
        if (!this.agentStatus.has(agentName)) {
            this.agentStatus.set(agentName, {
                lastCheck: timestamp,
                complianceLevel: 'UNKNOWN',
                violations: [],
                warnings: [],
                trainingSessions: 0
            });
        }
        
        const status = this.agentStatus.get(agentName);
        status.lastCheck = timestamp;
        
        if (level === 'VIOLATION') {
            status.violations.push({ timestamp, message, details });
        } else if (level === 'WARN') {
            status.warnings.push({ timestamp, message, details });
        }
        
        this.agentStatus.set(agentName, status);
    }

    // Check agent compliance
    checkAgentCompliance(agent) {
        this.stats.complianceChecks++;
        this.logEvent('INFO', `Checking compliance for agent: ${agent.name}`);
        
        const violations = [];
        const warnings = [];
        
        // Check agent paths
        agent.paths.forEach(agentPath => {
            const fullPath = path.join(this.projectRoot, agentPath);
            if (fs.existsSync(fullPath)) {
                const pathViolations = this.scanDirectoryForViolations(fullPath, agent);
                violations.push(...pathViolations);
            }
        });
        
        // Check compliance rules
        this.complianceRules.forEach(rule => {
            const ruleViolations = this.checkComplianceRule(agent, rule);
            violations.push(...ruleViolations);
        });
        
        // Log results
        if (violations.length > 0) {
            this.stats.violationsDetected += violations.length;
            this.logAgentEvent(agent.name, 'VIOLATION', `Found ${violations.length} compliance violations`, { violations });
            
            // Issue training recommendation
            this.recommendTraining(agent, violations);
        } else {
            this.logAgentEvent(agent.name, 'INFO', 'Agent is compliant with all rules');
        }
        
        return violations;
    }

    // Scan directory for violations
    scanDirectoryForViolations(dirPath, agent) {
        const violations = [];
        
        try {
            const items = fs.readdirSync(dirPath);
            
            items.forEach(item => {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // Skip excluded directories
                    if (!['node_modules', '.git', '.cursor-cache', 'dist', 'build', 'coverage'].includes(item)) {
                        violations.push(...this.scanDirectoryForViolations(fullPath, agent));
                    }
                } else if (stat.isFile()) {
                    const ext = path.extname(item);
                    if (['.js', '.ts', '.sh', '.bash', '.py'].includes(ext)) {
                        const fileViolations = this.scanFileForViolations(fullPath, agent);
                        violations.push(...fileViolations);
                    }
                }
            });
        } catch (error) {
            this.stats.errors++;
            this.logEvent('ERROR', `Error scanning directory: ${error.message}`, { directory: dirPath });
        }
        
        return violations;
    }

    // Scan file for violations
    scanFileForViolations(filePath, agent) {
        const violations = [];
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            agent.patterns.forEach(pattern => {
                const regex = new RegExp(pattern, 'g');
                let match;
                
                while ((match = regex.exec(content)) !== null) {
                    const command = match[0];
                    
                    // Check if it's already a non-blocking pattern
                    if (command.includes('{') && command.includes('&') && command.includes('disown')) {
                        continue;
                    }
                    
                    violations.push({
                        file: path.relative(this.projectRoot, filePath),
                        line: content.substring(0, match.index).split('\n').length,
                        pattern: pattern,
                        command: command,
                        agent: agent.name,
                        severity: agent.complianceLevel
                    });
                }
            });
        } catch (error) {
            this.stats.errors++;
            this.logEvent('ERROR', `Error scanning file: ${error.message}`, { file: filePath });
        }
        
        return violations;
    }

    // Check compliance rule
    checkComplianceRule(agent, rule) {
        const violations = [];
        
        agent.paths.forEach(agentPath => {
            const fullPath = path.join(this.projectRoot, agentPath);
            if (fs.existsSync(fullPath)) {
                const ruleViolations = this.scanDirectoryForRule(fullPath, rule, agent);
                violations.push(...ruleViolations);
            }
        });
        
        return violations;
    }

    // Scan directory for rule violations
    scanDirectoryForRule(dirPath, rule, agent) {
        const violations = [];
        
        try {
            const items = fs.readdirSync(dirPath);
            
            items.forEach(item => {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    if (!['node_modules', '.git', '.cursor-cache', 'dist', 'build', 'coverage'].includes(item)) {
                        violations.push(...this.scanDirectoryForRule(fullPath, rule, agent));
                    }
                } else if (stat.isFile()) {
                    const ext = path.extname(item);
                    if (['.js', '.ts', '.json'].includes(ext)) {
                        const fileViolations = this.scanFileForRule(fullPath, rule, agent);
                        violations.push(...fileViolations);
                    }
                }
            });
        } catch (error) {
            this.stats.errors++;
            this.logEvent('ERROR', `Error scanning directory for rule: ${error.message}`, { directory: dirPath });
        }
        
        return violations;
    }

    // Scan file for rule violations
    scanFileForRule(filePath, rule, agent) {
        const violations = [];
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            if (!rule.pattern.test(content)) {
                violations.push({
                    file: path.relative(this.projectRoot, filePath),
                    rule: rule.rule,
                    description: rule.description,
                    severity: rule.severity,
                    fix: rule.fix,
                    agent: agent.name
                });
            }
        } catch (error) {
            this.stats.errors++;
            this.logEvent('ERROR', `Error scanning file for rule: ${error.message}`, { file: filePath });
        }
        
        return violations;
    }

    // Recommend training
    recommendTraining(agent, violations) {
        this.stats.trainingSessions++;
        this.logAgentEvent(agent.name, 'TRAINING', 'Training session recommended', {
            violations: violations.length,
            recommendations: [
                'Review non-blocking pattern documentation',
                'Use validation tools before committing',
                'Follow agent-specific guidelines',
                'Attend compliance training session'
            ]
        });
        
        // Update agent status
        const status = this.agentStatus.get(agent.name);
        status.trainingSessions++;
        status.complianceLevel = 'NEEDS_TRAINING';
        this.agentStatus.set(agent.name, status);
    }

    // Start monitoring
    startMonitoring() {
        if (this.isMonitoring) {
            this.logEvent('WARN', 'Already monitoring');
            return;
        }
        
        this.logEvent('INFO', 'Starting compliance monitoring');
        this.isMonitoring = true;
        
        // Check all agents
        this.agents.forEach(agent => {
            this.stats.agentsMonitored++;
            this.checkAgentCompliance(agent);
        });
        
        this.logEvent('INFO', 'Compliance monitoring started', { stats: this.stats });
    }

    // Stop monitoring
    stopMonitoring() {
        if (!this.isMonitoring) {
            this.logEvent('WARN', 'Not currently monitoring');
            return;
        }
        
        this.logEvent('INFO', 'Stop{ { ping compliance monitoring') & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown;
        this.isMonitoring = false;
        
        this.logEvent('INFO', 'Compliance monitoring stopped', { stats: this.stats });
    }

    // Get compliance statistics
    getStats() {
        return {
            ...this.stats,
            isMonitoring: this.isMonitoring,
            agentStatus: Object.fromEntries(this.agentStatus)
        };
    }

    // Generate compliance report
    generateReport() {
        return {
            timestamp: new Date().toISOString(),
            stats: this.getStats(),
            agents: this.agents.map(agent => ({
                ...agent,
                status: this.agentStatus.get(agent.name) || { complianceLevel: 'UNKNOWN' }
            })),
            summary: {
                overallCompliance: this.stats.violationsDetected === 0 ? 'COMPLIANT' : 'NON-COMPLIANT',
                riskLevel: this.stats.violationsDetected > 10 ? 'HIGH' : this.stats.violationsDetected > 5 ? 'MEDIUM' : 'LOW',
                trainingNeeded: this.stats.trainingSessions > 0
            }
        };
    }
}

// CLI interface
const monitor = new ComplianceMonitor();

const command = process.argv[2];

switch (command) {
    case 'start':
        monitor.startMonitoring();
        break;
    case 'stop':
        monitor.stopMonitoring();
        break;
    case 'check':
        const agentName = process.argv[3];
        if (agentName) {
            const agent = monitor.agents.find(a => a.name === agentName);
            if (agent) {
                monitor.checkAgentCompliance(agent);
            } else {
                console.log(`Agent '${agentName}' not found`);
            }
        } else {
            monitor.agents.forEach(agent => {
                monitor.checkAgentCompliance(agent);
            });
        }
        break;
    case 'stats':
        console.log('📊 Compliance Statistics:');
        console.log(JSON.stringify(monitor.getStats(), null, 2));
        break;
    case 'report':
        console.log('📋 Compliance Report:');
        console.log(JSON.stringify(monitor.generateReport(), null, 2));
        break;
    default:
        console.log('🔍 Compliance Monitor');
        console.log('');
        console.log('Usage: { { node compliance-monitor.js [start|stop|check|stats|report]') & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown;
        console.log('');
        console.log('Commands:');
        console.log('  start   - Start compliance monitoring');
        console.log('  stop    - Stop compliance monitoring');
        console.log('  check [agent] - Check agent compliance');
        console.log('  stats   - Show compliance statistics');
        console.log('  report  - Generate compliance report');
        console.log('');
        console.log('This monitor ensures all agents comply with non-blocking patterns');
        console.log('and provides training recommendations when violations are detected.');
}

module.exports = ComplianceMonitor; 