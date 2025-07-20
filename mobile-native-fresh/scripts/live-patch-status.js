#!/usr/bin/env node

// live-patch-status.js
// Provides live patch status information

const fs = require('fs');
const path = require('path');

// FIXED: Point to correct patches directory
const PATCHES_DIR = path.join(__dirname, '../tasks/patches');
const PHASES = ['phase-0', 'phase-1', 'phase-2'];

// Add recent events tracking
function getRecentEvents() {
  const events = [];
  const logsDir = path.join(__dirname, '../logs');
  
  if (fs.existsSync(logsDir)) {
    const logFiles = fs.readdirSync(logsDir)
      .filter(file => file.endsWith('.log') || file.endsWith('.txt'))
      .sort((a, b) => {
        const aPath = path.join(logsDir, a);
        const bPath = path.join(logsDir, b);
        return fs.statSync(bPath).mtime.getTime() - fs.statSync(aPath).mtime.getTime();
      })
      .slice(0, 5);
    
    logFiles.forEach(file => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      events.push({
        file,
        timestamp: stats.mtime.toISOString(),
        size: stats.size
      });
    });
  }
  
  return events;
}

function getPatchStatus() {
  const status = {
    timestamp: new Date().toISOString(),
    phases: {},
    summary: {
      total: 0,
      completed: 0,
      failed: 0,
      pending: 0
    },
    recentEvents: getRecentEvents(),
    pendingPatches: []
  };

  // Check for pending patches in tasks/patches
  if (fs.existsSync(PATCHES_DIR)) {
    const patchFiles = fs.readdirSync(PATCHES_DIR)
      .filter(file => file.endsWith('.json') && !file.startsWith('.'))
      .map(file => ({
        name: file,
        path: path.join(PATCHES_DIR, file),
        timestamp: fs.statSync(path.join(PATCHES_DIR, file)).mtime.toISOString()
      }));
    
    status.pendingPatches = patchFiles;
    status.summary.pending = patchFiles.length;
    status.summary.total += patchFiles.length;
  }

  PHASES.forEach(phase => {
    const phaseDir = path.join(PATCHES_DIR, phase);
    status.phases[phase] = {
      completed: [],
      failed: [],
      pending: []
    };

    if (fs.existsSync(phaseDir)) {
      // Check for .completed directory
      const completedDir = path.join(phaseDir, '.completed');
      const failedDir = path.join(phaseDir, '.failed');
      
      // Count completed patches
      if (fs.existsSync(completedDir)) {
        const completedFiles = fs.readdirSync(completedDir);
        completedFiles.forEach(file => {
          if (file.endsWith('.json')) {
            status.phases[phase].completed.push(file);
            status.summary.completed++;
            status.summary.total++;
          }
        });
      }
      
      // Count failed patches
      if (fs.existsSync(failedDir)) {
        const failedFiles = fs.readdirSync(failedDir);
        failedFiles.forEach(file => {
          if (file.endsWith('.json')) {
            status.phases[phase].failed.push(file);
            status.summary.failed++;
            status.summary.total++;
          }
        });
      }
      
      // Count pending patches (files directly in phase directory)
      const files = fs.readdirSync(phaseDir);
      files.forEach(file => {
        if (file.endsWith('.json') && !file.startsWith('.')) {
          const completedPath = path.join(phaseDir, file + '.completed');
          const failedPath = path.join(phaseDir, file + '.failed');
          
          if (!fs.existsSync(completedPath) && !fs.existsSync(failedPath)) {
            status.phases[phase].pending.push(file);
            status.summary.pending++;
            status.summary.total++;
          }
        }
      });
    }
  });

  return status;
}

function formatSnapshot(status) {
  let output = `📊 LIVE PATCH STATUS - ${new Date().toLocaleString()}\n`;
  output += `═`.repeat(50) + `\n\n`;
  
  output += `📈 SUMMARY:\n`;
  output += `   Total: ${status.summary.total}\n`;
  output += `   Completed: ${status.summary.completed} ✅\n`;
  output += `   Failed: ${status.summary.failed} ❌\n`;
  output += `   Pending: ${status.summary.pending} ⏳\n\n`;
  
  // Show recent events
  if (status.recentEvents.length > 0) {
    output += `📅 RECENT EVENTS (Last 5):\n`;
    status.recentEvents.forEach((event, index) => {
      const date = new Date(event.timestamp).toLocaleString();
      output += `   ${index + 1}. ${event.file} (${date})\n`;
    });
    output += `\n`;
  }
  
  // Show pending patches
  if (status.pendingPatches.length > 0) {
    output += `⏳ PENDING PATCHES:\n`;
    status.pendingPatches.forEach((patch, index) => {
      const date = new Date(patch.timestamp).toLocaleString();
      output += `   ${index + 1}. ${patch.name} (${date})\n`;
    });
    output += `\n`;
  }
  
  PHASES.forEach(phase => {
    const phaseData = status.phases[phase];
    output += `📁 ${phase.toUpperCase()}:\n`;
    
    if (phaseData.completed.length > 0) {
      output += `   ✅ Completed (${phaseData.completed.length}):\n`;
      phaseData.completed.forEach(file => {
        output += `      - ${file}\n`;
      });
    }
    
    if (phaseData.failed.length > 0) {
      output += `   ❌ Failed (${phaseData.failed.length}):\n`;
      phaseData.failed.forEach(file => {
        output += `      - ${file}\n`;
      });
    }
    
    if (phaseData.pending.length > 0) {
      output += `   ⏳ Pending (${phaseData.pending.length}):\n`;
      phaseData.pending.forEach(file => {
        output += `      - ${file}\n`;
      });
    }
    
    output += `\n`;
  });
  
  return output;
}

function formatDetailed(status) {
  let output = `📊 DETAILED PATCH STATUS - ${new Date().toLocaleString()}\n`;
  output += `═`.repeat(60) + `\n\n`;
  
  output += `📈 SUMMARY:\n`;
  output += `   Total Patches: ${status.summary.total}\n`;
  output += `   ✅ Completed: ${status.summary.completed} (${((status.summary.completed / status.summary.total) * 100).toFixed(1)}%)\n`;
  output += `   ❌ Failed: ${status.summary.failed} (${((status.summary.failed / status.summary.total) * 100).toFixed(1)}%)\n`;
  output += `   ⏳ Pending: ${status.summary.pending} (${((status.summary.pending / status.summary.total) * 100).toFixed(1)}%)\n\n`;
  
  PHASES.forEach(phase => {
    const phaseData = status.phases[phase];
    const phaseTotal = phaseData.completed.length + phaseData.failed.length + phaseData.pending.length;
    
    output += `📁 ${phase.toUpperCase()} (${phaseTotal} patches):\n`;
    output += `   ┌─`.repeat(20) + `\n`;
    
    if (phaseData.completed.length > 0) {
      output += `   ✅ COMPLETED (${phaseData.completed.length}):\n`;
      phaseData.completed.forEach((file, index) => {
        output += `      ${index + 1}. ${file}\n`;
      });
      output += `\n`;
    }
    
    if (phaseData.failed.length > 0) {
      output += `   ❌ FAILED (${phaseData.failed.length}):\n`;
      phaseData.failed.forEach((file, index) => {
        output += `      ${index + 1}. ${file}\n`;
      });
      output += `\n`;
    }
    
    if (phaseData.pending.length > 0) {
      output += `   ⏳ PENDING (${phaseData.pending.length}):\n`;
      phaseData.pending.forEach((file, index) => {
        output += `      ${index + 1}. ${file}\n`;
      });
      output += `\n`;
    }
    
    output += `   └─`.repeat(20) + `\n\n`;
  });
  
  return output;
}

// Main execution
const command = process.argv[2] || 'snapshot';
const status = getPatchStatus();

switch (command) {
  case 'snapshot':
    console.log(formatSnapshot(status));
    break;
  case 'detailed':
    console.log(formatDetailed(status));
    break;
  case 'json':
    console.log(JSON.stringify(status, null, 2));
    break;
  default:
    console.log(formatSnapshot(status));
} 