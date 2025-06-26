#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting background lint fix watcher...');
console.log('📁 Watching for changes in src/**/*.{ts,tsx}');
console.log('⚡ Auto-fixing issues and committing minor fixes');
console.log('⏸️  Press Ctrl+C to stop\n');

let isRunning = false;
let lastCommitTime = Date.now();

function runLintFix() {
  if (isRunning) {
    console.log('⏳ Lint fix already running, skipping...');
    return;
  }

  isRunning = true;
  console.log('🔧 Running lint fix...');

  exec('npm run lint:fix-text && npm run lint:fix-accessibility', (error, stdout, stderr) => {
    isRunning = false;
    
    if (error) {
      console.log('❌ Lint fix failed:', error.message);
      return;
    }

    if (stdout) {
      console.log('✅ Lint fix completed');
      console.log(stdout);
      
      // Check if any files were modified
      exec('git status --porcelain', (gitError, gitStdout) => {
        if (!gitError && gitStdout.trim()) {
          const now = Date.now();
          const timeSinceLastCommit = now - lastCommitTime;
          
          // Only commit if it's been at least 30 seconds since last commit
          if (timeSinceLastCommit > 30000) {
            console.log('💾 Committing minor fixes...');
            exec('git add . && git commit -m "chore: auto-fix lint issues"', (commitError) => {
              if (!commitError) {
                console.log('✅ Auto-commit successful');
                lastCommitTime = now;
              } else {
                console.log('❌ Auto-commit failed:', commitError.message);
              }
            });
          } else {
            console.log('⏰ Skipping commit (too soon since last commit)');
          }
        }
      });
    }
  });
}

// Run initial lint fix
runLintFix();

// Set up file watcher
const srcPath = path.join(__dirname, '..', 'src');
console.log(`📂 Watching directory: ${srcPath}`);

// Watch for file changes
fs.watch(srcPath, { recursive: true }, (eventType, filename) => {
  if (filename && (filename.endsWith('.ts') || filename.endsWith('.tsx'))) {
    console.log(`📝 File changed: ${filename}`);
    
    // Debounce the lint fix
    setTimeout(() => {
      runLintFix();
    }, 1000);
  }
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n🛑 Background lint fix watcher stopped');
  process.exit(0);
});

console.log('🚀 Background lint fix watcher is now active!'); 