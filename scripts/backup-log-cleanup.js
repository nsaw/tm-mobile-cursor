#!/usr/bin/env { { { { node

const fs = require('fs') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
const path = require('path');

class BackupLogCleanup {
  constructor() {
    this.backupRoot = '/Users/sawyer/gitSync/_backups';
    this.maxLogAge = 3 * 24 * 60 * 60 * 1000; // 3 days for backup logs
    this.maxLogSize = 5 * 1024 * 1024; // 5MB for backup logs
    this.keepRecentLogs = 10; // Keep the 10 most recent log files
  }

  async cleanupBackupLogs() {
    console.log('🧹 Starting backup log cleanup...');
    console.log(`Target directory: ${this.backupRoot}`);
    
    const logFiles = this.findLogFiles();
    console.log(`Found ${logFiles.length} log files to analyze`);
    
    if (logFiles.length === 0) {
      console.log('✅ No log files found in backup directory');
      return;
    }

    // Sort by modification time (newest first)
    logFiles.sort((a, b) => {
      const statsA = fs.statSync(a);
      const statsB = fs.statSync(b);
      return statsB.mtime.getTime() - statsA.mtime.getTime();
    });

    let deletedCount = 0;
    let keptCount = 0;

    for (let i = 0; i < logFiles.length; i++) {
      const logFile = logFiles[i];
      const stats = fs.statSync(logFile);
      const age = Date.now() - stats.mtime.getTime();
      const size = stats.size;

      let shouldDelete = false;
      let reason = '';

      // Delete if older than max age
      if (age > this.maxLogAge) {
        shouldDelete = true;
        reason = `old (${Math.floor(age / (24 * 60 * 60 * 1000))} days)`;
      }
      // Delete if larger than max size
      else if (size > this.maxLogSize) {
        shouldDelete = true;
        reason = `large (${this.formatBytes(size)})`;
      }
      // Delete if not in the most recent files to keep
      else if (i >= this.keepRecentLogs) {
        shouldDelete = true;
        reason = `not in top ${this.keepRecentLogs} recent files`;
      }

      if (shouldDelete) {
        try {
          fs.unlinkSync(logFile);
          console.log(`🗑️  Deleted: ${path.relative(this.backupRoot, logFile)} (${reason})`);
          deletedCount++;
        } catch (error) {
          console.error(`❌ Error deleting ${logFile}:`, error.message);
        }
      } else {
        console.log(`✅ Kept: ${path.relative(this.backupRoot, logFile)} (${this.formatBytes(size)}, ${Math.floor(age / (24 * 60 * 60 * 1000))} days old)`);
        keptCount++;
      }
    }

    console.log(`\n📊 Cleanup Summary:`);
    console.log(`- Total log files: ${logFiles.length}`);
    console.log(`- Deleted: ${deletedCount}`);
    console.log(`- Kept: ${keptCount}`);
    console.log(`- Max age: ${this.maxLogAge / (24 * 60 * 60 * 1000)} days`);
    console.log(`- Max size: ${this.formatBytes(this.maxLogSize)}`);
    console.log(`- Keep recent: ${this.keepRecentLogs} files`);
  }

  findLogFiles() {
    const logFiles = [];
    
    function scanDirectory(dir) {
      try {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stats = fs.statSync(fullPath);
          
          if (stats.isDirectory()) {
            // Skip node_modules and other large directories
            if (!item.includes('node_modules') && !item.includes('.git')) {
              scanDirectory(fullPath);
            }
          } else if (stats.isFile()) {
            // Check if it's a log file
            if (this.isLogFile(item)) {
              logFiles.push(fullPath);
            }
          }
        });
      } catch (error) {
        // Skip directories we can't access
      }
    }
    
    scanDirectory.call(this, this.backupRoot);
    return logFiles;
  }

  isLogFile(filename) {
    const logExtensions = ['.log', '.txt'];
    const logPatterns = [
      /^.*\.log$/,
      /^.*\.txt$/,
      /^log-.*$/,
      /^.*-log.*$/,
      /^error.*$/,
      /^debug.*$/,
      /^trace.*$/,
      /^cloudflared.*$/,
      /^.*-debug\.log$/
    ];

    return logExtensions.some(ext => filename.endsWith(ext)) ||
           logPatterns.some(pattern => pattern.test(filename));
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get backup log statistics
  getBackupLogStats() {
    const logFiles = this.findLogFiles();
    let totalSize = 0;
    let oldestFile = null;
    let newestFile = null;

    logFiles.forEach(file => {
      const stats = fs.statSync(file);
      totalSize += stats.size;
      
      if (!oldestFile || stats.mtime < oldestFile.mtime) {
        oldestFile = { file, mtime: stats.mtime };
      }
      if (!newestFile || stats.mtime > newestFile.mtime) {
        newestFile = { file, mtime: stats.mtime };
      }
    });

    return {
      totalFiles: logFiles.length,
      totalSize,
      oldestFile: oldestFile ? { file: path.relative(this.backupRoot, oldestFile.file), date: oldestFile.mtime } : null,
      newestFile: newestFile ? { file: path.relative(this.backupRoot, newestFile.file), date: newestFile.mtime } : null
    };
  }
}

// Run if called directly
if (require.main === module) {
  const cleanup = new BackupLogCleanup();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'cleanup':
      cleanup.cleanupBackupLogs();
      break;
    case 'stats':
      const stats = cleanup.getBackupLogStats();
      console.log('📊 Backup Log Statistics:');
      console.log(JSON.stringify(stats, null, 2));
      break;
    default:
      console.log('Usage: { { { { node backup-log-cleanup.js [cleanup|stats]') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
      console.log('  cleanup - Clean up old backup log files');
      console.log('  stats   - Show backup log statistics');
  }
}

module.exports = BackupLogCleanup; 