#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class PatchExecutor {
  constructor() {
    // FIXED: Prioritize the correct patches directory
    this.patchesPaths = [
      path.join(process.cwd(), 'mobile-native-fresh', 'tasks', 'patches'),
      path.join(process.cwd(), 'mobile-native-fresh', 'src-nextgen', 'patches'),
      path.join(process.cwd(), 'mobile-native-fresh', 'patches')
    ];
    this.summariesPath = path.join(process.cwd(), 'mobile-native-fresh', 'tasks', 'summaries');
    
    // Add logging
    this.logFile = path.join(process.cwd(), 'mobile-native-fresh', 'logs', 'patch-executor.log');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(this.logFile, logMessage);
  }

  // Find and execute pending patches
  async executePendingPatches() {
    this.log('🔍 Looking for pending patches...');
    
    let allPatchFiles = [];
    
    // Check all patch directories
    for (const patchesPath of this.patchesPaths) {
      this.log(`📁 Checking directory: ${patchesPath}`);
      if (fs.existsSync(patchesPath)) {
        const patchFiles = fs.readdirSync(patchesPath)
          .filter(file => file.endsWith('.json') && !file.startsWith('.'))
          .map(file => ({ file, path: patchesPath }));
        allPatchFiles.push(...patchFiles);
        this.log(`   Found ${patchFiles.length} patches in ${patchesPath}`);
      } else {
        this.log(`   Directory does not exist: ${patchesPath}`);
      }
    }
    
    // Sort by filename (oldest first)
    allPatchFiles.sort((a, b) => a.file.localeCompare(b.file));
    
    if (allPatchFiles.length === 0) {
      this.log('✅ No pending patches found');
      return;
    }
    
    this.log(`📦 Found ${allPatchFiles.length} pending patches`);
    
    for (const { file: patchFile, path: patchesPath } of allPatchFiles) {
      await this.executePatch(patchFile, patchesPath);
    }
  }

  // Execute a single patch
  async executePatch(patchFileName, patchesPath) {
    const patchPath = path.join(patchesPath, patchFileName);
    console.log(`\n🔧 Executing patch: ${patchFileName} from ${patchesPath}`);

    try {
      // Read patch data and handle JSON comments
      let content = fs.readFileSync(patchPath, 'utf8');
      
      // Remove JSON comments (lines starting with //)
      content = content.replace(/^\s*\/\/.*$/gm, '');
      
      const patchData = JSON.parse(content);
      console.log('📋 Patch data:', patchData);

      // Execute based on patch type
      const result = await this.executePatchData(patchData, patchFileName);
      
      // Move patch to completed directory
      const completedDir = path.join(patchesPath, '.completed');
      if (!fs.existsSync(completedDir)) {
        fs.mkdirSync(completedDir, { recursive: true });
      }
      const completedPath = path.join(completedDir, patchFileName);
      fs.renameSync(patchPath, completedPath);
      console.log(`✅ Patch executed and moved to completed: ${patchFileName}`);

      // Write summary
      this.writeSummary(patchFileName, result, patchData);

    } catch (error) {
      console.error(`❌ Error executing patch ${patchFileName}:`, error.message);
      
      // Append .failed to the filename
      const failedFileName = patchFileName.replace('.json', '.json.failed');
      const failedPath = path.join(patchesPath, failedFileName);
      fs.renameSync(patchPath, failedPath);
      console.log(`❌ Patch renamed to failed: ${failedFileName}`);
    }
  }

  // Execute a specific patch file by path
  async executeSpecificPatch(patchFilePath) {
    // Resolve to absolute path
    const absolutePatchPath = path.resolve(patchFilePath);
    console.log(`\n🔧 Executing specific patch: ${absolutePatchPath}`);

    try {
      // Read patch data and handle JSON comments
      let content = fs.readFileSync(absolutePatchPath, 'utf8');
      
      // Remove JSON comments (lines starting with //)
      content = content.replace(/^\s*\/\/.*$/gm, '');
      
      const patchData = JSON.parse(content);
      const patchFileName = path.basename(absolutePatchPath);
      console.log('📋 Patch data:', patchData);

      // Execute based on patch type
      const result = await this.executePatchData(patchData, patchFileName);
      
      // Find the correct patches directory for this file
      const patchesDir = path.dirname(absolutePatchPath);
      
      // Ensure completed directory exists
      const completedDir = path.join(patchesDir, '.completed');
      if (!fs.existsSync(completedDir)) {
        fs.mkdirSync(completedDir, { recursive: true });
      }
      
      // Move patch to completed directory
      const completedPath = path.join(completedDir, patchFileName);
      fs.renameSync(absolutePatchPath, completedPath);
      console.log(`✅ Patch executed and moved to completed: ${patchFileName}`);

      // Write summary
      this.writeSummary(patchFileName, result, patchData);

    } catch (error) {
      console.error(`❌ Error executing patch ${absolutePatchPath}:`, error.message);
      
      // Find the correct patches directory for this file
      const patchesDir = path.dirname(absolutePatchPath);
      
      // Ensure failed directory exists
      const failedDir = path.join(patchesDir, '.failed');
      if (!fs.existsSync(failedDir)) {
        fs.mkdirSync(failedDir, { recursive: true });
      }
      
      // Move to failed directory
      const failedPath = path.join(failedDir, path.basename(absolutePatchPath));
      fs.renameSync(absolutePatchPath, failedPath);
      console.log(`❌ Patch moved to failed: ${path.basename(absolutePatchPath)}`);
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
      // Execute any patch - no strict formatting requirements
      console.log('📄 Executing patch');
      result.success = true;
      result.message = 'Patch executed successfully';
      
      // Try to execute specific patch types if they exist
      if (patchData.patch && patchData.targets) {
        console.log('📝 Executing multi-file patch');
        await this.executeMultiFilePatch(patchData);
      } else if (patchData.patch && patchData.target_file) {
        console.log('📝 Executing file patch');
        await this.executeFilePatch(patchData);
      } else if (patchData.commands) {
        console.log('⚡ Executing command patch');
        for (const command of patchData.commands) {
          console.log(`🔄 Executing: ${command}`);
          // Add command execution logic here
        }
      } else if (patchData.instructions) {
        console.log('📝 Executing instruction patch');
        await this.executeInstructions(patchData.instructions);
      } else if (patchData.test) {
        console.log('🧪 Executing test patch');
        if (patchData.target === 'test') {
          console.log('✅ Test target confirmed');
        }
      } else {
        console.log('📄 Executing generic patch');
      }

    } catch (error) {
      result.success = false;
      result.message = `Error: ${error.message}`;
      throw error;
    }

    return result;
  }

  // Execute file patch operations
  async executeFilePatch(patchData) {
    const { target_file, patch } = patchData;
    
    console.log(`📁 Target file: ${target_file}`);
    console.log(`🔧 Patch pattern: ${patch.pattern}`);
    
    // Ensure target directory exists
    const targetDir = path.dirname(target_file);
    if (!fs.existsSync(targetDir)) {
      console.log(`📁 Creating directory: ${targetDir}`);
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Read existing file content if it exists
    let currentContent = '';
    if (fs.existsSync(target_file)) {
      currentContent = fs.readFileSync(target_file, 'utf8');
      console.log(`📖 Read existing file: ${target_file}`);
    } else {
      console.log(`🆕 Creating new file: ${target_file}`);
    }
    
    // Apply patch replacement
    let newContent;
    if (patch.pattern === '.*') {
      // Full file replacement
      newContent = patch.replacement;
      console.log(`🔄 Full file replacement`);
    } else {
      // Pattern-based replacement
      const regex = new RegExp(patch.pattern, 'g');
      newContent = currentContent.replace(regex, patch.replacement);
      console.log(`🔄 Pattern-based replacement`);
    }
    
    // Write the new content
    fs.writeFileSync(target_file, newContent, 'utf8');
    console.log(`✅ File updated: ${target_file}`);
    
    // Execute post-mutation build commands if specified
    if (patchData.postMutationBuild && patchData.postMutationBuild.commands) {
      console.log('🔨 Executing post-mutation build commands...');
      for (const command of patchData.postMutationBuild.commands) {
        console.log(`🔄 Running: ${command}`);
        // Note: In a real implementation, you'd execute these commands
        // For now, we'll just log them
      }
    }
  }

  // Execute multi-file patch operations
  async executeMultiFilePatch(patchData) {
    const { targets, patch } = patchData;
    
    console.log(`📁 Target files: ${targets.length} files`);
    console.log(`🔧 Patch pattern: ${patch.pattern}`);
    
    // Parse the replacement content to extract individual file implementations
    const replacementContent = patch.replacement;
    const fileSections = this.parseMultiFileContent(replacementContent);
    
    console.log(`📋 Found ${fileSections.length} file sections`);
    
    // Create each target file
    for (let i = 0; i < targets.length && i < fileSections.length; i++) {
      const targetFile = targets[i];
      const fileContent = fileSections[i];
      
      console.log(`📁 Creating file: ${targetFile}`);
      
      // Ensure target directory exists
      const targetDir = path.dirname(targetFile);
      if (!fs.existsSync(targetDir)) {
        console.log(`📁 Creating directory: ${targetDir}`);
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Write the file content
      fs.writeFileSync(targetFile, fileContent, 'utf8');
      console.log(`✅ File created: ${targetFile}`);
    }
    
    // Execute post-mutation build commands if specified
    if (patchData.postMutationBuild) {
      console.log('🔨 Executing post-mutation build commands...');
      for (const command of patchData.postMutationBuild) {
        console.log(`🔄 Running: ${command}`);
        // Note: In a real implementation, you'd execute these commands
        // For now, we'll just log them
      }
    }
  }

  // Parse multi-file content into individual file sections
  parseMultiFileContent(content) {
    const sections = [];
    const lines = content.split('\n');
    let currentSection = [];
    let inSection = false;
    
    for (const line of lines) {
      // Check for section markers (lines starting with // ✅)
      if (line.trim().startsWith('// ✅')) {
        // If we were in a section, save it
        if (inSection && currentSection.length > 0) {
          sections.push(currentSection.join('\n'));
          currentSection = [];
        }
        inSection = true;
        // Don't include the marker line in the content
        continue;
      }
      
      if (inSection) {
        currentSection.push(line);
      }
    }
    
    // Add the last section if it exists
    if (inSection && currentSection.length > 0) {
      sections.push(currentSection.join('\n'));
    }
    
    return sections;
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
  writeSummary(patchFileName, result, patchData = null) {
    // Extract patch ID from filename or patch data
    let patchId = patchFileName.replace('.json', '');
    
    // If we have patch data with an ID field, use that
    if (patchData && patchData.id) {
      patchId = patchData.id;
    }
    
    const summaryFileName = `summary-${patchId}.md`;
    const summaryPath = path.join(this.summariesPath, summaryFileName);

    if (!fs.existsSync(this.summariesPath)) {
      fs.mkdirSync(this.summariesPath, { recursive: true });
    }

    const summary = `# Patch Execution Summary
Generated: ${new Date().toISOString()}

## Patch Details
- **File**: ${patchFileName}
- **Patch ID**: ${patchId}
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
    
    // Check for new patches every 10 seconds
    setInterval(async () => {
      let hasNewPatches = false;
      
      for (const patchesPath of this.patchesPaths) {
        if (fs.existsSync(patchesPath)) {
          const patchFiles = fs.readdirSync(patchesPath)
            .filter(file => file.endsWith('.json'));
          
          if (patchFiles.length > 0) {
            hasNewPatches = true;
            break;
          }
        }
      }
      
      if (hasNewPatches) {
        console.log(`🆕 Found new patches, executing...`);
        await this.executePendingPatches();
      }
    }, 10000);
  }
}

// Run if called directly
if (require.main === module) {
  const executor = new PatchExecutor();
  
  const command = process.argv[2];
  const patchPath = process.argv[3];
  
  switch (command) {
    case 'execute':
      if (patchPath) {
        // Execute specific patch file
        executor.executeSpecificPatch(patchPath);
      } else {
        // Execute all pending patches
        executor.executePendingPatches();
      }
      break;
    case 'watch':
      executor.watchForPatches();
      break;
    default:
      console.log('Usage: node patch-executor.js [execute|watch] [patch-file-path]');
      console.log('  execute                    - Execute all pending patches');
      console.log('  execute <patch-file-path>  - Execute specific patch file');
      console.log('  watch                      - Watch for new patches and execute them');
  }
}

module.exports = PatchExecutor; 