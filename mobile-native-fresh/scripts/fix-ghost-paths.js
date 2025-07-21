#!/usr/bin/env node

// fix-ghost-paths.js
// Fixes Ghost path resolution issues and ensures proper patch delivery

const fs = require('fs');
const path = require('path');

class GhostPathFixer {
  constructor() {
    // FIXED: Use correct base path
    this.basePath = path.resolve(__dirname, '..');
    this.patchesDir = path.join(this.basePath, 'tasks', 'patches');
    this.logsDir = path.join(this.basePath, 'logs');
    this.ghostConfigPath = path.join(this.basePath, '..', '.cursor-config.json');
  }

  async fixPaths() {
    console.log('🔧 Fixing Ghost path resolution issues...');
    
    // 1. Ensure patches directory exists
    this.ensurePatchesDirectory();
    
    // 2. Fix any tilde references in configuration files
    this.fixTildeReferences();
    
    // 3. Create proper Ghost relay configuration
    this.createGhostRelayConfig();
    
    // 4. Verify patch accessibility
    this.verifyPatchAccessibility();
    
    console.log('✅ Ghost path fixes completed');
  }

  ensurePatchesDirectory() {
    if (!fs.existsSync(this.patchesDir)) {
      console.log(`📁 Creating patches directory: ${this.patchesDir}`);
      fs.mkdirSync(this.patchesDir, { recursive: true });
    } else {
      console.log(`📁 Patches directory exists: ${this.patchesDir}`);
    }
  }

  fixTildeReferences() {
    console.log('🔧 Fixing tilde references...');
    
    // Fix .cursor-config.json if it exists
    if (fs.existsSync(this.ghostConfigPath)) {
      let config = fs.readFileSync(this.ghostConfigPath, 'utf8');
      const originalConfig = config;
      
      // Replace tilde with absolute path
      config = config.replace(/~/g, '/Users/sawyer');
      
      if (config !== originalConfig) {
        fs.writeFileSync(this.ghostConfigPath, config);
        console.log('✅ Fixed tilde references in .cursor-config.json');
      }
    }
    
    // Check for other configuration files with tilde references
    const configFiles = [
      path.join(this.basePath, 'scripts', 'ghost-bridge.js'),
      path.join(this.basePath, 'scripts', 'live-patch-status.js')
    ];
    
    configFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Replace tilde with absolute path
        content = content.replace(/~/g, '/Users/sawyer');
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content);
          console.log(`✅ Fixed tilde references in ${path.basename(filePath)}`);
        }
      }
    });
  }

  createGhostRelayConfig() {
    const relayConfigPath = path.join(this.basePath, 'scripts', 'ghost-relay-config.json');
    
    const relayConfig = {
      patchesDirectory: this.patchesDir,
      summariesDirectory: path.join(this.basePath, 'tasks', 'summaries'),
      logsDirectory: this.logsDir,
      basePath: this.basePath,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(relayConfigPath, JSON.stringify(relayConfig, null, 2));
    console.log('✅ Created Ghost relay configuration');
  }

  verifyPatchAccessibility() {
    console.log('🔍 Verifying patch accessibility...');
    
    // List all patches in the directory
    if (fs.existsSync(this.patchesDir)) {
      const patches = fs.readdirSync(this.patchesDir)
        .filter(file => file.endsWith('.json') && !file.startsWith('.'));
      
      console.log(`📦 Found ${patches.length} patches in ${this.patchesDir}:`);
      patches.forEach(patch => {
        const patchPath = path.join(this.patchesDir, patch);
        const stats = fs.statSync(patchPath);
        console.log(`   - ${patch} (${stats.size} bytes, ${stats.mtime.toLocaleString()})`);
      });
    } else {
      console.log('❌ Patches directory does not exist');
    }
  }

  async testPatchDelivery() {
    console.log('🧪 Testing patch delivery...');
    
    const testPatch = {
      id: 'test-patch-delivery',
      timestamp: new Date().toISOString(),
      test: true,
      message: 'Test patch for Ghost delivery verification'
    };
    
    const testPatchPath = path.join(this.patchesDir, 'test-patch-delivery.json');
    fs.writeFileSync(testPatchPath, JSON.stringify(testPatch, null, 2));
    
    console.log('✅ Test patch created');
    
    // Verify the patch was written
    if (fs.existsSync(testPatchPath)) {
      console.log('✅ Test patch delivery successful');
      // Clean up test patch
      fs.unlinkSync(testPatchPath);
      console.log('🧹 Test patch cleaned up');
    } else {
      console.log('❌ Test patch delivery failed');
    }
  }
}

// Main execution
async function main() {
  const fixer = new GhostPathFixer();
  
  try {
    await fixer.fixPaths();
    await fixer.testPatchDelivery();
    console.log('🎉 Ghost path fixes completed successfully');
  } catch (error) {
    console.error('❌ Error fixing Ghost paths:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = GhostPathFixer; 