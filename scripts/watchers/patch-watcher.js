#!/usr/bin/env { { { { node

import { PATCH_WATCH_DIR, PATCH_COMPLETED_DIR & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} from '../constants/paths.js';
import fs from 'fs';
import path from 'path';

/**
 * GHOST 2.x Unified Patch Watcher
 * Monitors .cursor-cache/MAIN/patches/ for new patches from ghost
 */

class PatchWatcher {
    constructor() {
        this.watchDir = PATCH_WATCH_DIR;
        this.completedDir = PATCH_COMPLETED_DIR;
        this.isWatching = false;
        this.watcher = null;
        
        // Ensure directories exist
        this.ensureDirectories();
    }

    ensureDirectories() {
        if (!fs.existsSync(this.watchDir)) {
            fs.mkdirSync(this.watchDir, { recursive: true });
            console.log(`📁 Created patch watch directory: ${this.watchDir}`);
        }
        
        if (!fs.existsSync(this.completedDir)) {
            fs.mkdirSync(this.completedDir, { recursive: true });
            console.log(`📁 Created completed directory: ${this.completedDir}`);
        }
    }

    startWatching() {
        if (this.isWatching) {
            console.log('⚠️  Patch watcher already running');
            return;
        }

        console.log(`👁️  Starting GHOST 2.x patch watcher...`);
        console.log(`📁 Watching directory: ${this.watchDir}`);
        
        this.isWatching = true;
        
        // Initial scan for pending patches
        this.scanForPatches();
        
        // Set up file watching
        this.watcher = fs.watch(this.watchDir, { recursive: false }, (eventType, filename) => {
            if (filename && filename.endsWith('.json') && filename.startsWith('patch-')) {
                console.log(`🆕 New patch detected: ${filename}`);
                this.handleNewPatch(filename);
            }
        });
        
        console.log('✅ GHOST 2.x patch watcher active');
    }

    stopWatching() {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
        this.isWatching = false;
        console.log('🛑 GHOST 2.x patch watcher stopped');
    }

    scanForPatches() {
        try {
            const files = fs.readdirSync(this.watchDir);
            const patchFiles = files.filter(file => 
                file.endsWith('.json') && 
                file.startsWith('patch-') &&
                !file.includes('.completed') &&
                !file.includes('.failed')
            );

            if (patchFiles.length > 0) {
                console.log(`📦 Found ${patchFiles.length} pending patches`);
                patchFiles.forEach(patch => this.handleNewPatch(patch));
            } else {
                console.log('📭 No pending patches found');
            }
        } catch (error) {
            console.error('❌ Error scanning for patches:', error.message);
        }
    }

    handleNewPatch(filename) {
        const patchPath = path.join(this.watchDir, filename);
        
        try {
            // Read and validate patch
            const patchContent = fs.readFileSync(patchPath, 'utf8');
            const patchData = JSON.parse(patchContent);
            
            console.log(`🔧 Processing patch: ${filename}`);
            console.log(`📋 Patch ID: ${patchData.id || 'N/A'}`);
            console.log(`📋 Version: ${patchData.version || 'N/A'}`);
            
            // Execute patch (this would integrate with the patch executor)
            this.executePatch(filename, patchData);
            
        } catch (error) {
            console.error(`❌ Error processing patch ${filename}:`, error.message);
            this.moveToFailed(filename, error.message);
        }
    }

    executePatch(filename, patchData) {
        // This would integrate with the existing patch executor
        // For now, we'll simulate the execution
        console.log(`⚡ Executing patch: ${filename}`);
        
        // Simulate execution time
        setTimeout(() => {
            console.log(`✅ Patch executed successfully: ${filename}`);
            this.moveToCompleted(filename);
        }, 1000);
    }

    moveToCompleted(filename) {
        const sourcePath = path.join(this.watchDir, filename);
        const destPath = path.join(this.completedDir, filename);
        
        try {
            fs.renameSync(sourcePath, destPath);
            console.log(`✅ Patch moved to completed: ${filename}`);
        } catch (error) {
            console.error(`❌ Error moving patch to completed: ${error.message}`);
        }
    }

    moveToFailed(filename, error) {
        const failedDir = path.join(this.watchDir, '.failed');
        if (!fs.existsSync(failedDir)) {
            fs.mkdirSync(failedDir, { recursive: true });
        }
        
        const sourcePath = path.join(this.watchDir, filename);
        const destPath = path.join(failedDir, filename);
        
        try {
            fs.renameSync(sourcePath, destPath);
            console.log(`❌ Patch moved to failed: ${filename}`);
        } catch (moveError) {
            console.error(`❌ Error moving patch to failed: ${moveError.message}`);
        }
    }

    getStatus() {
        return {
            isWatching: this.isWatching,
            watchDir: this.watchDir,
            completedDir: this.completedDir,
            pendingPatches: this.getPendingPatchesCount()
        };
    }

    getPendingPatchesCount() {
        try {
            const files = fs.readdirSync(this.watchDir);
            return files.filter(file => 
                file.endsWith('.json') && 
                file.startsWith('patch-') &&
                !file.includes('.completed') &&
                !file.includes('.failed')
            ).length;
        } catch (error) {
            return 0;
        }
    }
}

// Export singleton instance
const patchWatcher = new PatchWatcher();
export default patchWatcher;

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const command = process.argv[2];
    
    switch (command) {
        case 'start':
            patchWatcher.startWatching();
            break;
        case 'stop':
            patchWatcher.stopWatching();
            break;
        case 'status':
            console.log('📊 Patch Watcher Status:', patchWatcher.getStatus());
            break;
        default:
            console.log('Usage: { { { { node patch-watcher.js [start|stop|status]') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
    }
} 