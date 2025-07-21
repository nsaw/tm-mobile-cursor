#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

// ANSI color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

function detectAndFixTextErrors() {
  log('🔍 Scanning for text string errors...', 'blue');
  
  try {
    // Run the auto-fix script
    const output = execSync('node scripts/auto-fix-text-errors.cjs', { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });
    
    // Check if any fixes were applied
    if (output.includes('Fixed:')) {
      log('✅ Text errors detected and fixed automatically!', 'green');
      log('📋 Fix details:', 'cyan');
      console.log(output);
    } else if (output.includes('No text string errors detected')) {
      log('✅ No text errors found', 'green');
    } else {
      log('⚠️  Scan completed with warnings', 'yellow');
      console.log(output);
    }
    
  } catch (error) {
    log(`❌ Error during scan: ${error.message}`, 'red');
  }
}

function watchFiles() {
  log('👀 Starting file watcher for text error detection...', 'bold');
  log('📁 Watching src/**/*.tsx files for changes', 'blue');
  log('🔄 Press Ctrl+C to stop watching', 'yellow');
  
  const srcPath = path.join(__dirname, '../src');
  let lastCheck = Date.now();
  let isProcessing = false;
  
  // Initial scan
  detectAndFixTextErrors();
  
  // Watch for file changes
  const watcher = fs.watch(srcPath, { recursive: true }, (eventType, filename) => {
    if (!filename || !filename.endsWith('.tsx')) return;
    
    const now = Date.now();
    
    // Debounce rapid changes
    if (now - lastCheck < 1000) return;
    if (isProcessing) return;
    
    lastCheck = now;
    isProcessing = true;
    
    log(`📝 File changed: ${filename}`, 'magenta');
    
    // Wait a bit for file to be fully written
    setTimeout(() => {
      detectAndFixTextErrors();
      isProcessing = false;
    }, 500);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('\n🛑 Stopping file watcher...', 'yellow');
    watcher.close();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('\n🛑 Stopping file watcher...', 'yellow');
    watcher.close();
    process.exit(0);
  });
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    log('📖 Text Error Watcher Usage:', 'bold');
    log('  node scripts/watch-text-errors.cjs [options]', 'blue');
    log('', 'reset');
    log('Options:', 'bold');
    log('  --once     Run detection once and exit', 'blue');
    log('  --help, -h Show this help message', 'blue');
    log('', 'reset');
    log('Examples:', 'bold');
    log('  node scripts/watch-text-errors.cjs          # Watch for changes', 'blue');
    log('  node scripts/watch-text-errors.cjs --once   # Run once', 'blue');
    return;
  }
  
  if (args.includes('--once')) {
    log('🔍 Running one-time text error detection...', 'bold');
    detectAndFixTextErrors();
    return;
  }
  
  watchFiles();
}

// Run the main function
if (require.main === module) {
  main();
}

module.exports = { detectAndFixTextErrors, watchFiles }; 