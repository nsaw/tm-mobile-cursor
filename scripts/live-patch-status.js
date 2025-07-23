const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Use absolute paths as per workspace rules
const PATCHES_DIR = path.resolve('/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/tasks/patches');
const SUMMARY_DIR = path.resolve('/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries');
const LOG_FILE = path.resolve('/Users/sawyer/gitSync/tm-mobile-cursor/live-patch.log');

const state = {
  status: {
    patchStatus: {
      pending: [],
      executing: [],
      completed: [],
      failed: []
    },
    executionQueue: [],
    lastUpdate: new Date().toISOString(),
    debug: {
      patchFiles: [],
      summaryFiles: [],
      completedIds: [],
      pendingIds: []
    }
  }
};

function extractPatchId(filename) {
  // Handle various patch filename formats
  if (filename.startsWith('patch-')) {
    return filename.replace(/^patch-/, '').replace(/\.json$/, '');
  }
  // Handle summary filename formats
  if (filename.startsWith('summary-')) {
    return filename.replace(/^summary-/, '').replace(/\.md$/, '');
  }
  return filename.replace(/\.(json|md)$/, '');
}

function validateDirectory(dirPath, dirName) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.warn(chalk.yellow(`[PATCH MONITOR] Warning: ${dirName} directory does not exist: ${dirPath}`));
      return [];
    }
    return fs.readdirSync(dirPath);
  } catch (error) {
    console.error(chalk.red(`[PATCH MONITOR] Error reading ${dirName} directory: ${error.message}`));
    return [];
  }
}

function updateQueue() {
  try {
    // Get patch files with validation
    const patchDirContents = validateDirectory(PATCHES_DIR, 'patches');
    const patchFiles = patchDirContents
      .filter(f => f.endsWith('.json'))
      .filter(f => !f.startsWith('.')) // Exclude hidden files
      .filter(f => fs.existsSync(path.join(PATCHES_DIR, f))); // Ensure exists

    // Get summary files with validation
    const summaryDirContents = validateDirectory(SUMMARY_DIR, 'summaries');
    const summaryFiles = summaryDirContents
      .filter(f => f.endsWith('.md'))
      .filter(f => !f.startsWith('.')) // Exclude hidden files
      .filter(f => fs.existsSync(path.join(SUMMARY_DIR, f))); // Ensure exists

    // Extract completed patch IDs from summary files
    const completedIds = summaryFiles.map(f => extractPatchId(f));

    // Filter pending patches - only include patches that don't have corresponding summaries
    const pendingPatches = patchFiles.filter(patchFile => {
      const patchId = extractPatchId(patchFile);
      const isCompleted = completedIds.includes(patchId);
      
      if (!isCompleted) {
        console.log(chalk.yellow(`[PATCH MONITOR] Pending patch detected: ${patchFile} (ID: ${patchId})`));
      }
      
      return !isCompleted;
    });

    // Update state with debug information
    state.status.executionQueue = pendingPatches;
    state.status.patchStatus.pending = pendingPatches;
    state.status.patchStatus.completed = completedIds;
    state.status.lastUpdate = new Date().toISOString();
    
    // Debug information
    state.status.debug = {
      patchFiles: patchFiles,
      summaryFiles: summaryFiles,
      completedIds: completedIds,
      pendingIds: pendingPatches.map(f => extractPatchId(f))
    };

    console.log(chalk.blue(`[PATCH MONITOR] Queue updated: ${pendingPatches.length} pending, ${completedIds.length} completed`));
    
  } catch (error) {
    console.error(chalk.red(`[PATCH MONITOR] Error updating queue: ${error.message}`));
    state.status.executionQueue = [];
    state.status.patchStatus.pending = [];
  }
}

function writeLog() {
  try {
    const status = state.status;
    const log = [
      `📅 ${new Date().toLocaleString()}`,
      '============================================================',
      `📦 Patch Status:`,
      `   • Pending: ${status.patchStatus.pending.length} | Executing: ${status.patchStatus.executing.length} | Completed: ${status.patchStatus.completed.length} | Failed: ${status.patchStatus.failed.length}`,
      '',
      ...(status.executionQueue.length > 0
        ? [
            `   ⚠️  PENDING PATCHES DETECTED!`,
            ...status.executionQueue.map(p => `   ⏳ ${p}`),
            ''
          ]
        : ['   ✅ No pending patches', '']),
      `🕐 Last Update: ${status.lastUpdate}`,
      '',
      `🔍 Debug Info:`,
      `   • Patch files found: ${status.debug.patchFiles.length}`,
      `   • Summary files found: ${status.debug.summaryFiles.length}`,
      `   • Completed IDs: ${status.debug.completedIds.length}`,
      `   • Pending IDs: ${status.debug.pendingIds.length}`,
      ''
    ].join('\n');

    fs.writeFileSync(LOG_FILE, log, 'utf8');
    console.log(chalk.green('[PATCH MONITOR]'), 'Updated live patch queue status.');
    
  } catch (error) {
    console.error(chalk.red(`[PATCH MONITOR] Error writing log: ${error.message}`));
  }
}

function main() {
  console.log(chalk.blue('[PATCH MONITOR]'), 'Starting live patch status monitor...');
  console.log(chalk.blue('[PATCH MONITOR]'), `Patches directory: ${PATCHES_DIR}`);
  console.log(chalk.blue('[PATCH MONITOR]'), `Summaries directory: ${SUMMARY_DIR}`);
  console.log(chalk.blue('[PATCH MONITOR]'), `Log file: ${LOG_FILE}`);
  
  updateQueue();
  writeLog();
  
  // Update every minute
  setInterval(() => {
    updateQueue();
    writeLog();
  }, 60000);
  
  console.log(chalk.green('[PATCH MONITOR]'), 'Monitor started successfully.');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('[PATCH MONITOR]'), 'Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow('[PATCH MONITOR]'), 'Shutting down gracefully...');
  process.exit(0);
});

main();
