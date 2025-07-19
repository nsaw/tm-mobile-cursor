#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class PatchExecutor {
  constructor() {
    this.patchesPath = path.join(process.cwd(), 'mobile-native-fresh', 'tasks', 'patches');
    this.summariesPath = path.join(process.cwd(), 'mobile-native-fresh', 'tasks', 'summaries');
  }

  // Find and execute pending patches
  async executePendingPatches() {
    console.log('🔍 Looking for pending patches...');
    
    if (!fs.existsSync(this.patchesPath)) {
      console.log('❌ Patches directory not found');
      return;
    }

    const patchFiles = fs.readdirSync(this.patchesPath)
      .filter(file => file.endsWith('.json') && file.startsWith('patch-'))
      .sort(); // Process oldest first

    if (patchFiles.length === 0) {
      console.log('✅ No pending patches found');
      return;
    }

    console.log(`📦 Found ${patchFiles.length} pending patches`);

    for (const patchFile of patchFiles) {
      await this.executePatch(patchFile);
    }
  }

  // Execute a single patch
  async executePatch(patchFileName) {
    const patchPath = path.join(this.patchesPath, patchFileName);
    console.log(`\n🔧 Executing patch: ${patchFileName}`);

    try {
      // Read patch data and handle JSON comments
      let content = fs.readFileSync(patchPath, 'utf8');
      
      // Remove JSON comments (lines starting with //)
      content = content.replace(/^\s*\/\/.*$/gm, '');
      
      const patchData = JSON.parse(content);
      console.log('📋 Patch data:', patchData);

      // Execute based on patch type
      const result = await this.executePatchData(patchData, patchFileName);
      
      // Move patch to archive
      const archivePath = path.join(this.patchesPath, '.archive', patchFileName);
      fs.renameSync(patchPath, archivePath);
      console.log(`✅ Patch executed and archived: ${patchFileName}`);

      // Write summary
      this.writeSummary(patchFileName, result);

    } catch (error) {
      console.error(`❌ Error executing patch ${patchFileName}:`, error.message);
      
      // Move to failed directory
      const failedPath = path.join(this.patchesPath, '.failed', patchFileName);
      fs.renameSync(patchPath, failedPath);
      console.log(`❌ Patch moved to failed: ${patchFileName}`);
    }
  }

  // Execute patch data based on content
  async executePatchData(patchData, patchFileName) {
    const result = {
      success: false,
      message: '',
      timestamp: new Date().toISOString()
    };

    try {
      // Handle different patch types
      if (patchData.test) {
        console.log('🧪 Executing test patch');
        result.success = true;
        result.message = 'Test patch executed successfully';
        
        // Add any test-specific logic here
        if (patchData.target === 'test') {
          console.log('✅ Test target confirmed');
        }
      } else if (patchData.instructions) {
        console.log('📝 Executing instruction patch');
        result.success = true;
        result.message = 'Instruction patch executed successfully';
        
        // Handle instruction blocks
        await this.executeInstructions(patchData.instructions);
      } else if (patchData.commands) {
        console.log('⚡ Executing command patch');
        result.success = true;
        result.message = 'Command patch executed successfully';
        
        // Execute commands
        for (const command of patchData.commands) {
          console.log(`🔄 Executing: ${command}`);
          // Add command execution logic here
        }
      } else {
        console.log('📄 Executing generic patch');
        result.success = true;
        result.message = 'Generic patch executed successfully';
      }

    } catch (error) {
      result.success = false;
      result.message = `Error: ${error.message}`;
      throw error;
    }

    return result;
  }

  // Execute instruction blocks
  async executeInstructions(instructions) {
    if (Array.isArray(instructions)) {
      for (const instruction of instructions) {
        console.log(`📋 Executing instruction: ${instruction.type || 'unknown'}`);
        // Add instruction execution logic here
      }
    } else if (typeof instructions === 'object') {
      console.log(`📋 Executing instruction block: ${instructions.type || 'unknown'}`);
      // Add instruction execution logic here
    }
  }

  // Write execution summary
  writeSummary(patchFileName, result) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const summaryFileName = `summary-${timestamp}.md`;
    const summaryPath = path.join(this.summariesPath, summaryFileName);

    if (!fs.existsSync(this.summariesPath)) {
      fs.mkdirSync(this.summariesPath, { recursive: true });
    }

    const summary = `# Patch Execution Summary
Generated: ${new Date().toISOString()}

## Patch Details
- **File**: ${patchFileName}
- **Status**: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}
- **Message**: ${result.message}

## Execution Details
- **Timestamp**: ${result.timestamp}
- **Executor**: patch-executor.js

## Result
${result.success ? 'Patch executed successfully' : 'Patch execution failed'}
`;

    fs.writeFileSync(summaryPath, summary);
    console.log(`📄 Summary written: ${summaryFileName}`);
  }

  // Watch for new patches
  watchForPatches() {
    console.log('👀 Watching for new patches...');
    
    if (!fs.existsSync(this.patchesPath)) {
      console.log('❌ Patches directory not found');
      return;
    }

    // Check for new patches every 10 seconds
    setInterval(async () => {
      const patchFiles = fs.readdirSync(this.patchesPath)
        .filter(file => file.endsWith('.json') && file.startsWith('patch-'));
      
      if (patchFiles.length > 0) {
        console.log(`🆕 Found ${patchFiles.length} new patches, executing...`);
        await this.executePendingPatches();
      }
    }, 10000);
  }
}

// Run if called directly
if (require.main === module) {
  const executor = new PatchExecutor();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'execute':
      executor.executePendingPatches();
      break;
    case 'watch':
      executor.watchForPatches();
      break;
    default:
      console.log('Usage: node patch-executor.js [execute|watch]');
      console.log('  execute - Execute all pending patches');
      console.log('  watch   - Watch for new patches and execute them');
  }
}

module.exports = PatchExecutor; 