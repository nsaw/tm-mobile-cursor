#!/usr/bin/env node

/**
 * Backlink Repair Script
 * Scans all .md files in summaries directory and reinserts correct backlinks
 * Enforces structureEnforcerMode compliance
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SUMMARIES_PATH = '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/';
const ENFORCER_LOG = '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/.enforcer-rejections.log';

// Results tracking
const results = {
  processed: 0,
  updated: 0,
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
 * Generate backlink header
 */
function generateBacklinkHeader(metadata, fileName) {
  if (metadata.patch && metadata.version && metadata.tag) {
    return `🔗 patch: patch-${metadata.version}${metadata.patch}_${metadata.tag}\n📍 phase: ${metadata.phase || 'Unknown'}\n\n`;
  }
  
  // Fallback for files with partial metadata
  if (metadata.version) {
    return `🔗 patch: ${fileName.replace('.md', '')}\n📍 phase: ${metadata.phase || 'Unknown'}\n\n`;
  }
  
  return null;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const metadata = extractMetadata(content, filePath);
    
    results.processed++;
    
    // Skip if already has valid backlinks
    if (metadata.hasBacklink) {
      results.skipped++;
      return;
    }
    
    // Generate backlink header
    const backlinkHeader = generateBacklinkHeader(metadata, fileName);
    
    if (backlinkHeader) {
      // Insert backlink header after the first line (title)
      const lines = content.split('\n');
      const title = lines[0];
      const rest = lines.slice(1).join('\n');
      
      const newContent = `${title}\n\n${backlinkHeader}${rest}`;
      
      // Write updated content
      fs.writeFileSync(filePath, newContent);
      results.updated++;
      
      console.log(`✅ Updated: ${fileName}`);
    } else {
      // No metadata found - log violation
      logViolation('INVALID_METADATA', filePath, 'Cannot extract patch/phase metadata');
      results.errors++;
      console.log(`❌ No metadata: ${fileName}`);
    }
    
  } catch (error) {
    logViolation('CONTENT_VALIDATION_FAILED', filePath, error.message);
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
  console.log('🔗 Starting backlink repair...');
  console.log(`📁 Scanning: ${SUMMARIES_PATH}`);
  
  // Find all summary files
  const files = findSummaryFiles();
  console.log(`📄 Found ${files.length} .md files to process`);
  
  // Process each file
  for (const filePath of files) {
    processFile(filePath);
  }
  
  // Report results
  console.log('\n📊 Backlink Repair Results:');
  console.log(`   - Processed: ${results.processed}`);
  console.log(`   - Updated: ${results.updated}`);
  console.log(`   - Skipped: ${results.skipped}`);
  console.log(`   - Errors: ${results.errors}`);
  console.log(`   - Violations: ${results.violations.length}`);
  
  if (results.violations.length > 0) {
    console.log('\n⚠️  Violations logged to:', ENFORCER_LOG);
  }
  
  // Validate final state
  const finalFiles = findSummaryFiles();
  const withBacklinks = finalFiles.filter(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return content.includes('🔗 patch:') && content.includes('📍 phase:');
    } catch {
      return false;
    }
  });
  
  console.log(`\n✅ Final validation: ${withBacklinks.length}/${finalFiles.length} files have backlinks`);
  
  if (withBacklinks.length === finalFiles.length) {
    console.log('🎉 All files now have valid backlinks!');
  } else {
    console.log('⚠️  Some files still lack backlinks - check enforcer log');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { processFile, extractMetadata, generateBacklinkHeader }; 