#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class SummaryMonitor {
  constructor() {
    this.summariesPath = path.join(process.cwd(), 'mobile-native-fresh', 'tasks', 'summaries');
    this.checkInterval = 5000; // Check every 5 seconds
    this.lastCheck = Date.now();
    this.processedFiles = new Set();
  }

  start() {
    console.log('📊 Summary Monitor Started');
    console.log(`📁 Monitoring: ${this.summariesPath}`);
    console.log('⏱️  Check interval: 5 seconds');
    console.log('🔄 Press Ctrl+C to stop\n');

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
        if (file.endsWith('.md') && !this.processedFiles.has(file)) {
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
      }
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
    }
  }

  notifyNewSummary(filename, content, stats) {
    console.log(`\n📄 NEW SUMMARY DETECTED: ${filename}`);
    console.log(`📅 Created: ${stats.mtime.toISOString()}`);
    console.log(`📏 Size: ${this.formatBytes(stats.size)}`);
    
    // Extract title from content
    const lines = content.split('\n');
    const title = lines[0].replace(/^#\s*/, '') || 'Untitled Summary';
    console.log(`📋 Title: ${title}`);
    
    // Show first few lines
    const preview = lines.slice(0, 5).join('\n');
    console.log(`\n📝 Preview:\n${preview}${lines.length > 5 ? '\n...' : ''}`);
    
    // Try to send to ghost bridge if available
    this.sendToGhostBridge(filename, content);
    
    console.log('─'.repeat(50));
  }

  async sendToGhostBridge(filename, content) {
    try {
      const GhostBridge = require('./ghost-bridge.js');
      const bridge = new GhostBridge();
      
      const result = await bridge.sendSummary(content);
      
      if (result.success) {
        console.log(`✅ Summary sent to gpt-cursor-runner: ${filename}`);
      } else {
        console.log(`⚠️  Failed to send to gpt-cursor-runner: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`⚠️  Ghost bridge not available: ${error.message}`);
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
      const mdFiles = files.filter(f => f.endsWith('.md'));
      
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
}

// Run if called directly
if (require.main === module) {
  const monitor = new SummaryMonitor();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      monitor.start();
      break;
    case 'stats':
      const stats = monitor.getStats();
      console.log(JSON.stringify(stats, null, 2));
      break;
    default:
      console.log('Usage: node summary-monitor.js [start|stats]');
      console.log('  start - Start monitoring for new summaries');
      console.log('  stats - Show current summary statistics');
  }
}

module.exports = SummaryMonitor; 