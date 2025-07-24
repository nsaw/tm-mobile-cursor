#!/usr/bin/env { { { { node

/** & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
 * Lightweight Status Checker
 * Minimal resource usage, no live monitoring
 */

const fs = require('fs');
const path = require('path');

class LightweightStatus {
    constructor() {
        this.projectRoot = process.cwd();
        this.patchesPath = '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches';
        this.summariesPath = path.join(this.projectRoot, 'mobile-native-fresh', 'tasks', 'summaries');
        this.logsPath = path.join(this.projectRoot, 'logs');
    }

    // Check if log file exists and is recent
    isLogActive(logName) {
        const logFile = path.join(this.logsPath, `${logName}.log`);
        if (fs.existsSync(logFile)) {
            try {
                const stats = fs.statSync(logFile);
                const now = new Date();
                const fileAge = now - stats.mtime;
                return fileAge < 10 * 60 * 1000; // 10 minutes
            } catch (e) {
                return false;
            }
        }
        return false;
    }

    // Get patch status
    getPatchStatus() {
        try {
            const status = { pending: 0, executing: 0, completed: 0, failed: 0 };
            
            if (fs.existsSync(this.patchesPath)) {
                const mainPatches = fs.readdirSync(this.patchesPath)
                    .filter(file => file.endsWith('.json') && file.startsWith('patch-'))
                    .filter(file => !file.includes('.archive') && !file.includes('.completed') && !file.includes('.failed'));
                
                status.pending = mainPatches.length;
                
                const completedPath = path.join(this.patchesPath, '.completed');
                if (fs.existsSync(completedPath)) {
                    status.completed = fs.readdirSync(completedPath).filter(f => f.endsWith('.json')).length;
                }
                
                const failedPath = path.join(this.patchesPath, '.failed');
                if (fs.existsSync(failedPath)) {
                    status.failed = fs.readdirSync(failedPath).filter(f => f.endsWith('.json')).length;
                }
                
                const archivePath = path.join(this.patchesPath, '.archive');
                if (fs.existsSync(archivePath)) {
                    const archived = fs.readdirSync(archivePath).filter(f => f.endsWith('.json')).length;
                    status.completed += archived;
                }
            }
            
            return status;
        } catch (error) {
            return { pending: 0, executing: 0, completed: 0, failed: 0 };
        }
    }

    // Get system status
    getSystemStatus() {
        const systems = { running: [], stopped: [] };
        
        // Check each system by log activity
        if (this.isLogActive('summary-monitor')) {
            systems.running.push('summary-monitor');
        } else {
            systems.stopped.push('summary-monitor');
        }
        
        if (this.isLogActive('ghost-bridge')) {
            systems.running.push('ghost-bridge');
        } else {
            systems.stopped.push('ghost-bridge');
        }
        
        if (this.isLogActive('patch-executor')) {
            systems.running.push('patch-executor');
        } else {
            systems.stopped.push('patch-executor');
        }
        
        if (this.isLogActive('backend')) {
            systems.running.push('backend-api');
        } else {
            systems.stopped.push('backend-api');
        }
        
        if (this.isLogActive('expo')) {
            systems.running.push('expo-dev-server');
        } else {
            systems.stopped.push('expo-dev-server');
        }
        
        return systems;
    }

    // Display status
    displayStatus() {
        const patches = this.getPatchStatus();
        const systems = this.getSystemStatus();
        
        console.log('🔍 **LIGHTWEIGHT SYSTEM STATUS**');
        console.log('=' .repeat(50));
        console.log(`📅 ${new Date().toLocaleString()}`);
        console.log('');
        
        // Patch Status
        console.log('📦 **Patch Status:**');
        console.log(`   • Pending: ${patches.pending} | Executing: ${patches.executing} | Completed: ${patches.completed} | Failed: ${patches.failed}`);
        console.log('');
        
        // System Status
        console.log('🖥️ **System Status:**');
        if (systems.running.length > 0) {
            console.log(`   ✅ Running: ${systems.running.join(', ')}`);
        }
        if (systems.stopped.length > 0) {
            console.log(`   ❌ Stopped: ${systems.stopped.join(', ')}`);
        }
        console.log('');
        
        console.log('🕐 **Last Update:** ' + new Date().toLocaleTimeString());
    }
}

// Run status check
const status = new LightweightStatus();
status.displayStatus(); 