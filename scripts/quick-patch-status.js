#!/usr/bin/env node

/**
 * Quick Patch Status
 * Simple status display for agent chat
 * Shows current patch execution status
 */

const fs = require('fs');
const path = require('path');
const { concatenateFilename } = require('./filename-concatenator');

function getPatchStatus() {
    const projectRoot = process.cwd();
    const patchesPath = path.join(projectRoot, 'mobile-native-fresh', 'src-nextgen', 'patches');
    const summariesPath = path.join(projectRoot, 'mobile-native-fresh', 'tasks', 'summaries');
    
    let status = {
        pending: 0,
        executing: 0,
        completed: 0,
        failed: 0,
        recent: []
    };
    
    try {
        // Count patches by status
        if (fs.existsSync(patchesPath)) {
            const completed = fs.readdirSync(path.join(patchesPath, '.completed')).length;
            const failed = fs.readdirSync(path.join(patchesPath, '.failed')).length;
            const archived = fs.readdirSync(path.join(patchesPath, '.archive')).length;
            
            status.completed = completed;
            status.failed = failed;
            status.pending = archived; // Archived patches as pending
        }
        
        // Get recent summaries
        if (fs.existsSync(summariesPath)) {
            const summaries = fs.readdirSync(summariesPath)
                .filter(file => file.endsWith('.md'))
                .sort()
                .reverse()
                .slice(0, 5);
            
            status.recent = summaries.map(file => ({
                file,
                time: fs.statSync(path.join(summariesPath, file)).mtime.toLocaleTimeString()
            }));
        }
        
    } catch (error) {
        console.error('Error getting patch status:', error.message);
    }
    
    return status;
}

function formatStatus(status) {
    let output = '🔍 **PATCH EXECUTION STATUS**\n\n';
    
    output += `📦 **Patch Status:**\n`;
    output += `   • Pending: ${status.pending}\n`;
    output += `   • Executing: ${status.executing}\n`;
    output += `   • Completed: ${status.completed}\n`;
    output += `   • Failed: ${status.failed}\n\n`;
    
    if (status.recent.length > 0) {
        output += `📋 **Recent Activity:**\n`;
        status.recent.forEach(item => {
            const concatenatedFile = concatenateFilename(item.file);
            output += `   📄 ${concatenatedFile} (${item.time})\n`;
        });
        output += `\n`;
    }
    
    output += `🕐 **Last Update:** ${new Date().toLocaleTimeString()}`;
    
    return output;
}

// CLI interface
const command = process.argv[2];

switch (command) {
    case 'status':
        const status = getPatchStatus();
        console.log(formatStatus(status));
        break;
    case 'json':
        const statusJson = getPatchStatus();
        console.log(JSON.stringify(statusJson, null, 2));
        break;
    default:
        console.log('🔍 Quick Patch Status');
        console.log('');
        console.log('Usage: node quick-patch-status.js [status|json]');
        console.log('');
        console.log('Commands:');
        console.log('  status - Show formatted status for agent chat');
        console.log('  json   - Show status as JSON');
        console.log('');
        console.log('This provides quick patch execution status');
        console.log('formatted for display in the agent chat interface.');
} 