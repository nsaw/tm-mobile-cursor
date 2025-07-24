#!/usr/bin/env { { { { node

const fs = require('fs') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
const path = require('path');

class EmergencyBackupCleaner {
  constructor() {
    this.backupDir = '/Users/sawyer/gitSync/_backups/tm-safety_backups';
    this.quarantineDir = path.join(this.backupDir, 'z_bloated_archive_graveyard');
  }

  async emergencyCleanup() {
    console.log('🚨 EMERGENCY BACKUP CLEANER v1.0');
    console.log(`Target directory: ${this.backupDir}`);
    
    if (!fs.existsSync(this.backupDir)) {
      console.log('❌ Backup directory not found');
      return;
    }

    // Get all tar.gz files sorted by size (largest first)
    const files = this.getFilesBySize();
    
    if (files.length === 0) {
      console.log('✅ No .tar.gz files found');
      return;
    }

    console.log(`📦 Found ${files.length} .tar.gz files`);
    console.log(`📊 Total size: ${this.formatBytes(this.getTotalSize(files))}`);

    // Show the largest files
    console.log('\n📋 Largest files (potential candidates for deletion):');
    files.slice(0, 10).forEach((file, index) => {
      console.log(`${index + 1}. ${file.name} (${this.formatBytes(file.size)})`);
    });

    // Calculate how much space we can free up
    const largeFiles = files.filter(f => f.size > 500 * 1024 * 1024); // Files larger than 500MB
    const totalLargeSize = this.getTotalSize(largeFiles);
    
    console.log(`\n💾 Large files (>500MB): ${largeFiles.length} files, ${this.formatBytes(totalLargeSize)} total`);

    // Ask user for confirmation
    console.log('\n⚠️  WARNING: This will DELETE the largest backup files to free up disk space.');
    console.log('These files will be moved to quarantine directory for safety.');
    
    const response = process.argv.includes('--force') ? 'y' : 
      await this.promptUser('Proceed with emergency cleanup? (y/N): ');
    
    if (response.toLowerCase() !== 'y') {
      console.log('❌ Emergency cleanup cancelled');
      return;
    }

    // Move largest files to quarantine
    let freedSpace = 0;
    let movedCount = 0;

    for (const file of largeFiles) {
      try {
        console.log(`\n🗑️  Moving: ${file.name} (${this.formatBytes(file.size)})`);
        
        // Ensure quarantine directory exists
        if (!fs.existsSync(this.quarantineDir)) {
          fs.mkdirSync(this.quarantineDir, { recursive: true });
        }
        
        const quarantinePath = path.join(this.quarantineDir, file.name);
        fs.renameSync(file.path, quarantinePath);
        
        freedSpace += file.size;
        movedCount++;
        
        console.log(`✅ Moved to quarantine: ${file.name}`);
        
      } catch (error) {
        console.error(`❌ Error moving ${file.name}:`, error.message);
      }
    }

    console.log(`\n✅ Emergency cleanup completed!`);
    console.log(`📊 Freed space: ${this.formatBytes(freedSpace)}`);
    console.log(`📦 Files moved: ${movedCount}`);
    console.log(`📁 Quarantine location: ${this.quarantineDir}`);
    
    // Write emergency cleanup summary
    this.writeEmergencySummary(freedSpace, movedCount);
  }

  getFilesBySize() {
    const files = [];
    
    if (fs.existsSync(this.backupDir)) {
      const items = fs.readdirSync(this.backupDir);
      
      items.forEach(item => {
        if (item.endsWith('.tar.gz') && !item.includes('_cleaned')) {
          const filePath = path.join(this.backupDir, item);
          const stats = fs.statSync(filePath);
          files.push({
            path: filePath,
            name: item,
            size: stats.size
          });
        }
      });
    }

    // Sort by size (largest first)
    return files.sort((a, b) => b.size - a.size);
  }

  getTotalSize(files) {
    return files.reduce((total, file) => total + file.size, 0);
  }

  async promptUser(question) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise(resolve => {
      rl.question(question, answer => {
        rl.close();
        resolve(answer);
      });
    });
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  writeEmergencySummary(freedSpace, movedCount) {
    const summaryPath = path.join(process.cwd(), 'mobile-native-fresh', 'tasks', 'summaries', `summary-emergency-cleanup-${Date.now()}.md`);
    const summaryDir = path.dirname(summaryPath);
    if (!fs.existsSync(summaryDir)) {
      fs.mkdirSync(summaryDir, { recursive: true });
    }
    
    const summary = `# Emergency Backup Cleanup Summary
Generated: ${new Date().toISOString()}

## Emergency Cleanup Results
- **Space Freed**: ${this.formatBytes(freedSpace)}
- **Files Moved**: ${movedCount}
- **Quarantine Location**: ${this.quarantineDir}

## Process
This emergency cleanup was performed to free up disk space immediately.
Large backup files (>500MB) were moved to quarantine for safety.

## Files Affected
The following types of files were moved to quarantine:
- Files larger than 500MB
- Backup archives with potential bloat
- Files that could be safely quarantined

## Recovery
Files can be restored from quarantine if needed:
\`\`\`
${this.quarantineDir}
\`\`\`
`;

    fs.writeFileSync(summaryPath, summary);
    console.log(`📄 Emergency cleanup summary written: ${summaryPath}`);
  }
}

// Run if called directly
if (require.main === module) {
  const cleaner = new EmergencyBackupCleaner();
  cleaner.emergencyCleanup().catch(console.error);
}

module.exports = EmergencyBackupCleaner; 