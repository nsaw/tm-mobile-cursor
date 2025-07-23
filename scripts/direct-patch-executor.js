// Unified GHOST patch executor
const fs = require('fs');
const path = require('path');
const PATCH_DIR = require('./constants/paths').PATCH_INPUT_DIR;

fs.watch(PATCH_DIR, (eventType, filename) => {
  if (filename && filename.endsWith('.json')) {
    console.log(`[PATCH EXECUTOR] Detected patch file: ${filename}`);
    const patchPath = path.join(PATCH_DIR, filename);
    require('./runner/apply-patch')(patchPath);
  }
});

console.log(`[PATCH EXECUTOR] Watching ${PATCH_DIR} for incoming patches...`); 