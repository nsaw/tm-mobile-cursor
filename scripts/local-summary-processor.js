#!/usr/bin/env { { { { node

const fs = require('fs') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
const path = require('path');

class LocalSummaryProcessor {
  constructor() {
    this.summariesPath = path.join(process.cwd(), 'mobile-native-fresh', 'tasks', 'summaries');
    this.processedPath = path.join(process.cwd(), 'mobile-native-fresh', 'tasks', 'summaries', '.processed');
    this.checkInterval = 5000; // Check every 5 seconds
    this.processedFiles = new Set();
  }

  start() {
    console.log('📊 Local Summary Processor Started');
    console.log(`📁 Monitoring: ${this.summariesPath}`);
    console.log(`📁 Processed: ${this.processedPath}`);
    console.log('⏱️  Check interval: 5 seconds');
    console.log('🔄 Press Ctrl+C to stop\n');

    // Ensure processed directory exists
    if (!fs.existsSync(this.processedPath)) {
      fs.mkdirSync(this.processedPath, { recursive: true });
    }

    // Initial check for existing files
    this.checkForNewSummaries();

    // Set up periodic checking
    setInterval(() => {
      this.checkForNewSummaries();
    }, this.checkInterval);
  }

  checkForNewSummaries() {
    if (!fs.existsSync(this.summariesPath)) {
      console.log('⚠️  Summaries directory not found, creating...');
      fs.mkdirSync(this.summariesPath, { recursive: true });
      return;
    }

    try {
      const files = fs.readdirSync(this.summariesPath);
      
      files.forEach(file => {
        if (file.endsWith('.md') && !this.processedFiles.has(file) && !file.startsWith('.')) {
          this.processSummary(file);
        }
      });
    } catch (error) {
      console.error('❌ Error checking summaries:', error.message);
    }
  }

  processSummary(filename) {
    const filePath = path.join(this.summariesPath, filename);
    
    try {
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Only process files created in the last 10 minutes
      const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
      if (stats.mtime.getTime() > tenMinutesAgo) {
        this.notifyNewSummary(filename, content, stats);
        this.processedFiles.add(filename);
        
        // Move to processed directory
        this.moveToProcessed(filename);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
    }
  }

  notifyNewSummary(filename, content, stats) {
    console.log(`\n📄 NEW SUMMARY PROCESSED: ${filename}`);
    console.log(`📅 Created: ${stats.mtime.toISOString()}`);
    console.log(`📏 Size: ${this.formatBytes(stats.size)}`);
    
    // Extract title from content
    const lines = content.split('\n');
    const title = lines[0].replace(/^#\s*/, '') || 'Untitled Summary';
    console.log(`📋 Title: ${title}`);
    
    // Show first few lines
    const preview = lines.slice(0, 5).join('\n');
    console.log(`\n📝 Preview:\n${preview}${lines.length > 5 ? '\n...' : ''}`);
    
    // Log to local processing log
    this.logProcessing(filename, title, stats);
    
    console.log('─'.repeat(50));
  }

  moveToProcessed(filename) {
    try {
      const sourcePath = path.join(this.summariesPath, filename);
      const destPath = path.join(this.processedPath, filename);
      
      // Copy to processed directory
      fs.copyFileSync(sourcePath, destPath);
      
      // Create a symlink or reference in the original location
      const linkPath = path.join(this.summariesPath, `.${filename}.processed`);
      fs.writeFileSync(linkPath, `Processed at ${new Date().toISOString()}`);
      
      console.log(`✅ Moved to processed: ${filename}`);
    } catch (error) {
      console.error(`❌ Error moving ${filename}:`, error.message);
    }
  }

  logProcessing(filename, title, stats) {
    const logPath = path.join(this.processedPath, 'processing.log');
    const logEntry = {
      timestamp: new Date().toISOString(),
      filename: filename,
      title: title,
      size: stats.size,
      processed: true
    };
    
    try {
      let log = [];
      if (fs.existsSync(logPath)) {
        log = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      }
      log.push(logEntry);
      fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
    } catch (error) {
      console.error('❌ Error writing processing log:', error.message);
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getStats() {
    if (!fs.existsSync(this.summariesPath)) {
      return { error: 'Summaries directory not found' };
    }

    try {
      const files = fs.readdirSync(this.summariesPath);
      const mdFiles = files.filter(f => f.endsWith('.md') && !f.startsWith('.'));
      
      let totalSize = 0;
      const fileStats = [];
      
      mdFiles.forEach(file => {
        const filePath = path.join(this.summariesPath, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        fileStats.push({
          name: file,
          size: stats.size,
          modified: stats.mtime,
          processed: this.processedFiles.has(file)
        });
      });

      return {
        totalFiles: mdFiles.length,
        totalSize: totalSize,
        processedFiles: this.processedFiles.size,
        files: fileStats.sort((a, b) => b.modified - a.modified)
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  getProcessingLog() {
    const logPath = path.join(this.processedPath, 'processing.log');
    if (fs.existsSync(logPath)) {
      try {
        return JSON.parse(fs.readFileSync(logPath, 'utf8'));
      } catch (error) {
        return { error: error.message };
      }
    }
    return [];
  }
}

// Run if called directly
if (require.main === module) {
  const processor = new LocalSummaryProcessor();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      processor.start();
      break;
    case 'stats':
      const stats = processor.getStats();
      console.log(JSON.stringify(stats, null, 2));
      break;
    case 'log':
      const log = processor.getProcessingLog();
      console.log(JSON.stringify(log, null, 2));
      break;
    default:
      console.log('Usage: { { { { node local-summary-processor.js [start|stats|log]') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
      console.log('  start - Start processing summaries locally');
      console.log('  stats - Show current summary statistics');
      console.log('  log   - Show processing log');
  }
}

module.exports = LocalSummaryProcessor; 