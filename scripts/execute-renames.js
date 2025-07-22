#!/usr/bin/env node

/**
 * Execute Renames Script
 * Renames .md files in summaries directory based on content metadata
 * Only processes files that actually exist in the target directory
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SUMMARIES_PATH = '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/';
const ENFORCER_LOG = '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/.enforcer-rejections.log';

// Results tracking
const results = {
  processed: 0,
  renamed: 0,
  skipped: 0,
  errors: 0,
  violations: []
};

/**
 * Log violation to enforcer log
 */
function logViolation(type, filePath, reason) {
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} | ${type} | ${filePath} | ${reason} | VIOLATION_LOGGED\n`;
  fs.appendFileSync(ENFORCER_LOG, entry);
  results.violations.push({ type, filePath, reason });
}

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

  // Check for existing backlink headers
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
 * Generate recommended filename
 */
function generateRecommendedName(metadata, originalName) {
  if (metadata.patch && metadata.version && metadata.tag) {
    return `summary-${metadata.version}${metadata.patch}_${metadata.tag}.md`;
  }
  
  // Fallback for files with partial metadata
  if (metadata.version) {
    return `summary-${metadata.version}_${originalName.replace('.md', '')}.md`;
  }
  
  return null;
}

/**
 * Process a single file for rename
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const metadata = extractMetadata(content, filePath);
    
    results.processed++;
    
    // Generate recommended name
    const recommendedName = generateRecommendedName(metadata, fileName);
    
    if (recommendedName && recommendedName !== fileName) {
      const newPath = path.join(path.dirname(filePath), recommendedName);
      
      // Check if target file already exists
      if (fs.existsSync(newPath)) {
        logViolation('RENAME_CONFLICT', filePath, `Target file ${recommendedName} already exists`);
        results.errors++;
        console.log(`❌ Conflict: ${fileName} → ${recommendedName} (target exists)`);
        return;
      }
      
      // Perform rename
      fs.renameSync(filePath, newPath);
      results.renamed++;
      console.log(`✅ Renamed: ${fileName} → ${recommendedName}`);
      
    } else if (!recommendedName) {
      // No metadata found - log violation
      logViolation('INVALID_METADATA', filePath, 'Cannot extract patch/phase metadata for rename');
      results.errors++;
      console.log(`❌ No metadata: ${fileName}`);
    } else {
      // Already has correct name
      results.skipped++;
      console.log(`⏭️  Skipped: ${fileName} (already correct)`);
    }
    
  } catch (error) {
    logViolation('RENAME_FAILED', filePath, error.message);
    results.errors++;
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

/**
 * Find all .md files in summaries directory
 */
function findSummaryFiles() {
  const files = [];
  
  try {
    const items = fs.readdirSync(SUMMARIES_PATH);
    
    for (const item of items) {
      if (item.endsWith('.md') && !item.startsWith('.')) {
        files.push(path.join(SUMMARIES_PATH, item));
      }
    }
  } catch (error) {
    console.error('Error reading summaries directory:', error.message);
    return [];
  }
  
  return files;
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Starting file rename execution...');
  console.log(`📁 Processing: ${SUMMARIES_PATH}`);
  
  // Find all summary files
  const files = findSummaryFiles();
  console.log(`📄 Found ${files.length} .md files to process`);
  
  // Process each file
  for (const filePath of files) {
    processFile(filePath);
  }
  
  // Report results
  console.log('\n📊 Rename Execution Results:');
  console.log(`   - Processed: ${results.processed}`);
  console.log(`   - Renamed: ${results.renamed}`);
  console.log(`   - Skipped: ${results.skipped}`);
  console.log(`   - Errors: ${results.errors}`);
  console.log(`   - Violations: ${results.violations.length}`);
  
  if (results.violations.length > 0) {
    console.log('\n⚠️  Violations logged to:', ENFORCER_LOG);
  }
  
  // Show final file list
  const finalFiles = findSummaryFiles();
  console.log(`\n📁 Final file count: ${finalFiles.length}`);
  
  if (results.renamed > 0) {
    console.log('\n📋 Renamed files:');
    finalFiles.forEach(file => {
      console.log(`   - ${path.basename(file)}`);
    });
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { processFile, extractMetadata, generateRecommendedName }; 