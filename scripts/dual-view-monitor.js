#!/usr/bin/env { { { { node

/** & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
 * Dual View Monitor
 * Shows patch execution status in real-time for agent chat
 * Provides live monitoring of patch execution and system status
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { concatenateFilename } = require('./filename-concatenator');

class DualViewMonitor {
    constructor() {
        this.projectRoot = process.cwd();
        this.patchesPath = '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches';
        this.summariesPath = path.resolve('/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries');
        this.logsPath = path.join(this.projectRoot, 'logs');
        
        this.monitoring = false;
        this.statusInterval = null;
        this.lastStatus = {};
        
        // Status categories
        this.statusCategories = {
            patches: { pending: 0, executing: 0, completed: 0, failed: 0 },
            systems: { running: [], stopped: [], errors: [] },
            ghost: { status: 'unknown', lastCheck: null },
            execution: { current: null, queue: [], history: [] }
        };
    }

    // Start dual view monitoring
    start() {
        console.log('🔍 Starting Dual View Monitor...');
        this.monitoring = true;
        
        // Initial status check
        this.updateStatus();
        
        // Set up periodic status updates
        this.statusInterval = setInterval(() => {
            this.updateStatus();
        }, 5000); // Update every 5 seconds
        
        // Set up file watchers
        this.watchPatches();
        this.watchSummaries();
        
        console.log('✅ Dual View Monitor started');
        console.log('📊 Status updates every 5 seconds');
        console.log('👁️  Watching for patch and summary changes');
    }

    // Stop monitoring
    stop() {
        console.log('🛑 Stop{ { ping Dual View Monitor...') & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown;
        this.monitoring = false;
        
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
            this.statusInterval = null;
        }
        
        console.log('✅ Dual View Monitor stopped');
    }

    // Update current status
    updateStatus() {
        this.checkPatchStatus();
        this.checkSystemStatus();
        this.checkGhostStatus();
        this.displayStatus();
    }

    // Extract patch ID from filename
    extractPatchId(filename) {
        if (filename.startsWith('patch-')) {
            return filename.replace(/^patch-/, '').replace(/\.json$/, '');
        }
        if (filename.startsWith('summary-')) {
            return filename.replace(/^summary-/, '').replace(/\.md$/, '');
        }
        return filename.replace(/\.(json|md)$/, '');
    }

    // Check patch status using the same logic as live-patch-status.js
    checkPatchStatus() {
        try {
            // Get patch files
            const patchDirContents = fs.readdirSync(this.patchesPath);
            const patchFiles = patchDirContents
                .filter(f => f.endsWith('.json'))
                .filter(f => !f.startsWith('.')) // Exclude hidden files
                .filter(f => fs.existsSync(path.join(this.patchesPath, f))); // Ensure exists

            // Get summary files
            const summaryDirContents = fs.readdirSync(this.summariesPath);
            const summaryFiles = summaryDirContents
                .filter(f => f.endsWith('.md'))
                .filter(f => !f.startsWith('.')) // Exclude hidden files
                .filter(f => fs.existsSync(path.join(this.summariesPath, f))); // Ensure exists

            // Extract completed patch IDs from summary files
            const completedIds = summaryFiles.map(f => this.extractPatchId(f));

            // Filter pending patches - only include patches that don't have corresponding summaries
            const pendingPatches = patchFiles.filter(patchFile => {
                const patchId = this.extractPatchId(patchFile);
                return !completedIds.includes(patchId);
            });

            const status = {
                pending: pendingPatches.length,
                executing: 0,
                completed: completedIds.length,
                failed: 0
            };
            
            this.statusCategories.patches = status;
        } catch (error) {
            console.error('❌ Error checking patch status:', error.message);
            this.statusCategories.patches = { pending: 0, executing: 0, completed: 0, failed: 0 };
        }
    }

    // Check system status synchronously
    checkSystemStatus() {
        const systems = {
            running: [],
            stopped: [],
            errors: []
        };
        
        try {
            // Check if patch executor is running
            const patchExecutorCheck = require('child_process').execSync('{ { ps aux | grep  & } >/dev/null 2>&1 & disown', { stdio: 'pipe' })patch-executor" | grep -v grep & } >/dev/null 2>&1 & disown', { stdio: 'pipe' });
            if (patchExecutorCheck.trim()) {
                systems.running.push('patch-executor');
            } else {
                systems.stopped.push('patch-executor');
            }
        } catch (error) {
            systems.stopped.push('patch-executor');
        }
        
        try {
            // Check if ghost bridge is running
            const ghostBridgeCheck = require('child_process').execSync('{ { ps aux | grep  & } >/dev/null 2>&1 & disown', { stdio: 'pipe' })ghost-bridge" | grep -v grep & } >/dev/null 2>&1 & disown', { stdio: 'pipe' });
            if (ghostBridgeCheck.trim()) {
                systems.running.push('ghost-bridge');
            } else {
                systems.stopped.push('ghost-bridge');
            }
        } catch (error) {
            systems.stopped.push('ghost-bridge');
        }
        
        try {
            // Check if summary monitor is running
            const summaryMonitorCheck = require('child_process').execSync('{ { ps aux | grep  & } >/dev/null 2>&1 & disown', { stdio: 'pipe' })summary-monitor" | grep -v grep & } >/dev/null 2>&1 & disown', { stdio: 'pipe' });
            if (summaryMonitorCheck.trim()) {
                systems.running.push('summary-monitor');
            } else {
                systems.stopped.push('summary-monitor');
            }
        } catch (error) {
            systems.stopped.push('summary-monitor');
        }
        
        try {
            // Check if expo is running
            const expoCheck = require('child_process').execSync('{ { ps aux | grep  & } >/dev/null 2>&1 & disown', { stdio: 'pipe' })expo" | grep -v grep & } >/dev/null 2>&1 & disown', { stdio: 'pipe' });
            if (expoCheck.trim()) {
                systems.running.push('expo');
            } else {
                systems.stopped.push('expo');
            }
        } catch (error) {
            systems.stopped.push('expo');
        }
        
        this.statusCategories.systems = systems;
    }

    // Check ghost runner status synchronously
    checkGhostStatus() {
        try {
            // Check ghost runner health
            const curlCheck = require('child_process').execSync('{ { { curl -s -m 5 https://runner.thoughtmarks.app/health &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown', { stdio: 'pipe' });
            if (curlCheck.trim()) {
                this.statusCategories.ghost.status = 'healthy';
            } else {
                this.statusCategories.ghost.status = 'unhealthy';
            }
        } catch (error) {
            this.statusCategories.ghost.status = 'error';
        }
    }

    // Display current status
    displayStatus() {
        console.clear();
        console.log('🔍 DUAL VIEW MONITOR - PATCH EXECUTION STATUS');
        console.log('=' .repeat(60));
        console.log(`📅 ${new Date().toLocaleString()}`);
        console.log('');
        
        // Patch Status
        console.log('📦 PATCH STATUS:');
        const patches = this.statusCategories.patches;
        console.log(`   Pending: ${patches.pending} | Executing: ${patches.executing} | Completed: ${patches.completed} | Failed: ${patches.failed}`);
        
        if (patches.pending > 0) {
            console.log('   ⚠️  Pending patches detected!');
        }
        
        console.log('');
        
        // Execution Queue
        console.log('🔄 EXECUTION QUEUE:');
        this.showExecutionQueue();
        
        console.log('');
        
        // System Status
        console.log('🖥️  SYSTEM STATUS:');
        const systems = this.statusCategories.systems;
        if (systems.running.length > 0) {
            console.log(`   ✅ Running: ${systems.running.join(', ')}`);
        }
        if (systems.stopped.length > 0) {
            console.log(`   ❌ Stopped: ${systems.stopped.join(', ')}`);
        }
        if (systems.errors.length > 0) {
            console.log(`   🚨 Errors: ${systems.errors.join(', ')}`);
        }
        
        console.log('');
        
        // Ghost Status
        console.log('👻 GHOST RUNNER STATUS:');
        const ghost = this.statusCategories.ghost;
        console.log(`   Status: ${ghost.status.toUpperCase()}`);
        if (ghost.lastCheck) {
            console.log(`   Last Check: ${new Date(ghost.lastCheck).toLocaleTimeString()}`);
        }
        
        console.log('');
        
        // Recent Activity
        console.log('📋 RECENT ACTIVITY:');
        this.showRecentActivity();
        
        console.log('');
        console.log('=' .repeat(60));
        console.log('💡 Commands: start | stop | execute | status');
    }

    // Show execution queue
    showExecutionQueue() {
        try {
            const patchFiles = fs.readdirSync(this.patchesPath)
                .filter(f => f.endsWith('.json'))
                .filter(f => !f.startsWith('.'))
                .filter(f => fs.existsSync(path.join(this.patchesPath, f)));

            const summaryFiles = fs.readdirSync(this.summariesPath)
                .filter(f => f.endsWith('.md'))
                .filter(f => !f.startsWith('.'))
                .filter(f => fs.existsSync(path.join(this.summariesPath, f)));

            const completedIds = summaryFiles.map(f => this.extractPatchId(f));
            const pendingPatches = patchFiles.filter(patchFile => {
                const patchId = this.extractPatchId(patchFile);
                return !completedIds.includes(patchId);
            });

            if (pendingPatches.length > 0) {
                pendingPatches.forEach(patch => {
                    console.log(`   ⏳ ${patch} (queued)`);
                });
            } else {
                console.log('   ✅ No pending patches in queue');
            }
        } catch (error) {
            console.log('   Error reading execution queue');
        }
    }

    // Show recent activity
    showRecentActivity() {
        try {
            const summaryFiles = fs.readdirSync(this.summariesPath)
                .filter(f => f.endsWith('.md'))
                .sort((a, b) => {
                    const aStat = fs.statSync(path.join(this.summariesPath, a));
                    const bStat = fs.statSync(path.join(this.summariesPath, b));
                    return bStat.mtime - aStat.mtime;
                })
                .slice(0, 6);
            
            if (summaryFiles.length > 0) {
                summaryFiles.forEach(file => {
                    const stat = fs.statSync(path.join(this.summariesPath, file));
                    const concatenatedFile = concatenateFilename(file);
                    console.log(`   📄 ${concatenatedFile} (${stat.mtime.toLocaleTimeString()})`);
                });
            } else {
                console.log('   No recent activity');
            }
        } catch (error) {
            console.log('   Error reading recent activity');
        }
    }

    // Watch patches directory
    watchPatches() {
        const watcher = fs.watch(this.patchesPath, (eventType, filename) => {
            if (filename && filename.endsWith('.json')) {
                console.log(`📦 Patch file change detected: ${filename}`);
                this.updateStatus();
            }
        });
        
        console.log('👁️  Watching patches directory...');
    }

    // Watch summaries directory
    watchSummaries() {
        const watcher = fs.watch(this.summariesPath, (eventType, filename) => {
            if (filename && filename.endsWith('.md')) {
                console.log(`📫 Summary file change detected: ${filename}`);
                this.updateStatus();
            }
        });
        
        console.log('👁️  Watching summaries directory...');
    }

    // Execute pending patches
    executePatches() {
        console.log('🚀 Executing pending patches...');
        
        exec('{ { { node scripts/direct-patch-executor.js &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Patch execution failed:', error.message);
            } else {
                console.log('✅ Patch execution completed');
                console.log(stdout);
            }
        });
    }

    // Get detailed status
    getDetailedStatus() {
        return {
            timestamp: new Date().toISOString(),
            patches: this.statusCategories.patches,
            systems: this.statusCategories.systems,
            ghost: this.statusCategories.ghost,
            execution: this.statusCategories.execution
        };
    }
}

// CLI interface
const monitor = new DualViewMonitor();

const command = process.argv[2];

switch (command) {
    case 'start':
        monitor.start();
        break;
    case 'stop':
        monitor.stop();
        break;
    case 'execute':
        monitor.executePatches();
        break;
    case 'status':
        monitor.updateStatus();
        break;
    default:
        console.log('🔍 Dual View Monitor');
        console.log('');
        console.log('Usage: { { node dual-view-monitor.js [start|stop|execute|status]') & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown;
        console.log('');
        console.log('Commands:');
        console.log('  start   - Start monitoring patch execution status');
        console.log('  stop    - Stop monitoring');
        console.log('  execute - Execute pending patches');
        console.log('  status  - Show current status once');
        console.log('');
        console.log('This monitor provides real-time patch execution status');
        console.log('for display in the agent chat interface.');
} 