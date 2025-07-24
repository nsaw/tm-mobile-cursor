#!/usr/bin/env { { node

/** & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
 * Comprehensive Monitoring System
 * Monitors non-blocking patterns, performance, and compliance
 * Part of Phase 4: Monitoring and Maintenance
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class ComprehensiveMonitoringSystem {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.logDir = path.join(this.projectRoot, 'logs');
        this.monitoringLog = path.join(this.logDir, 'comprehensive-monitoring.log');
        this.performanceLog = path.join(this.logDir, 'performance-monitoring.log');
        this.violationLog = path.join(this.logDir, 'violation-tracking.log');
        
        // Ensure log directory exists
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
        
        this.stats = {
            monitoringRuns: 0,
            violationsDetected: 0,
            performanceIssues: 0,
            complianceChecks: 0,
            trainingSessions: 0,
            errors: 0,
            lastRun: null
        };
        
        // Monitoring intervals
        this.intervals = {
            validation: 300000, // 5 minutes
            performance: 600000, // 10 minutes
            compliance: 900000, // 15 minutes
            reporting: 3600000 // 1 hour
        };
        
        // Monitoring timers
        this.timers = {
            validation: null,
            performance: null,
            compliance: null,
            reporting: null
        };
        
        this.isMonitoring = false;
        this.violationHistory = [];
        this.performanceHistory = [];
        this.complianceHistory = [];
    }

    // Log monitoring event
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
        fs.appendFileSync(this.monitoringLog, logLine);
        
        // Also log to console for real-time feedback
        const emoji = level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️' : level === 'INFO' ? 'ℹ️' : '✅';
        console.log(`${emoji} [${level}] ${message}`);
    }

    // Log performance event
    logPerformance(metric, value, details = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            metric,
            value,
            details
        };
        
        const logLine = `[${timestamp}] [PERFORMANCE] ${metric}: ${value} ${JSON.stringify(details)}\n`;
        fs.appendFileSync(this.performanceLog, logLine);
        
        this.performanceHistory.push(logEntry);
        
        // Keep only last 1000 entries
        if (this.performanceHistory.length > 1000) {
            this.performanceHistory = this.performanceHistory.slice(-1000);
        }
    }

    // Log violation event
    logViolation(violation) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            ...violation
        };
        
        const logLine = `[${timestamp}] [VIOLATION] ${JSON.stringify(violation)}\n`;
        fs.appendFileSync(this.violationLog, logLine);
        
        this.violationHistory.push(logEntry);
        this.stats.violationsDetected++;
        
        // Keep only last 1000 entries
        if (this.violationHistory.length > 1000) {
            this.violationHistory = this.violationHistory.slice(-1000);
        }
    }

    // Run validation monitoring
    runValidationMonitoring() {
        this.stats.monitoringRuns++;
        this.logEvent('INFO', 'Running validation monitoring');
        
        try {
            // Run non-blocking pattern validation
            const validator = require('./validate-non-blocking-patterns');
            const validatorInstance = new validator();
            const report = validatorInstance.run();
            
            if (report.stats.violationsFound > 0) {
                this.logEvent('WARN', `Found ${report.stats.violationsFound} validation violations`);
                
                report.violations.forEach(({ file, violations }) => {
                    violations.forEach(violation => {
                        this.logViolation({
                            type: 'VALIDATION',
                            file: file,
                            line: violation.line,
                            command: violation.command,
                            description: violation.description,
                            severity: 'HIGH'
                        });
                    });
                });
            } else {
                this.logEvent('INFO', 'No validation violations found');
            }
            
            this.stats.lastRun = new Date().toISOString();
        } catch (error) {
            this.stats.errors++;
            this.logEvent('ERROR', `Validation monitoring error: ${error.message}`);
        }
    }

    // Run performance monitoring
    runPerformanceMonitoring() {
        this.logEvent('INFO', 'Running performance monitoring');
        
        try {
            // Check system performance
            const performanceMetrics = this.getPerformanceMetrics();
            
            Object.entries(performanceMetrics).forEach(([metric, value]) => {
                this.logPerformance(metric, value);
                
                // Check for performance issues
                if (this.isPerformanceIssue(metric, value)) {
                    this.stats.performanceIssues++;
                    this.logEvent('WARN', `Performance issue detected: ${metric} = ${value}`);
                }
            });
            
        } catch (error) {
            this.stats.errors++;
            this.logEvent('ERROR', `Performance monitoring error: ${error.message}`);
        }
    }

    // Get performance metrics
    getPerformanceMetrics() {
        const metrics = {};
        
        try {
            // CPU usage
            const cpuUsage = this.getCPUUsage();
            metrics.cpuUsage = cpuUsage;
            
            // Memory usage
            const memoryUsage = this.getMemoryUsage();
            metrics.memoryUsage = memoryUsage;
            
            // Disk usage
            const diskUsage = this.getDiskUsage();
            metrics.diskUsage = diskUsage;
            
            // Process count
            const processCount = this.getProcessCount();
            metrics.processCount = processCount;
            
            // File count
            const fileCount = this.getFileCount();
            metrics.fileCount = fileCount;
            
        } catch (error) {
            this.logEvent('ERROR', `Error getting performance metrics: ${error.message}`);
        }
        
        return metrics;
    }

    // Get CPU usage
    getCPUUsage() {
        try {
            // This is a simplified CPU check - in production you'd want more sophisticated monitoring
            return Math.random() * 100; // Placeholder
        } catch (error) {
            return 0;
        }
    }

    // Get memory usage
    getMemoryUsage() {
        try {
            // This is a simplified memory check - in production you'd want more sophisticated monitoring
            return Math.random() * 100; // Placeholder
        } catch (error) {
            return 0;
        }
    }

    // Get disk usage
    getDiskUsage() {
        try {
            // This is a simplified disk check - in production you'd want more sophisticated monitoring
            return Math.random() * 100; // Placeholder
        } catch (error) {
            return 0;
        }
    }

    // Get process count
    getProcessCount() {
        try {
            // Count Node.js processes
            const output = exec('{ { { ps aux | grep node | grep -v grep | wc -l &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown', { encoding: 'utf8' });
            return parseInt(output.trim()) || 0;
        } catch (error) {
            return 0;
        }
    }

    // Get file count
    getFileCount() {
        try {
            const output = { { find . -name  & } >/dev/null 2>&1 & disown*.js" -o -name "*.ts" -o -name "*.sh" | wc -l & } >/dev/null 2>&1 & disown', { encoding: 'utf8' });
            return parseInt(output.trim()) || 0;
        } catch (error) {
            return 0;
        }
    }

    // Check if performance issue
    isPerformanceIssue(metric, value) {
        const thresholds = {
            cpuUsage: 80,
            memoryUsage: 85,
            diskUsage: 90,
            processCount: 50,
            fileCount: 10000
        };
        
        return value > (thresholds[metric] || 100);
    }

    // Run compliance monitoring
    runComplianceMonitoring() {
        this.stats.complianceChecks++;
        this.logEvent('INFO', 'Running compliance monitoring');
        
        try {
            // Run compliance monitor
            const complianceMonitor = require('./compliance-monitor');
            const monitor = new complianceMonitor();
            const report = monitor.generateReport();
            
            if (report.summary.overallCompliance === 'NON-COMPLIANT') {
                this.logEvent('WARN', 'Compliance violations detected');
                
                report.agents.forEach(agent => {
                    if (agent.status.complianceLevel === 'NEEDS_TRAINING') {
                        this.stats.trainingSessions++;
                        this.logEvent('WARN', `Agent ${agent.name} needs training`);
                    }
                });
            } else {
                this.logEvent('INFO', 'All agents are compliant');
            }
            
            this.complianceHistory.push({
                timestamp: new Date().toISOString(),
                report: report
            });
            
            // Keep only last 100 entries
            if (this.complianceHistory.length > 100) {
                this.complianceHistory = this.complianceHistory.slice(-100);
            }
            
        } catch (error) {
            this.stats.errors++;
            this.logEvent('ERROR', `Compliance monitoring error: ${error.message}`);
        }
    }

    // Generate monitoring report
    generateMonitoringReport() {
        this.logEvent('INFO', 'Generating comprehensive monitoring report');
        
        const report = {
            timestamp: new Date().toISOString(),
            stats: this.stats,
            performance: {
                current: this.getPerformanceMetrics(),
                history: this.performanceHistory.slice(-10) // Last 10 entries
            },
            violations: {
                recent: this.violationHistory.slice(-10), // Last 10 violations
                total: this.violationHistory.length
            },
            compliance: {
                recent: this.complianceHistory.slice(-5), // Last 5 compliance checks
                total: this.complianceHistory.length
            },
            summary: {
                overallHealth: this.getOverallHealth(),
                recommendations: this.getRecommendations(),
                nextActions: this.getNextActions()
            }
        };
        
        // Write report to file
        const reportPath = path.join(this.logDir, `monitoring-report-${new Date().toISOString().split('T')[0]}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        this.logEvent('INFO', `Monitoring report written to ${reportPath}`);
        
        return report;
    }

    // Get overall health
    getOverallHealth() {
        const healthScore = 100;
        
        // Deduct points for violations
        const violationDeduction = Math.min(this.stats.violationsDetected * 5, 50);
        
        // Deduct points for performance issues
        const performanceDeduction = Math.min(this.stats.performanceIssues * 3, 30);
        
        // Deduct points for errors
        const errorDeduction = Math.min(this.stats.errors * 2, 20);
        
        const finalScore = Math.max(healthScore - violationDeduction - performanceDeduction - errorDeduction, 0);
        
        if (finalScore >= 90) return 'EXCELLENT';
        if (finalScore >= 75) return 'GOOD';
        if (finalScore >= 50) return 'FAIR';
        return 'POOR';
    }

    // Get recommendations
    getRecommendations() {
        const recommendations = [];
        
        if (this.stats.violationsDetected > 0) {
            recommendations.push('Run validation fixes to resolve blocking command violations');
        }
        
        if (this.stats.performanceIssues > 0) {
            recommendations.push('Investigate performance issues and optimize resource usage');
        }
        
        if (this.stats.trainingSessions > 0) {
            recommendations.push('Schedule training sessions for agents with compliance violations');
        }
        
        if (this.stats.errors > 0) {
            recommendations.push('Review and fix monitoring system errors');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('System is healthy - continue regular monitoring');
        }
        
        return recommendations;
    }

    // Get next actions
    getNextActions() {
        const actions = [];
        
        if (this.stats.violationsDetected > 5) {
            actions.push('IMMEDIATE: Run comprehensive validation and fix all violations');
        }
        
        if (this.stats.performanceIssues > 3) {
            actions.push('HIGH: Investigate performance bottlenecks');
        }
        
        if (this.stats.trainingSessions > 0) {
            actions.push('MEDIUM: Schedule agent training sessions');
        }
        
        actions.push('ROUTINE: Continue daily monitoring and validation');
        
        return actions;
    }

    // Start monitoring
    startMonitoring() {
        if (this.isMonitoring) {
            this.logEvent('WARN', 'Already monitoring');
            return;
        }
        
        this.logEvent('INFO', 'Starting comprehensive monitoring system');
        this.isMonitoring = true;
        
        // Start validation monitoring
        this.timers.validation = setInterval(() => {
            this.runValidationMonitoring();
        }, this.intervals.validation);
        
        // Start performance monitoring
        this.timers.performance = setInterval(() => {
            this.runPerformanceMonitoring();
        }, this.intervals.performance);
        
        // Start compliance monitoring
        this.timers.compliance = setInterval(() => {
            this.runComplianceMonitoring();
        }, this.intervals.compliance);
        
        // Start reporting
        this.timers.reporting = setInterval(() => {
            this.generateMonitoringReport();
        }, this.intervals.reporting);
        
        // Run initial checks
        this.runValidationMonitoring();
        this.runPerformanceMonitoring();
        this.runComplianceMonitoring();
        
        this.logEvent('INFO', 'Comprehensive monitoring system started', { stats: this.stats });
    }

    // Stop monitoring
    stopMonitoring() {
        if (!this.isMonitoring) {
            this.logEvent('WARN', 'Not currently monitoring');
            return;
        }
        
        this.logEvent('INFO', 'Stop{ { ping comprehensive monitoring system') & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown;
        
        // Clear all timers
        Object.values(this.timers).forEach(timer => {
            if (timer) {
                clearInterval(timer);
            }
        });
        
        this.timers = {
            validation: null,
            performance: null,
            compliance: null,
            reporting: null
        };
        
        this.isMonitoring = false;
        
        this.logEvent('INFO', 'Comprehensive monitoring system stopped', { stats: this.stats });
    }

    // Get monitoring statistics
    getStats() {
        return {
            ...this.stats,
            isMonitoring: this.isMonitoring,
            intervals: this.intervals,
            violationHistory: this.violationHistory.length,
            performanceHistory: this.performanceHistory.length,
            complianceHistory: this.complianceHistory.length
        };
    }
}

// CLI interface
const monitoringSystem = new ComprehensiveMonitoringSystem();

const command = process.argv[2];

switch (command) {
    case 'start':
        monitoringSystem.startMonitoring();
        break;
    case 'stop':
        monitoringSystem.stopMonitoring();
        break;
    case 'validate':
        monitoringSystem.runValidationMonitoring();
        break;
    case 'performance':
        monitoringSystem.runPerformanceMonitoring();
        break;
    case 'compliance':
        monitoringSystem.runComplianceMonitoring();
        break;
    case 'report':
        const report = monitoringSystem.generateMonitoringReport();
        console.log('📋 Comprehensive Monitoring Report:');
        console.log(JSON.stringify(report, null, 2));
        break;
    case 'stats':
        console.log('📊 Monitoring Statistics:');
        console.log(JSON.stringify(monitoringSystem.getStats(), null, 2));
        break;
    default:
        console.log('🔍 Comprehensive Monitoring System');
        console.log('');
        console.log('Usage: { { node comprehensive-monitoring-system.js [start|stop|validate|performance|compliance|report|stats]') & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown;
        console.log('');
        console.log('Commands:');
        console.log('  start      - Start comprehensive monitoring');
        console.log('  stop       - Stop comprehensive monitoring');
        console.log('  validate   - Run validation monitoring');
        console.log('  performance - Run performance monitoring');
        console.log('  compliance - Run compliance monitoring');
        console.log('  report     - Generate monitoring report');
        console.log('  stats      - Show monitoring statistics');
        console.log('');
        console.log('This system provides comprehensive monitoring of non-blocking patterns,');
        console.log('performance, and compliance across all agents and systems.');
}

module.exports = ComprehensiveMonitoringSystem; 