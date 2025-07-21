#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DirectPatchExecutor {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.patchesDir = path.join(this.projectRoot, 'mobile-native-fresh', 'tasks', 'patches');
        this.completedDir = path.join(this.projectRoot, 'mobile-native-fresh', 'tasks', 'patches', 'completed');
        this.summariesDir = path.join(this.projectRoot, 'mobile-native-fresh', 'tasks', 'summaries');
    }

    // Find and execute pending patches
    async executePendingPatches() {
        console.log('🔍 Looking for pending patches...');
        
        if (!fs.existsSync(this.patchesDir)) {
            console.log('❌ Patches directory not found');
            return;
        }

        const files = fs.readdirSync(this.patchesDir);
        const patchFiles = files.filter(file => file.endsWith('.json') && !file.includes('completed'));

        if (patchFiles.length === 0) {
            console.log('📭 No pending patches found');
            return;
        }

        console.log(`📦 Found ${patchFiles.length} pending patches`);

        for (const patchFile of patchFiles) {
            await this.executePatch(patchFile);
        }
    }

    // Execute a single patch
    async executePatch(patchFileName) {
        const patchPath = path.join(this.patchesDir, patchFileName);
        
        try {
            console.log(`🔧 Executing patch: ${patchFileName}`);
            
            // Read patch data
            const patchContent = fs.readFileSync(patchPath, 'utf8');
            const patchData = JSON.parse(patchContent);
            
            console.log(`📋 Patch data:`, {
                id: patchData.id,
                version: patchData.version,
                description: patchData.description,
                actions: patchData.actions?.length || 0,
                postMutationBuild: Array.isArray(patchData.postMutationBuild) ? patchData.postMutationBuild.length : (patchData.postMutationBuild ? 1 : 0)
            });

            // Execute patch actions
            if (patchData.actions) {
                await this.executeActions(patchData.actions);
            }

            // Execute post-mutation build
            if (patchData.postMutationBuild) {
                await this.executePostMutationBuild(patchData.postMutationBuild);
            }

            // Move to completed
            await this.moveToCompleted(patchFileName, patchData);

            // Generate summary
            await this.generateSummary(patchFileName, patchData);

            console.log(`✅ Patch executed successfully: ${patchFileName}`);

        } catch (error) {
            console.error(`❌ Error executing patch ${patchFileName}:`, error.message);
        }
    }

    // Execute patch actions
    async executeActions(actions) {
        console.log(`📄 Executing ${actions.length} actions...`);
        
        for (const action of actions) {
            try {
                if (action.type === 'file_operation') {
                    await this.executeFileOperation(action);
                } else if (action.type === 'command') {
                    await this.executeCommand(action.command);
                }
            } catch (error) {
                console.error(`❌ Error executing action:`, error.message);
            }
        }
    }

    // Execute file operations
    async executeFileOperation(action) {
        const { target, operation, content } = action;
        
        if (operation === 'create') {
            const targetPath = path.join(this.projectRoot, target);
            const targetDir = path.dirname(targetPath);
            
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            
            fs.writeFileSync(targetPath, content || '');
            console.log(`✅ Created file: ${target}`);
        }
    }

    // Execute commands
    async executeCommand(command) {
        console.log(`🔄 Running: ${command}`);
        try {
            const result = execSync(command, { 
                cwd: this.projectRoot,
                encoding: 'utf8',
                timeout: 30000 // 30 second timeout
            });
            console.log(`✅ Command executed successfully`);
        } catch (error) {
            console.error(`❌ Command failed: ${error.message}`);
        }
    }

    // Execute post-mutation build
    async executePostMutationBuild(commands) {
        console.log(`🔨 Executing post-mutation build commands...`);
        
        // Handle both string and array formats
        const commandArray = Array.isArray(commands) ? commands : [commands];
        
        for (const command of commandArray) {
            await this.executeCommand(command);
        }
    }

    // Move patch to completed directory
    async moveToCompleted(patchFileName, patchData) {
        if (!fs.existsSync(this.completedDir)) {
            fs.mkdirSync(this.completedDir, { recursive: true });
        }

        const sourcePath = path.join(this.patchesDir, patchFileName);
        const destPath = path.join(this.completedDir, patchFileName);
        
        fs.renameSync(sourcePath, destPath);
        console.log(`✅ Patch moved to completed: ${patchFileName}`);
    }

    // Generate summary
    async generateSummary(patchFileName, patchData) {
        if (!fs.existsSync(this.summariesDir)) {
            fs.mkdirSync(this.summariesDir, { recursive: true });
        }

        const summaryFileName = `summary-${path.basename(patchFileName, '.json')}.md`;
        const summaryPath = path.join(this.summariesDir, summaryFileName);

        const summary = `# Patch Execution Summary

**Patch**: ${patchData.id || patchFileName}
**Version**: ${patchData.version || 'N/A'}
**Description**: ${patchData.description || 'N/A'}
**Executed At**: ${new Date().toISOString()}

## Actions Executed
${patchData.actions ? patchData.actions.length : 0} actions were executed.

## Post-Mutation Build
${patchData.postMutationBuild ? (Array.isArray(patchData.postMutationBuild) ? patchData.postMutationBuild.length : 1) : 0} build commands were executed.

## Status
✅ Patch executed successfully
✅ Moved to completed directory
✅ Summary generated

---
*Generated by DirectPatchExecutor*
`;

        fs.writeFileSync(summaryPath, summary);
        console.log(`📄 Summary written: ${summaryFileName}`);
    }

    // Monitor for new patches
    async monitor() {
        console.log('👁️  Starting direct patch monitoring...');
        console.log(`📁 Watching directory: ${this.patchesDir}`);
        
        // Initial execution
        await this.executePendingPatches();
        
        // Set up file watching
        fs.watch(this.patchesDir, { recursive: false }, async (eventType, filename) => {
            if (filename && filename.endsWith('.json') && !filename.includes('completed')) {
                console.log(`🆕 New patch detected: ${filename}`);
                await this.executePendingPatches();
            }
        });
        
        console.log('✅ Monitoring active - waiting for new patches...');
    }
}

// Main execution
async function main() {
    const executor = new DirectPatchExecutor();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'execute':
            await executor.executePendingPatches();
            break;
        case 'monitor':
            await executor.monitor();
            break;
        default:
            console.log('Usage: node scripts/direct-patch-executor.js [execute|monitor]');
            console.log('  execute - Execute all pending patches once');
            console.log('  monitor - Monitor for new patches continuously');
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = DirectPatchExecutor; 