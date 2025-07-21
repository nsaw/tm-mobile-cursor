#!/usr/bin/env node

/**
 * Dual View Monitor
 * Shows patch execution status in real-time for agent chat
 * Provides live monitoring of patch execution and system status
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class DualViewMonitor {
    constructor() {
        this.projectRoot = process.cwd();
        this.patchesPath = path.join(this.projectRoot, 'mobile-native-fresh', 'tasks', 'patches');
        this.summariesPath = path.join(this.projectRoot, 'mobile-native-fresh', 'tasks', 'summaries');
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
        console.log('🛑 Stopping Dual View Monitor...');
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

    // Check patch status
    checkPatchStatus() {
        try {
            const patchFiles = fs.readdirSync(this.patchesPath);
            const status = { pending: 0, executing: 0, completed: 0, failed: 0 };
            
            patchFiles.forEach(file => {
                if (file.endsWith('.json')) {
                    status.pending++;
                }
            });
            
            // Check archive and failed directories
            const archivePath = path.join(this.patchesPath, '.archive');
            const failedPath = path.join(this.patchesPath, '.failed');
            
            if (fs.existsSync(archivePath)) {
                const archived = fs.readdirSync(archivePath).filter(f => f.endsWith('.json')).length;
                status.completed += archived;
            }
            
            if (fs.existsSync(failedPath)) {
                const failed = fs.readdirSync(failedPath).filter(f => f.endsWith('.json')).length;
                status.failed += failed;
            }
            
            this.statusCategories.patches = status;
        } catch (error) {
            console.error('❌ Error checking patch status:', error.message);
        }
    }

    // Check system status
    checkSystemStatus() {
        const systems = {
            running: [],
            stopped: [],
            errors: []
        };
        
        // Check if patch executor is running
        exec('ps aux | grep "patch-executor" | grep -v grep', (error, stdout) => {
            if (stdout.trim()) {
                systems.running.push('patch-executor');
            } else {
                systems.stopped.push('patch-executor');
            }
        });
        
        // Check if ghost bridge is running
        exec('ps aux | grep "ghost-bridge" | grep -v grep', (error, stdout) => {
            if (stdout.trim()) {
                systems.running.push('ghost-bridge');
            } else {
                systems.stopped.push('ghost-bridge');
            }
        });
        
        // Check if summary monitor is running
        exec('ps aux | grep "summary-monitor" | grep -v grep', (error, stdout) => {
            if (stdout.trim()) {
                systems.running.push('summary-monitor');
            } else {
                systems.stopped.push('summary-monitor');
            }
        });
        
        this.statusCategories.systems = systems;
    }

    // Check ghost runner status
    checkGhostStatus() {
        // Check if gpt-cursor-runner is accessible
        exec('curl -s https://runner.thoughtmarks.app/health', (error, stdout) => {
            if (error) {
                this.statusCategories.ghost = {
                    status: 'unreachable',
                    lastCheck: new Date().toISOString()
                };
            } else {
                this.statusCategories.ghost = {
                    status: 'running',
                    lastCheck: new Date().toISOString()
                };
            }
        });
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
                .slice(0, 3);
            
            if (summaryFiles.length > 0) {
                summaryFiles.forEach(file => {
                    const stat = fs.statSync(path.join(this.summariesPath, file));
                    console.log(`   📄 ${file} (${stat.mtime.toLocaleTimeString()})`);
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
                console.log(`📄 Summary file change detected: ${filename}`);
                this.updateStatus();
            }
        });
        
        console.log('👁️  Watching summaries directory...');
    }

    // Execute pending patches
    executePatches() {
        console.log('🚀 Executing pending patches...');
        
        exec('node scripts/patch-executor.js execute', (error, stdout, stderr) => {
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
        console.log('Usage: node dual-view-monitor.js [start|stop|execute|status]');
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