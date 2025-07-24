#!/usr/bin/env { { { { node

/** & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
 * Repair Rejected MD Script
 * Attempts to recover rejected markdown files by re-parsing content
 * and applying canonical names if valid metadata is found
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SUMMARIES_PATH = '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/';
const ENFORCER_LOG = '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/.enforcer-rejections.log';
const UNRECOVERABLE_LOG = '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/.md.unrecoverable.log';

// Results tracking
const results = {
  processed: 0,
  recovered: 0,
  unrecoverable: 0,
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
 * Log unrecoverable file
 */
function logUnrecoverable(filePath, reason) {
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} | ${filePath} | ${reason} | UNRECOVERABLE\n`;
  fs.appendFileSync(UNRECOVERABLE_LOG, entry);
  results.unrecoverable++;
}

/**
 * Extract metadata from file content with enhanced parsing
 */
function extractMetadata(content, filePath) {
  const metadata = {
    patch: null,
    phase: null,
    version: null,
    tag: null,
    hasBacklink: false,
    title: null
  };

  // Check for existing backlink headers
  if (content.includes('🔗 patch:') && content.includes('📍 phase:')) {
    metadata.hasBacklink = true;
  }

  // Extract title from first line
  const lines = content.split('\n');
  if (lines.length > 0 && lines[0].trim()) {
    metadata.title = lines[0].replace(/^#\s*/, '').trim();
  }

  // Enhanced patch pattern matching
  const patchPatterns = [
    /patch-v(\d+\.\d+\.\d+)(\(P\d+\.\d+\.\d+\))_([^.]+)/g,
    /patch-v(\d+\.\d+\.\d+)(\(P\d+\.\d+\.\d+\))/g,
    /patch-v(\d+\.\d+\.\d+)_([^.]+)/g
  ];

  for (const pattern of patchPatterns) {
    const match = content.match(pattern);
    if (match) {
      metadata.version = match[1];
      metadata.patch = match[2] || '';
      metadata.tag = match[3] || '';
      break;
    }
  }

  // Enhanced phase pattern matching
  const phasePatterns = [
    /Phase\s+(\d+)/gi,
    /P(\d+)\.(\d+)\.(\d+)/g,
    /Phase\s*(\d+)/gi
  ];

  for (const pattern of phasePatterns) {
    const match = content.match(pattern);
    if (match) {
      metadata.phase = `P${match[1]}`;
      break;
    }
  }

  // Enhanced version pattern matching
  if (!metadata.version) {
    const versionPatterns = [
      /v(\d+\.\d+\.\d+)/g,
      /version\s*(\d+\.\d+\.\d+)/gi,
      /(\d+\.\d+\.\d+)/g
    ];

    for (const pattern of versionPatterns) {
      const match = content.match(pattern);
      if (match) {
        metadata.version = match[1];
        break;
      }
    }
  }

  return metadata;
}

/**
 * Generate recommended filename with fallbacks
 */
function generateRecommendedName(metadata, originalName) {
  // Try canonical format first
  if (metadata.patch && metadata.version && metadata.tag) {
    return `summary-${metadata.version}${metadata.patch}_${metadata.tag}.md`;
  }
  
  // Try with just version and tag
  if (metadata.version && metadata.tag) {
    return `summary-${metadata.version}_${metadata.tag}.md`;
  }
  
  // Try with version and title
  if (metadata.version && metadata.title) {
    const cleanTitle = metadata.title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
    return `summary-${metadata.version}_${cleanTitle}.md`;
  }
  
  // Try with just version
  if (metadata.version) {
    const cleanName = originalName.replace('.md', '').replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');
    return `summary-${metadata.version}_${cleanName}.md`;
  }
  
  return null;
}

/**
 * Process a single file for recovery
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
        logViolation('RECOVERY_CONFLICT', filePath, `Target file ${recommendedName} already exists`);
        results.errors++;
        console.log(`❌ Conflict: ${fileName} → ${recommendedName} (target exists)`);
        return;
      }
      
      // Perform rename
      fs.renameSync(filePath, newPath);
      results.recovered++;
      console.log(`✅ Recovered: ${fileName} → ${recommendedName}`);
      
    } else if (!recommendedName) {
      // No metadata found - log as unrecoverable
      logUnrecoverable(filePath, 'Cannot extract sufficient metadata for canonical naming');
      results.unrecoverable++;
      console.log(`❌ Unrecoverable: ${fileName} (no metadata)`);
    } else {
      // Already has correct name
      console.log(`⏭️  Skipped: ${fileName} (already correct)`);
    }
    
  } catch (error) {
    logViolation('RECOVERY_FAILED', filePath, error.message);
    results.errors++;
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

/**
 * Get list of rejected files from enforcer log
 */
function getRejectedFiles() {
  const files = [];
  
  try {
    const logContent = fs.readFileSync(ENFORCER_LOG, 'utf8');
    const lines = logContent.split('\n');
    
    for (const line of lines) {
      if (line.includes('INVALID_METADATA') && line.includes('/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/')) {
        const parts = line.split(' | ');
        if (parts.length >= 3) {
          const filePath = parts[2];
          if (fs.existsSync(filePath)) {
            files.push(filePath);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading enforcer log:', error.message);
  }
  
  return [...new Set(files)]; // Remove duplicates
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 Starting rejected MD file recovery...');
  console.log(`📁 Processing: ${SUMMARIES_PATH}`);
  
  // Get rejected files from enforcer log
  const rejectedFiles = getRejectedFiles();
  console.log(`📄 Found ${rejectedFiles.length} rejected files to process`);
  
  // Process each file
  for (const filePath of rejectedFiles) {
    processFile(filePath);
  }
  
  // Report results
  console.log('\n📊 Recovery Results:');
  console.log(`   - Processed: ${results.processed}`);
  console.log(`   - Recovered: ${results.recovered}`);
  console.log(`   - Unrecoverable: ${results.unrecoverable}`);
  console.log(`   - Errors: ${results.errors}`);
  console.log(`   - Violations: ${results.violations.length}`);
  
  if (results.unrecoverable > 0) {
    console.log('\n⚠️  Unrecoverable files logged to:', UNRECOVERABLE_LOG);
  }
  
  if (results.violations.length > 0) {
    console.log('\n⚠️  Violations logged to:', ENFORCER_LOG);
  }
  
  // Show final file list
  const finalFiles = fs.readdirSync(SUMMARIES_PATH).filter(f => f.endsWith('.md'));
  console.log(`\n📁 Final file count: ${finalFiles.length}`);
  
  if (results.recovered > 0) {
    console.log('\n📋 Recovered files:');
    finalFiles.forEach(file => {
      if (file.startsWith('summary-')) {
        console.log(`   - ${file}`);
      }
    });
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { processFile, extractMetadata, generateRecommendedName }; 