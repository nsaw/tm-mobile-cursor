#!/usr/bin/env node

/**
 * Live Patch Status
 * Real-time live view of patch execution status
 * Continuously updates and displays status in the terminal
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class LivePatchStatus {
    constructor() {
        this.projectRoot = process.cwd();
        // FIXED: Point to correct patches directory
        this.patchesPath = path.join(this.projectRoot, 'mobile-native-fresh', 'tasks', 'patches');
        this.summariesPath = path.join(this.projectRoot, 'mobile-native-fresh', 'tasks', 'summaries');
        this.logsPath = path.join(this.projectRoot, 'logs');
        
        // Parse command line arguments for tail length
        this.tailLength = 10; // default to 10 for recent events
        if (process.argv.includes('--5')) {
            this.tailLength = 5;
        }
        
        this.status = {
            patches: { pending: 0, executing: 0, completed: 0, failed: 0, queue: [] },
            systems: { running: [], stopped: [], errors: [] },
            ghost: { status: 'unknown', lastCheck: null, url: 'https://runner.thoughtmarks.app/health' },
            recentActivity: [],
            executionQueue: [],
            lastUpdate: null
        };
        
        this.updateInterval = null;
        this.updateCount = 0;
        this.isRunning = false;
    }

    // Start live monitoring
    start() {
        this.isRunning = true;
        console.log('🔍 **LIVE PATCH STATUS MONITOR**');
        console.log('Press Ctrl+C to stop\n');
        
        // Initial update
        this.updateDisplay();
        
        // Set up interval for updates
        this.updateInterval = setInterval(() => {
            this.updateDisplay();
        }, 3000); // Update every 3 seconds
    }

    // Stop live monitoring
    stop() {
        this.isRunning = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        console.log('\n🛑 Live monitoring stopped');
    }

    // Update and display status
    async updateDisplay() {
        await this.updateStatus();
        this.clearScreen();
        this.displayStatus();
        this.updateCount++;
    }

    // Clear screen for fresh display
    clearScreen() {
        process.stdout.write('\x1B[2J\x1B[0f'); // Clear screen and move cursor to top
    }

    // Update current status with proper async handling
    async updateStatus() {
        await Promise.all([
            this.checkPatchStatus(),
            this.checkSystemStatus(),
            this.checkGhostStatus(),
            this.getRecentActivity(),
            this.getExecutionQueue()
        ]);
        
        this.status.lastUpdate = new Date().toISOString();
    }

    // Check patch status with correct paths
    async checkPatchStatus() {
        try {
            const patchStatus = { pending: 0, executing: 0, completed: 0, failed: 0, queue: [] };
            
            if (fs.existsSync(this.patchesPath)) {
                // Check main patches directory for pending patches
                const mainPatches = fs.readdirSync(this.patchesPath)
                    .filter(file => file.endsWith('.json') && file.startsWith('patch-'))
                    .filter(file => !file.includes('.archive') && !file.includes('.completed') && !file.includes('.failed'));
                
                patchStatus.pending = mainPatches.length;
                patchStatus.queue = mainPatches.slice(0, 5); // Show next 5 in queue
                
                // Check completed patches
                const completedPath = path.join(this.patchesPath, '.completed');
                if (fs.existsSync(completedPath)) {
                    patchStatus.completed = fs.readdirSync(completedPath).filter(f => f.endsWith('.json')).length;
                }
                
                // Check failed patches
                const failedPath = path.join(this.patchesPath, '.failed');
                if (fs.existsSync(failedPath)) {
                    patchStatus.failed = fs.readdirSync(failedPath).filter(f => f.endsWith('.json')).length;
                }
                
                // Check archived patches
                const archivePath = path.join(this.patchesPath, '.archive');
                if (fs.existsSync(archivePath)) {
                    const archived = fs.readdirSync(archivePath).filter(f => f.endsWith('.json')).length;
                    patchStatus.completed += archived;
                }
            }
            
            this.status.patches = patchStatus;
        } catch (error) {
            console.error('Error checking patch status:', error.message);
        }
    }

    // Check system status with proper async handling
    async checkSystemStatus() {
        const systems = { running: [], stopped: [], errors: [] };
        
        const checkProcess = (processName, displayName) => {
            return new Promise((resolve) => {
                exec(`ps aux | grep "${processName}" | grep -v grep`, (error, stdout) => {
                    if (stdout.trim()) {
                        systems.running.push(displayName);
                    } else {
                        systems.stopped.push(displayName);
                    }
                    resolve();
                });
            });
        };
        
        await Promise.all([
            checkProcess('patch-executor', 'patch-executor'),
            checkProcess('ghost-bridge', 'ghost-bridge'),
            checkProcess('summary-monitor', 'summary-monitor'),
            checkProcess('realtime-monitor', 'realtime-monitor'),
            checkProcess('expo', 'expo-dev-server'),
            checkProcess('nodemon', 'backend-api')
        ]);
        
        this.status.systems = systems;
    }

    // Check ghost runner status with proper async handling
    async checkGhostStatus() {
        return new Promise((resolve) => {
            exec(`curl -s --connect-timeout 5 "${this.status.ghost.url}"`, (error, stdout) => {
                if (error) {
                    this.status.ghost = {
                        status: 'unreachable',
                        lastCheck: new Date().toISOString(),
                        url: this.status.ghost.url
                    };
                } else {
                    try {
                        const response = JSON.parse(stdout);
                        this.status.ghost = {
                            status: response.status || 'running',
                            lastCheck: new Date().toISOString(),
                            url: this.status.ghost.url
                        };
                    } catch (e) {
                        this.status.ghost = {
                            status: 'running',
                            lastCheck: new Date().toISOString(),
                            url: this.status.ghost.url
                        };
                    }
                }
                resolve();
            });
        });
    }

    // Get recent activity with longer tail (10 items)
    async getRecentActivity() {
        try {
            if (fs.existsSync(this.summariesPath)) {
                const summaryFiles = fs.readdirSync(this.summariesPath)
                    .filter(f => f.endsWith('.md'))
                    .sort((a, b) => {
                        const aStat = fs.statSync(path.join(this.summariesPath, a));
                        const bStat = fs.statSync(path.join(this.summariesPath, b));
                        return bStat.mtime - aStat.mtime;
                    })
                    .slice(0, this.tailLength); // Show configurable tail length
                
                this.status.recentActivity = summaryFiles.map(file => {
                    const stat = fs.statSync(path.join(this.summariesPath, file));
                    return {
                        file: file,
                        time: stat.mtime.toLocaleTimeString(),
                        date: stat.mtime.toLocaleDateString(),
                        size: stat.size
                    };
                });
            } else {
                this.status.recentActivity = [];
            }
        } catch (error) {
            this.status.recentActivity = [];
        }
    }

    // Get execution queue status
    async getExecutionQueue() {
        try {
            const queue = [];
            
            // Check for any running patch execution
            await new Promise((resolve) => {
                exec('ps aux | grep "patch-executor" | grep -v grep', (error, stdout) => {
                    if (stdout.trim()) {
                        queue.push({ type: 'executing', name: 'patch-executor', status: 'running' });
                    }
                    resolve();
                });
            });
            
            // Check for any pending patches in the main directory
            if (fs.existsSync(this.patchesPath)) {
                const pendingPatches = fs.readdirSync(this.patchesPath)
                    .filter(file => file.endsWith('.json') && file.startsWith('patch-'))
                    .filter(file => !file.includes('.archive') && !file.includes('.completed') && !file.includes('.failed'))
                    .slice(0, 5);
                
                pendingPatches.forEach(patch => {
                    queue.push({ type: 'pending', name: patch, status: 'queued' });
                });
            }
            
            this.status.executionQueue = queue;
        } catch (error) {
            this.status.executionQueue = [];
        }
    }

    // Display live status
    displayStatus() {
        const patches = this.status.patches;
        const systems = this.status.systems;
        const ghost = this.status.ghost;
        const recent = this.status.recentActivity;
        const queue = this.status.executionQueue;
        
        console.log('🔍 **LIVE PATCH EXECUTION STATUS**');
        console.log('=' .repeat(60));
        console.log(`📅 ${new Date().toLocaleString()} | Update #${this.updateCount}`);
        console.log('');
        
        // Patch Status
        console.log('📦 **Patch Status:**');
        console.log(`   • Pending: ${patches.pending} | Executing: ${patches.executing} | Completed: ${patches.completed} | Failed: ${patches.failed}`);
        
        if (patches.pending > 0) {
            console.log('   ⚠️  PENDING PATCHES DETECTED!');
        }
        
        console.log('');
        
        // Execution Queue
        if (queue.length > 0) {
            console.log('🔄 **Execution Queue:**');
            queue.forEach(item => {
                const icon = item.type === 'executing' ? '⚡' : '⏳';
                console.log(`   ${icon} ${item.name} (${item.status})`);
            });
            console.log('');
        }
        
        // System Status
        console.log('🖥️ **System Status:**');
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
        console.log('👻 **Ghost Runner:**');
        console.log(`   Status: ${ghost.status.toUpperCase()}`);
        if (ghost.lastCheck) {
            console.log(`   Last Check: ${new Date(ghost.lastCheck).toLocaleTimeString()}`);
        }
        console.log(`   URL: ${ghost.url}`);
        
        console.log('');
        
        // Recent Activity (configurable items)
        if (recent.length > 0) {
            console.log(`📋 **Recent Activity (Last ${this.tailLength}):**`);
            recent.forEach(activity => {
                console.log(`   📄 ${activity.file} (${activity.time})`);
            });
            console.log('');
        }
        
        console.log('🕐 **Last Update:** ' + new Date().toLocaleTimeString());
        console.log('');
        console.log('Press Ctrl+C to stop live monitoring');
    }

    // Execute pending patches
    async executePatches() {
        return new Promise((resolve, reject) => {
            exec('node scripts/patch-executor.js execute', (error, stdout, stderr) => {
                if (error) {
                    reject(`Patch execution failed: ${error.message}`);
                } else {
                    resolve(`Patch execution completed:\n${stdout}`);
                }
            });
        });
    }
}

// CLI interface
const liveStatus = new LivePatchStatus();

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    liveStatus.stop();
    process.exit(0);
});

const command = process.argv[2];

switch (command) {
    case 'start':
        liveStatus.start();
        break;
    case 'stop':
        liveStatus.stop();
        break;
    case 'execute':
        liveStatus.executePatches()
            .then(result => console.log(result))
            .catch(error => console.error(error));
        break;
    case 'snapshot':
        // New snapshot mode for web server
        (async () => {
            try {
                await liveStatus.updateStatus();
                liveStatus.displayStatus();
                process.exit(0);
            } catch (error) {
                console.error('Error generating snapshot:', error);
                process.exit(1);
            }
        })();
        break;
    default:
        console.log('🔍 Live Patch Status Monitor');
        console.log('');
        console.log('Usage: node live-patch-status.js [start|stop|execute|snapshot] [--10]');
        console.log('');
        console.log('Commands:');
        console.log('  start    - Start live monitoring (updates every 3 seconds)');
        console.log('  stop     - Stop live monitoring');
        console.log('  execute  - Execute pending patches');
        console.log('  snapshot - Generate single status snapshot');
        console.log('');
        console.log('Options:');
        console.log('  --10     - Show last 10 activities instead of 5');
        console.log('');
        console.log('Examples:');
        console.log('  node live-patch-status.js start        # Default 5-item tail');
        console.log('  node live-patch-status.js start --10   # 10-item tail');
        console.log('  node live-patch-status.js snapshot     # Single status snapshot');
        console.log('');
        console.log('This provides live real-time patch execution status');
        console.log('with continuous updates and clear terminal display.');
} 