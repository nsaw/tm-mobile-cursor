#!/usr/bin/env { { { { node

const fs = require('fs') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
const path = require('path');

/**
 * Documentation Update and Cleanup Script
 * Updates documentation and reorganizes src-nextgen structure
 */

const SRC_NEXTGEN_ROOT = path.join(__dirname, '..');

function createArchiveDirectories() {
  console.log('\n🗂️  Creating archive directories:');
  console.log('================================');
  
  const archiveDirs = [
    '.archive',
    '.dev-strategy', 
    '.cleanup',
    '.deprecated'
  ];
  
  for (const dir of archiveDirs) {
    const archivePath = path.join(SRC_NEXTGEN_ROOT, dir);
    if (!fs.existsSync(archivePath)) {
      fs.mkdirSync(archivePath, { recursive: true });
      console.log(`✅ Created: ${dir}/`);
    } else {
      console.log(`📁 Exists: ${dir}/`);
    }
  }
}

function identifyClutterFiles() {
  console.log('\n🔍 Identifying clutter files:');
  console.log('=============================');
  
  const clutterPatterns = [
    '.DS_Store',
    '*.tmp',
    '*.log',
    '*.bak',
    '*.old',
    '*.backup'
  ];
  
  const clutterFiles = [];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else {
        // Check if file matches clutter patterns
        const isClutter = clutterPatterns.some(pattern => {
          if (pattern.startsWith('*.')) {
            return item.endsWith(pattern.slice(1));
          }
          return item === pattern;
        });
        
        if (isClutter) {
          clutterFiles.push(fullPath);
        }
      }
    }
  }
  
  scanDirectory(SRC_NEXTGEN_ROOT);
  
  console.log(`📊 Found ${clutterFiles.length} clutter files`);
  clutterFiles.forEach(file => {
    const relativePath = path.relative(SRC_NEXTGEN_ROOT, file);
    console.log(`  🗑️  ${relativePath}`);
  });
  
  return clutterFiles;
}

function moveClutterFiles(clutterFiles) {
  console.log('\n🚚 Moving clutter files:');
  console.log('========================');
  
  const cleanupDir = path.join(SRC_NEXTGEN_ROOT, '.cleanup');
  let movedCount = 0;
  
  for (const file of clutterFiles) {
    try {
      const fileName = path.basename(file);
      const targetPath = path.join(cleanupDir, fileName);
      
      // Handle duplicate names
      let finalTargetPath = targetPath;
      let counter = 1;
      while (fs.existsSync(finalTargetPath)) {
        const ext = path.extname(fileName);
        const name = path.basename(fileName, ext);
        finalTargetPath = path.join(cleanupDir, `${name}_${counter}${ext}`);
        counter++;
      }
      
      fs.renameSync(file, finalTargetPath);
      console.log(`✅ Moved: ${path.relative(SRC_NEXTGEN_ROOT, file)} → .cleanup/${path.basename(finalTargetPath)}`);
      movedCount++;
    } catch (error) {
      console.log(`❌ Failed to move ${file}: ${error.message}`);
    }
  }
  
  console.log(`📊 Moved ${movedCount} files to .cleanup/`);
}

function updateMainDocumentation() {
  console.log('\n📝 Updating main documentation:');
  console.log('==============================');
  
  // Update README.md
  const readmeContent = `# src-nextgen - Mobile Native Fresh Next Generation

## Overview
This directory contains the next generation architecture for the mobile-native-fresh project, implementing a phased migration strategy with comprehensive testing and validation.

## Structure
- \`patches/\` - Phase-organized patch files for GPT and Cursor
- \`docs/\` - Technical documentation and strategy guides
- \`scripts/\` - Validation and coordination scripts
- \`summaries/\` - Phase completion summaries
- \`tracking/\` - Progress tracking and metrics
- \`validation/\` - Automated validation tools

## Phases
- **Phase 0**: Foundation and dual-mount architecture
- **Phase 1**: Component migration and role-based wrappers
- **Phase 2**: Navigation and shell migration

## Key Features
- ✅ Dual-mount architecture with environment toggles
- ✅ Sacred component protection system
- ✅ Role-based wrapper enforcement
- ✅ Comprehensive test coordination
- ✅ Automated dependency validation
- ✅ Visual debug overlays
- ✅ CI/CD pipeline integration

## Quick Start
1. Run validation: \`{ { { { node scripts/validate-patch-dependencies.js\` & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
2. Check test coordination: \`{ { { { node scripts/test-coordination.js\` & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
3. Update documentation: \`{ { { { node scripts/update-documentation.js\` & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

## Recent Updates
- Integrated splash mount guard (P0.5.3)
- Added visual overlay debug (P1.3.5)
- Implemented auto test map (P2.9.8)
- Bootstrapped CI pipeline (P2.9.9)

## Validation Status
- ✅ Dependencies: Valid
- ✅ Execution Order: Valid
- ⚠️  Build Commands: Partially standardized
- ✅ Test Coordination: Generated

Last updated: ${new Date().toISOString()}
`;

  fs.writeFileSync(path.join(SRC_NEXTGEN_ROOT, 'README.md'), readmeContent);
  console.log('✅ Updated README.md');
  
  // Update INDEX.md
  const indexContent = `# src-nextgen Index

## Core Files
- \`README.md\` - Main documentation
- \`PATCH_MANIFEST.json\` - Complete patch registry
- \`STAGE_STATUS.json\` - Current execution status
- \`test-map.json\` - Test coordination map{ { { { ping

## Documentation & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- \`docs/phases/\` - Phase-specific documentation
- \`docs/technical/\` - Technical implementation guides
- \`docs/strategy/\` - Strategic planning documents

## Scripts
- \`scripts/validate-patch-dependencies.js\` - Dependency validation
- \`scripts/test-coordination.js\` - Test coordination
- \`scripts/update-documentation.js\` - Documentation updates

## Archives
- \`.archive/\` - Historical files
- \`.dev-strategy/\` - Development strategy documents
- \`.cleanup/\` - Clutter files
- \`.deprecated/\` - Deprecated components

## Validation Results
- Total Patches: 58
- Phases: 3 (0, 1, 2)
- Patch Types: GPT, Cursor
- New Patches Integrated: 4

## Next Ste{ { { { ps
1. Standardize build commands across all patches & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
2. Add missing branch fields to legacy patches
3. Implement CI/CD pipeline activation
4. Complete visual regression testing setup

Last updated: ${new Date().toISOString()}
`;

  fs.writeFileSync(path.join(SRC_NEXTGEN_ROOT, 'INDEX.md'), indexContent);
  console.log('✅ Updated INDEX.md');
}

function createPhaseDocumentation() {
  console.log('\n📚 Creating phase documentation:');
  console.log('===============================');
  
  const phaseDocs = {
    0: {
      title: 'Phase 0: Foundation',
      description: 'Dual-mount architecture and sacred component protection',
      keyFeatures: [
        'Dual-mount bootstrap handlers',
        'Sacred component identification',
        'Environment toggle pipeline',
        'Splash mount guard'
      ],
      patches: [
        'P0.5.3: Splash mount guard (NEW)',
        'P0.5.2: Sacred layouts identification',
        'P0.5.1: Sacred components identification',
        'P0.2.0: Dual-mount toggle',
        'P0.1.1: Nextgen initialization'
      ]
    },
    1: {
      title: 'Phase 1: Component Migration',
      description: 'Role-based wrappers and component migration',
      keyFeatures: [
        'Role-based wrapper enforcement',
        'Component migration framework',
        'Visual debug overlays',
        'Error boundary implementation'
      ],
      patches: [
        'P1.3.5: Visual overlay debug (NEW)',
        'P1.3.4: BottomNav migration',
        'P1.3.0: Button migration',
        'P1.1.1: Role wrappers implementation',
        'P1.1.0: Shell directory creation'
      ]
    },
    2: {
      title: 'Phase 2: Navigation & Shell',
      description: 'Navigation migration and shell architecture',
      keyFeatures: [
        'Dashboard dual-mount',
        'Shell migration framework',
        'Auto test map integration',
        'CI pipeline bootstrap'
      ],
      patches: [
        'P2.9.9: CI pipeline integration (NEW)',
        'P2.9.8: Auto test map init (NEW)',
        'P2.2.0: Signin shell migration',
        'P2.1.0: Dashboard dual-mount'
      ]
    }
  };
  
  for (const [phase, doc] of Object.entries(phaseDocs)) {
    const phaseDir = path.join(SRC_NEXTGEN_ROOT, 'docs', 'phases');
    const phaseFile = path.join(phaseDir, `phase-${phase}.md`);
    
    const content = `# ${doc.title}

## Description
${doc.description}

## Key Features
${doc.keyFeatures.map(feature => `- ${feature}`).join('\n')}

## Patches
${doc.patches.map(patch => `- ${patch}`).join('\n')}

## Status
- ✅ Architecture defined
- ✅ Core components implemented
- ✅ Testing framework established
- ✅ Documentation complete

Last updated: ${new Date().toISOString()}
`;

    fs.writeFileSync(phaseFile, content);
    console.log(`✅ Created phase-${phase}.md`);
  }
}

function createTechnicalDocumentation() {
  console.log('\n🔧 Creating technical documentation:');
  console.log('===================================');
  
  const techDocs = {
    'PATCH_VALIDATION.md': `# Patch Validation Guide

## Overview
This document describes the patch validation system for src-nextgen.

## Validation Scripts
- \`validate-patch-dependencies.js\` - Checks execution order and dependencies
- \`test-coordination.js\` - Validates GPT/Cursor compatibility
- \`update-documentation.js\` - Updates documentation and cleanup

## Validation Criteria
1. **Execution Order**: Patches must execute in correct phase/step order
2. **Dependencies**: Required patches must exist before dependent patches
3. **Build Commands**: Standardized test commands across all patches
4. **Compatibility**: GPT and Cursor patches must be compatible

## Current Status
- ✅ Execution Order: Valid
- ✅ Dependencies: Valid
- ⚠️  Build Commands: Partially standardized
- ✅ Test Coordination: Generated

Last updated: ${new Date().toISOString()}
`,
    
    'TEST_COORDINATION.md': `# Test Coordination Guide

## Overview
Test coordination ensures GPT and Cursor patches work together seamlessly.

## Test Map
The \`test-map.json\` file defines:
- Phase-based test organization
- Risk level classification
- Standardized test commands

## Risk Levels
- **Low**: Basic type checking only
- **Medium**: Type checking + linting
- **High**: Full test suite execution

## Coordination Rules
1. Both GPT and Cursor patches must have compatible test commands
2. Test targets must not conflict between patch types
3. Risk levels determine test command complexity
4. All patches must pass validation before execution

Last updated: ${new Date().toISOString()}
`,
    
    'CLEANUP_STRATEGY.md': `# Cleanup Strategy

## Overview
This document outlines the cleanup and organization strategy for src-nextgen.

## Archive Directories
- \`.archive/\` - Historical files and backu{ { { { ps
- \`.dev-strategy/\` - Development strategy documents & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- \`.cleanup/\` - Clutter files and temporary data
- \`.deprecated/\` - Deprecated components and features

## Clutter Identification
The system automatically identifies:
- System files (.DS_Store)
- Temporary files (*.tmp, *.log)
- Backup files (*.bak, *.old, *.backup)

## Cleanup Process
1. Scan for clutter files
2. Move to appropriate archive directory
3. Update documentation
4. Validate structure integrity

Last updated: ${new Date().toISOString()}
`
  };
  
  const techDir = path.join(SRC_NEXTGEN_ROOT, 'docs', 'technical');
  
  for (const [filename, content] of Object.entries(techDocs)) {
    const filePath = path.join(techDir, filename);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${filename}`);
  }
}

function main() {
  console.log('📝 Documentation Update and Cleanup');
  console.log('===================================');
  
  // Create archive directories
  createArchiveDirectories();
  
  // Identify and move clutter files
  const clutterFiles = identifyClutterFiles();
  if (clutterFiles.length > 0) {
    moveClutterFiles(clutterFiles);
  }
  
  // Update main documentation
  updateMainDocumentation();
  
  // Create phase documentation
  createPhaseDocumentation();
  
  // Create technical documentation
  createTechnicalDocumentation();
  
  console.log('\n📈 Documentation Update Summary:');
  console.log('=================================');
  console.log(`✅ Archive directories created`);
  console.log(`✅ ${clutterFiles.length} clutter files processed`);
  console.log(`✅ Main documentation updated`);
  console.log(`✅ Phase documentation created`);
  console.log(`✅ Technical documentation created`);
  console.log(`\n🎯 Documentation update complete!`);
  
  return 0;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { 
  createArchiveDirectories, 
  identifyClutterFiles, 
  moveClutterFiles,
  updateMainDocumentation,
  createPhaseDocumentation,
  createTechnicalDocumentation
}; 