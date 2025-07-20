#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class SummaryMonitor {
  constructor() {
    this.summariesPaths = [
      path.join(process.cwd(), 'mobile-native-fresh', 'tasks', 'summaries'),
      path.join(process.cwd(), 'mobile-native-fresh', 'src-nextgen', 'summaries'),
      path.join(process.cwd(), 'mobile-native-fresh', 'src-nextgen', 'phase-0', 'summaries'),
      path.join(process.cwd(), 'mobile-native-fresh', 'src-nextgen', 'phase-1', 'summaries'),
      path.join(process.cwd(), 'mobile-native-fresh', 'src-nextgen', 'phase-2', 'summaries'),
      path.join(process.cwd(), 'mobile-native-fresh', 'summaries')
    ];
    
    // Add ghost-related paths for monitoring
    this.ghostPaths = [
      path.join(process.cwd(), 'mobile-native-fresh', 'captures'),
      path.join(process.cwd(), 'mobile-native-fresh', 'verification')
    ];
    
    this.checkInterval = 5000; // Check every 5 seconds
    this.lastCheck = Date.now();
    this.processedFiles = new Set();
    this.processedGhostFiles = new Set();
  }

  start() {
    console.log('📊 Summary Monitor Started');
    console.log(`📁 Monitoring summary directories:`);
    this.summariesPaths.forEach(path => console.log(`   - ${path}`));
    console.log(`👻 Monitoring ghost-related directories:`);
    this.ghostPaths.forEach(path => console.log(`   - ${path}`));
    console.log('⏱️  Check interval: 5 seconds');
    console.log('🔄 Press Ctrl+C to stop\n');

    // Initial check for existing files
    this.checkForNewSummaries();
    this.checkForNewGhostFiles();

    // Set up periodic checking
    setInterval(() => {
      this.checkForNewSummaries();
      this.checkForNewGhostFiles();
    }, this.checkInterval);
  }

  checkForNewSummaries() {
    for (const summariesPath of this.summariesPaths) {
      if (!fs.existsSync(summariesPath)) {
        console.log(`⚠️  Summaries directory not found, creating: ${summariesPath}`);
        fs.mkdirSync(summariesPath, { recursive: true });
        continue;
      }

      try {
        const files = fs.readdirSync(summariesPath);
        
        files.forEach(file => {
          if (file.endsWith('.md') && !this.processedFiles.has(file)) {
            this.processSummary(file, summariesPath);
          }
        });
      } catch (error) {
        console.error(`❌ Error checking summaries in ${summariesPath}:`, error.message);
      }
    }
  }

  checkForNewGhostFiles() {
    for (const ghostPath of this.ghostPaths) {
      if (!fs.existsSync(ghostPath)) {
        console.log(`⚠️  Ghost directory not found, creating: ${ghostPath}`);
        fs.mkdirSync(ghostPath, { recursive: true });
        continue;
      }

      try {
        const files = fs.readdirSync(ghostPath);
        
        files.forEach(file => {
          const fileKey = `${ghostPath}:${file}`;
          if (!this.processedGhostFiles.has(fileKey)) {
            this.processGhostFile(file, ghostPath);
          }
        });
      } catch (error) {
        console.error(`❌ Error checking ghost files in ${ghostPath}:`, error.message);
      }
    }
  }

  processSummary(filename, summariesPath) {
    const filePath = path.join(summariesPath, filename);
    
    try {
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Only process files created in the last 10 minutes
      const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
      if (stats.mtime.getTime() > tenMinutesAgo) {
        this.notifyNewSummary(filename, content, stats, summariesPath);
        this.processedFiles.add(filename);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
    }
  }

  processGhostFile(filename, ghostPath) {
    const filePath = path.join(ghostPath, filename);
    
    try {
      const stats = fs.statSync(filePath);
      
      // Only process files created in the last 10 minutes
      const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
      if (stats.mtime.getTime() > tenMinutesAgo) {
        this.notifyNewGhostFile(filename, stats, ghostPath);
        this.processedGhostFiles.add(`${ghostPath}:${filename}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ghost file ${filename}:`, error.message);
    }
  }

  notifyNewSummary(filename, content, stats, summariesPath) {
    console.log(`\n📄 NEW SUMMARY DETECTED: ${filename}`);
    console.log(`📁 Location: ${summariesPath}`);
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

  notifyNewGhostFile(filename, stats, ghostPath) {
    const isCapture = ghostPath.includes('captures');
    const isVerification = ghostPath.includes('verification');
    
    console.log(`\n👻 NEW GHOST FILE DETECTED: ${filename}`);
    console.log(`📁 Location: ${ghostPath}`);
    console.log(`📅 Created: ${stats.mtime.toISOString()}`);
    console.log(`📏 Size: ${this.formatBytes(stats.size)}`);
    
    if (isCapture) {
      console.log(`📸 Type: Screen Capture`);
      console.log(`📱 Viewport: ${filename.includes('iphone-16-pro') ? 'iPhone 16 Pro' : filename.includes('iphone-16-pro-max') ? 'iPhone 16 Pro Max' : 'Unknown'}`);
    } else if (isVerification) {
      console.log(`🔍 Type: Verification Data`);
      if (filename.includes('gpt-analysis')) {
        console.log(`🤖 Analysis: GPT Analysis Report`);
      } else if (filename.includes('human-review')) {
        console.log(`👤 Review: Human Review Report`);
      } else if (filename.includes('verification')) {
        console.log(`✅ Workflow: Verification Workflow Result`);
      }
    }
    
    // Try to send to ghost bridge if available
    this.sendGhostFileToBridge(filename, ghostPath);
    
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

  async sendGhostFileToBridge(filename, ghostPath) {
    try {
      const GhostBridge = require('./ghost-bridge.js');
      const bridge = new GhostBridge();
      
      const filePath = path.join(ghostPath, filename);
      const stats = fs.statSync(filePath);
      
      const ghostData = {
        filename: filename,
        path: ghostPath,
        type: ghostPath.includes('captures') ? 'capture' : 'verification',
        size: stats.size,
        modified: stats.mtime.toISOString(),
        viewport: filename.includes('iphone-16-pro') ? 'iPhone 16 Pro' : filename.includes('iphone-16-pro-max') ? 'iPhone 16 Pro Max' : 'Unknown'
      };
      
      const result = await bridge.sendGhostFile(ghostData);
      
      if (result.success) {
        console.log(`✅ Ghost file sent to gpt-cursor-runner: ${filename}`);
      } else {
        console.log(`⚠️  Failed to send ghost file to gpt-cursor-runner: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`⚠️  Ghost bridge not available for ghost files: ${error.message}`);
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
    let totalFiles = 0;
    let totalSize = 0;
    const fileStats = [];
    
    for (const summariesPath of this.summariesPaths) {
      if (!fs.existsSync(summariesPath)) {
        continue;
      }

      try {
        const files = fs.readdirSync(summariesPath);
        const mdFiles = files.filter(f => f.endsWith('.md'));
        
        mdFiles.forEach(file => {
          const filePath = path.join(summariesPath, file);
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
          fileStats.push({
            name: file,
            path: summariesPath,
            size: stats.size,
            modified: stats.mtime,
            processed: this.processedFiles.has(file)
          });
        });
        
        totalFiles += mdFiles.length;
      } catch (error) {
        console.error(`Error reading ${summariesPath}:`, error.message);
      }
    }

    return {
      totalFiles: totalFiles,
      totalSize: totalSize,
      processedFiles: this.processedFiles.size,
      files: fileStats.sort((a, b) => b.modified - a.modified)
    };
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