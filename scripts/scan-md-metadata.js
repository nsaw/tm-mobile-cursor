#!/usr/bin/env node

/**
 * MD Metadata Scanner
 * Scans all .md files for patch/phase/version metadata
 * Generates manifest, rename log, and missing log
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SCAN_PATHS = [
  '/Users/sawyer/gitSync/tm-mobile-cursor',
  '/Users/sawyer/gitSync/.cursor-cache'
];

const OUTPUT_FILES = {
  manifest: '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/doc-manifest.json',
  renameLog: '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/.md.rename.log',
  missingLog: '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/.md.missing.log'
};

// Regex patterns for metadata extraction
const PATTERNS = {
  patch: /patch-v(\d+\.\d+\.\d+)(\(P\d+\.\d+\.\d+\))_([^.]+)/g,
  phase: /Phase\s+(\d+)/gi,
  version: /v(\d+\.\d+\.\d+)/g,
  phaseTag: /P(\d+)\.(\d+)\.(\d+)/g
};

// Results storage
const results = {
  summaries: {},
  helpers: {},
  deprecated: {},
  missing: [],
  rename: []
};

/**
 * Extract metadata from file content
 */
function extractMetadata(content, filePath) {
  const metadata = {
    patch: null,
    phase: null,
    version: null,
    tag: null,
    hasBacklink: false
  };

  // Check for backlink headers
  if (content.includes('🔗 patch:') && content.includes('📍 phase:')) {
    metadata.hasBacklink = true;
  }

  // Extract patch information
  const patchMatch = content.match(/patch-v(\d+\.\d+\.\d+)(\(P\d+\.\d+\.\d+\))_([^.]+)/);
  if (patchMatch) {
    metadata.version = patchMatch[1];
    metadata.patch = patchMatch[2];
    metadata.tag = patchMatch[3];
  }

  // Extract phase information
  const phaseMatch = content.match(/Phase\s+(\d+)/i);
  if (phaseMatch) {
    metadata.phase = `P${phaseMatch[1]}`;
  }

  // Extract version if not found in patch
  if (!metadata.version) {
    const versionMatch = content.match(/v(\d+\.\d+\.\d+)/);
    if (versionMatch) {
      metadata.version = versionMatch[1];
    }
  }

  return metadata;
}

/**
 * Determine file type based on content and metadata
 */
function determineFileType(metadata, fileName) {
  if (metadata.patch && metadata.version) {
    return 'summary';
  }
  
  if (fileName.includes('ROADMAP') || fileName.includes('CHECKLIST') || fileName.includes('GUIDE')) {
    return 'helper';
  }
  
  if (fileName.includes('README') || fileName.includes('INDEX') || fileName.includes('CHANGELOG')) {
    return 'helper';
  }
  
  return 'unknown';
}

/**
 * Generate recommended filename
 */
function generateRecommendedName(metadata, originalName) {
  if (metadata.patch && metadata.version && metadata.tag) {
    return `summary-${metadata.version}${metadata.patch}_${metadata.tag}.md`;
  }
  return originalName;
}

/**
 * Scan a single file
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const metadata = extractMetadata(content, filePath);
    const fileName = path.basename(filePath);
    const fileType = determineFileType(metadata, fileName);
    
    const fileInfo = {
      path: filePath,
      name: fileName,
      type: fileType,
      metadata: metadata,
      size: fs.statSync(filePath).size,
      modified: fs.statSync(filePath).mtime.toISOString()
    };

    // Categorize file
    if (fileType === 'summary' && metadata.patch) {
      const key = generateRecommendedName(metadata, fileName);
      results.summaries[key] = fileInfo;
      
      // Check if rename is needed
      if (fileName !== key) {
        results.rename.push(`${filePath} → ${key}`);
      }
    } else if (fileType === 'helper') {
      results.helpers[fileName] = fileInfo;
    } else if (metadata.patch || metadata.version) {
      // Has some metadata but not complete
      results.helpers[fileName] = fileInfo;
    } else {
      // No metadata found
      results.missing.push(`${filePath} | no_patch_metadata | manual_review`);
    }

  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error.message);
  }
}

/**
 * Find all .md files recursively
 */
function findMdFiles(dir) {
  const files = [];
  
  function walk(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules and other system directories
          if (!item.startsWith('.') && item !== 'node_modules') {
            walk(fullPath);
          }
        } else if (item.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error walking directory ${currentDir}:`, error.message);
    }
  }
  
  walk(dir);
  return files;
}

/**
 * Write results to files
 */
function writeResults() {
  // Write manifest
  const manifest = {
    version: "v1.4.40(P0.99.02)",
    generated: new Date().toISOString(),
    description: "Documentation manifest generated from content scan",
    canonical_path: "/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/",
    summaries: results.summaries,
    helpers: results.helpers,
    deprecated: results.deprecated,
    scan_stats: {
      total_files: Object.keys(results.summaries).length + Object.keys(results.helpers).length + results.missing.length,
      summaries: Object.keys(results.summaries).length,
      helpers: Object.keys(results.helpers).length,
      missing: results.missing.length,
      rename_candidates: results.rename.length
    }
  };
  
  fs.writeFileSync(OUTPUT_FILES.manifest, JSON.stringify(manifest, null, 2));

  // Write rename log
  const renameContent = `# MD Rename Log - Generated from content scan\n` +
    `# Generated: ${new Date().toISOString()}\n` +
    `# Patch: patch-v1.4.40(P0.99.02)_doc-summary-content-audit\n\n` +
    results.rename.map(entry => entry).join('\n');
  
  fs.writeFileSync(OUTPUT_FILES.renameLog, renameContent);

  // Write missing log
  const missingContent = `# MD Missing Log - Generated from content scan\n` +
    `# Generated: ${new Date().toISOString()}\n` +
    `# Patch: patch-v1.4.40(P0.99.02)_doc-summary-content-audit\n\n` +
    results.missing.map(entry => entry).join('\n');
  
  fs.writeFileSync(OUTPUT_FILES.missingLog, missingContent);
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Starting MD metadata scan...');
  
  // Find all .md files
  let allFiles = [];
  for (const scanPath of SCAN_PATHS) {
    if (fs.existsSync(scanPath)) {
      const files = findMdFiles(scanPath);
      allFiles = allFiles.concat(files);
    }
  }
  
  console.log(`📁 Found ${allFiles.length} .md files to scan`);
  
  // Scan each file
  for (const filePath of allFiles) {
    scanFile(filePath);
  }
  
  // Write results
  writeResults();
  
  console.log('✅ Scan complete!');
  console.log(`📊 Results:`);
  console.log(`   - Summaries: ${Object.keys(results.summaries).length}`);
  console.log(`   - Helpers: ${Object.keys(results.helpers).length}`);
  console.log(`   - Missing metadata: ${results.missing.length}`);
  console.log(`   - Rename candidates: ${results.rename.length}`);
  console.log(`📄 Output files:`);
  console.log(`   - Manifest: ${OUTPUT_FILES.manifest}`);
  console.log(`   - Rename log: ${OUTPUT_FILES.renameLog}`);
  console.log(`   - Missing log: ${OUTPUT_FILES.missingLog}`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { scanFile, extractMetadata, determineFileType }; 