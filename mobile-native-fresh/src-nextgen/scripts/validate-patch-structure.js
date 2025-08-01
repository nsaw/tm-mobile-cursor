#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Patch Structure Validation and Phase 0 Logic Pass
 * Validates patch organization, analyzes structure, and runs Phase 0 logic
 */

const SRC_NEXTGEN_ROOT = path.join(__dirname, '..');
const PATCHES_ROOT = path.join(SRC_NEXTGEN_ROOT, 'patches');

// Expected Phase 0 patches from manifest
const EXPECTED_PHASE_0_PATCHES = [
  'patch-v1.4.100(P0.1.0)_legacy-backup.json',
  'patch-v1.4.101(P0.1.1)_nextgen-init.json',
  'patch-v1.4.110(P0.2.0)_dual-mount-toggle.json',
  'patch-v1.4.111(P0.2.1)_env-flags-setup.json',
  'patch-v1.4.112(P0.2.2)_ci-parallel-setup.json',
  'patch-v1.4.120(P0.3.0)_perf-benchmark-setup.json',
  'patch-v1.4.121(P0.3.1)_visual-regression-baseline.json',
  'patch-v1.4.122(P0.3.2)_accessibility-audit.json',
  'patch-v1.4.130(P0.4.0)_role-analysis-framework.json',
  'patch-v1.4.131(P0.4.1)_testing-framework-setup.json',
  'patch-v1.4.132(P0.4.2)_rollback-strategy-validation.json',
  'patch-v1.4.140(P0.5.0)_debug-system-config.json',
  'patch-v1.4.141(P0.5.1)_sacred-components-identification.json',
  'patch-v1.4.142(P0.5.2)_sacred-layouts-identification.json',
  'patch-v1.4.143(P0.5.3)_splash-mount-guard.json'
];

// Expected Phase 1 patches from manifest
const EXPECTED_PHASE_1_PATCHES = [
  'patch-v1.4.200(P1.1.0)_shell-directory-create.json',
  'patch-v1.4.201(P1.1.1)_role-wrappers-implementation.json',
  'patch-v1.4.202(P1.1.2)_layout-contracts-definition.json',
  'patch-v1.4.210(P1.2.0)_navigation-definitions-setup.json',
  'patch-v1.4.211(P1.2.1)_sacred-view-mounts.json',
  'patch-v1.4.212(P1.2.2)_patch-runner-automation.json',
  'patch-v1.4.220(P1.3.0)_button-migration.json',
  'patch-v1.4.221(P1.3.1)_text-migration.json',
  'patch-v1.4.222(P1.3.2)_tagchip-migration.json',
  'patch-v1.4.223(P1.3.3)_header-migration.json',
  'patch-v1.4.224(P1.3.4)_bottomnav-migration.json',
  'patch-v1.4.225(P1.3.5)_visual-overlay-debug.json'
];

// Expected Phase 2 patches from manifest
const EXPECTED_PHASE_2_PATCHES = [
  'patch-v1.4.300(P2.1.0)_dashboard-dual-mount.json',
  'patch-v1.4.301(P2.1.1)_home-screen-dual-mount.json',
  'patch-v1.4.302(P2.1.2)_search-screen-dual-mount.json',
  'patch-v1.4.303(P2.1.3)_profile-screen-dual-mount.json',
  'patch-v1.4.310(P2.2.0)_signin-shell-migration.json',
  'patch-v1.4.311(P2.2.1)_signup-shell-migration.json',
  'patch-v1.4.312(P2.2.2)_password-reset-shell-migration.json',
  'patch-v1.4.320(P2.3.0)_settings-screen-shell-migration.json',
  'patch-v1.4.321(P2.3.1)_profile-edit-shell-migration.json',
  'patch-v1.4.322(P2.3.2)_notifications-shell-migration.json',
  'patch-v1.4.330(P2.4.0)_error-boundary-implementation.json',
  'patch-v1.4.331(P2.4.1)_form-validation-system.json',
  'patch-v1.4.998(P2.9.8)_auto-test-map-init.json',
  'patch-v1.4.999(P2.9.9)_ci-pipeline-integration.json'
];

function analyzePatchStructure() {
  console.log('\n🔍 **PATCH STRUCTURE ANALYSIS**');
  console.log('================================');
  
  const analysis = {
    phase0: { expected: EXPECTED_PHASE_0_PATCHES.length, found: 0, missing: [], extra: [] },
    phase1: { expected: EXPECTED_PHASE_1_PATCHES.length, found: 0, missing: [], extra: [] },
    phase2: { expected: EXPECTED_PHASE_2_PATCHES.length, found: 0, missing: [], extra: [] },
    archive: { files: 0, directories: 0 },
    devStrategy: { files: 0, directories: 0 },
    organization: { status: 'unknown' }
  };
  
  // Analyze Phase 0
  const phase0Dir = path.join(PATCHES_ROOT, 'phase-0');
  if (fs.existsSync(phase0Dir)) {
    const phase0Files = fs.readdirSync(phase0Dir).filter(f => f.endsWith('.json'));
    analysis.phase0.found = phase0Files.length;
    
    for (const expected of EXPECTED_PHASE_0_PATCHES) {
      if (!phase0Files.includes(expected)) {
        analysis.phase0.missing.push(expected);
      }
    }
    
    for (const found of phase0Files) {
      if (!EXPECTED_PHASE_0_PATCHES.includes(found)) {
        analysis.phase0.extra.push(found);
      }
    }
  }
  
  // Analyze Phase 1
  const phase1Dir = path.join(PATCHES_ROOT, 'phase-1');
  if (fs.existsSync(phase1Dir)) {
    const phase1Files = fs.readdirSync(phase1Dir).filter(f => f.endsWith('.json'));
    analysis.phase1.found = phase1Files.length;
    
    for (const expected of EXPECTED_PHASE_1_PATCHES) {
      if (!phase1Files.includes(expected)) {
        analysis.phase1.missing.push(expected);
      }
    }
    
    for (const found of phase1Files) {
      if (!EXPECTED_PHASE_1_PATCHES.includes(found)) {
        analysis.phase1.extra.push(found);
      }
    }
  }
  
  // Analyze Phase 2
  const phase2Dir = path.join(PATCHES_ROOT, 'phase-2');
  if (fs.existsSync(phase2Dir)) {
    const phase2Files = fs.readdirSync(phase2Dir).filter(f => f.endsWith('.json'));
    analysis.phase2.found = phase2Files.length;
    
    for (const expected of EXPECTED_PHASE_2_PATCHES) {
      if (!phase2Files.includes(expected)) {
        analysis.phase2.missing.push(expected);
      }
    }
    
    for (const found of phase2Files) {
      if (!EXPECTED_PHASE_2_PATCHES.includes(found)) {
        analysis.phase2.extra.push(found);
      }
    }
  }
  
  // Analyze Archive Structure
  const archiveDir = path.join(PATCHES_ROOT, '.archive');
  if (fs.existsSync(archiveDir)) {
    const archiveItems = fs.readdirSync(archiveDir);
    analysis.archive.directories = archiveItems.filter(item => 
      fs.statSync(path.join(archiveDir, item)).isDirectory()
    ).length;
    analysis.archive.files = archiveItems.filter(item => 
      fs.statSync(path.join(archiveDir, item)).isFile()
    ).length;
  }
  
  // Analyze Dev Strategy Structure
  const devStrategyDir = path.join(PATCHES_ROOT, '.dev-strategy');
  if (fs.existsSync(devStrategyDir)) {
    const devStrategyItems = fs.readdirSync(devStrategyDir);
    analysis.devStrategy.directories = devStrategyItems.filter(item => 
      fs.statSync(path.join(devStrategyDir, item)).isDirectory()
    ).length;
    analysis.devStrategy.files = devStrategyItems.filter(item => 
      fs.statSync(path.join(devStrategyDir, item)).isFile()
    ).length;
  }
  
  return analysis;
}

function validatePhase0Logic() {
  console.log('\n🧠 **PHASE 0 LOGIC PASS**');
  console.log('==========================');
  
  const logicResults = {
    step0_1: { status: 'pending', validation: [] },
    step0_2: { status: 'pending', validation: [] },
    step0_3: { status: 'pending', validation: [] },
    step0_4: { status: 'pending', validation: [] },
    step0_5: { status: 'pending', validation: [] },
    overall: { status: 'pending', issues: [] }
  };
  
  // Step 0.1: Legacy Backup & Reference Setup
  const step0_1_patches = [
    'patch-v1.4.100(P0.1.0)_legacy-backup.json',
    'patch-v1.4.101(P0.1.1)_nextgen-init.json'
  ];
  
  for (const patch of step0_1_patches) {
    const patchPath = path.join(PATCHES_ROOT, 'phase-0', patch);
    if (fs.existsSync(patchPath)) {
      logicResults.step0_1.validation.push(`✅ ${patch} exists`);
    } else {
      logicResults.step0_1.validation.push(`❌ ${patch} missing`);
      logicResults.overall.issues.push(`Missing ${patch}`);
    }
  }
  
  // Step 0.2: Dual-Mount Configuration
  const step0_2_patches = [
    'patch-v1.4.110(P0.2.0)_dual-mount-toggle.json',
    'patch-v1.4.111(P0.2.1)_env-flags-setup.json',
    'patch-v1.4.112(P0.2.2)_ci-parallel-setup.json'
  ];
  
  for (const patch of step0_2_patches) {
    const patchPath = path.join(PATCHES_ROOT, 'phase-0', patch);
    if (fs.existsSync(patchPath)) {
      logicResults.step0_2.validation.push(`✅ ${patch} exists`);
    } else {
      logicResults.step0_2.validation.push(`❌ ${patch} missing`);
      logicResults.overall.issues.push(`Missing ${patch}`);
    }
  }
  
  // Step 0.3: Performance & Validation Setup
  const step0_3_patches = [
    'patch-v1.4.120(P0.3.0)_perf-benchmark-setup.json',
    'patch-v1.4.121(P0.3.1)_visual-regression-baseline.json',
    'patch-v1.4.122(P0.3.2)_accessibility-audit.json'
  ];
  
  for (const patch of step0_3_patches) {
    const patchPath = path.join(PATCHES_ROOT, 'phase-0', patch);
    if (fs.existsSync(patchPath)) {
      logicResults.step0_3.validation.push(`✅ ${patch} exists`);
    } else {
      logicResults.step0_3.validation.push(`❌ ${patch} missing`);
      logicResults.overall.issues.push(`Missing ${patch}`);
    }
  }
  
  // Step 0.4: Framework & Documentation Setup
  const step0_4_patches = [
    'patch-v1.4.130(P0.4.0)_role-analysis-framework.json',
    'patch-v1.4.131(P0.4.1)_testing-framework-setup.json',
    'patch-v1.4.132(P0.4.2)_rollback-strategy-validation.json'
  ];
  
  for (const patch of step0_4_patches) {
    const patchPath = path.join(PATCHES_ROOT, 'phase-0', patch);
    if (fs.existsSync(patchPath)) {
      logicResults.step0_4.validation.push(`✅ ${patch} exists`);
    } else {
      logicResults.step0_4.validation.push(`❌ ${patch} missing`);
      logicResults.overall.issues.push(`Missing ${patch}`);
    }
  }
  
  // Step 0.5: Debug & Sacred Component Setup
  const step0_5_patches = [
    'patch-v1.4.140(P0.5.0)_debug-system-config.json',
    'patch-v1.4.141(P0.5.1)_sacred-components-identification.json',
    'patch-v1.4.142(P0.5.2)_sacred-layouts-identification.json',
    'patch-v1.4.143(P0.5.3)_splash-mount-guard.json'
  ];
  
  for (const patch of step0_5_patches) {
    const patchPath = path.join(PATCHES_ROOT, 'phase-0', patch);
    if (fs.existsSync(patchPath)) {
      logicResults.step0_5.validation.push(`✅ ${patch} exists`);
    } else {
      logicResults.step0_5.validation.push(`❌ ${patch} missing`);
      logicResults.overall.issues.push(`Missing ${patch}`);
    }
  }
  
  // Determine overall status
  if (logicResults.overall.issues.length === 0) {
    logicResults.overall.status = 'ready';
    logicResults.step0_1.status = 'ready';
    logicResults.step0_2.status = 'ready';
    logicResults.step0_3.status = 'ready';
    logicResults.step0_4.status = 'ready';
    logicResults.step0_5.status = 'ready';
  } else {
    logicResults.overall.status = 'issues';
  }
  
  return logicResults;
}

function validatePatchContent() {
  console.log('\n📋 **PATCH CONTENT VALIDATION**');
  console.log('================================');
  
  const validationResults = {
    phase0: { valid: 0, invalid: 0, issues: [] },
    phase1: { valid: 0, invalid: 0, issues: [] },
    phase2: { valid: 0, invalid: 0, issues: [] }
  };
  
  // Validate Phase 0 patches
  const phase0Dir = path.join(PATCHES_ROOT, 'phase-0');
  if (fs.existsSync(phase0Dir)) {
    const phase0Files = fs.readdirSync(phase0Dir).filter(f => f.endsWith('.json'));
    
    for (const file of phase0Files) {
      try {
        const patchPath = path.join(phase0Dir, file);
        const patchContent = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
        
        // Validate actual patch format
        if (patchContent.phases && Array.isArray(patchContent.phases)) {
          validationResults.phase0.valid++;
        } else if (patchContent.notes && Array.isArray(patchContent.notes)) {
          // Alternative format for newer patches
          validationResults.phase0.valid++;
        } else {
          validationResults.phase0.invalid++;
          validationResults.phase0.issues.push(`${file}: Invalid patch format`);
        }
      } catch (error) {
        validationResults.phase0.invalid++;
        validationResults.phase0.issues.push(`${file}: JSON parse error`);
      }
    }
  }
  
  // Validate Phase 1 patches
  const phase1Dir = path.join(PATCHES_ROOT, 'phase-1');
  if (fs.existsSync(phase1Dir)) {
    const phase1Files = fs.readdirSync(phase1Dir).filter(f => f.endsWith('.json'));
    
    for (const file of phase1Files) {
      try {
        const patchPath = path.join(phase1Dir, file);
        const patchContent = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
        
        // Validate actual patch format
        if (patchContent.phases && Array.isArray(patchContent.phases)) {
          validationResults.phase1.valid++;
        } else if (patchContent.notes && Array.isArray(patchContent.notes)) {
          // Alternative format for newer patches
          validationResults.phase1.valid++;
        } else {
          validationResults.phase1.invalid++;
          validationResults.phase1.issues.push(`${file}: Invalid patch format`);
        }
      } catch (error) {
        validationResults.phase1.invalid++;
        validationResults.phase1.issues.push(`${file}: JSON parse error`);
      }
    }
  }
  
  // Validate Phase 2 patches
  const phase2Dir = path.join(PATCHES_ROOT, 'phase-2');
  if (fs.existsSync(phase2Dir)) {
    const phase2Files = fs.readdirSync(phase2Dir).filter(f => f.endsWith('.json'));
    
    for (const file of phase2Files) {
      try {
        const patchPath = path.join(phase2Dir, file);
        const patchContent = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
        
        // Validate actual patch format
        if (patchContent.phases && Array.isArray(patchContent.phases)) {
          validationResults.phase2.valid++;
        } else if (patchContent.notes && Array.isArray(patchContent.notes)) {
          // Alternative format for newer patches
          validationResults.phase2.valid++;
        } else {
          validationResults.phase2.invalid++;
          validationResults.phase2.issues.push(`${file}: Invalid patch format`);
        }
      } catch (error) {
        validationResults.phase2.invalid++;
        validationResults.phase2.issues.push(`${file}: JSON parse error`);
      }
    }
  }
  
  return validationResults;
}

function generateReport(analysis, logicResults, validationResults) {
  console.log('\n📊 **COMPREHENSIVE ANALYSIS REPORT**');
  console.log('=====================================');
  
  // Structure Analysis
  console.log('\n🗂️  **STRUCTURE ANALYSIS**');
  console.log('Phase 0:');
  console.log(`  Expected: ${analysis.phase0.expected}, Found: ${analysis.phase0.found}`);
  if (analysis.phase0.missing.length > 0) {
    console.log(`  Missing: ${analysis.phase0.missing.join(', ')}`);
  }
  if (analysis.phase0.extra.length > 0) {
    console.log(`  Extra: ${analysis.phase0.extra.join(', ')}`);
  }
  
  console.log('\nPhase 1:');
  console.log(`  Expected: ${analysis.phase1.expected}, Found: ${analysis.phase1.found}`);
  if (analysis.phase1.missing.length > 0) {
    console.log(`  Missing: ${analysis.phase1.missing.join(', ')}`);
  }
  if (analysis.phase1.extra.length > 0) {
    console.log(`  Extra: ${analysis.phase1.extra.join(', ')}`);
  }
  
  console.log('\nPhase 2:');
  console.log(`  Expected: ${analysis.phase2.expected}, Found: ${analysis.phase2.found}`);
  if (analysis.phase2.missing.length > 0) {
    console.log(`  Missing: ${analysis.phase2.missing.join(', ')}`);
  }
  if (analysis.phase2.extra.length > 0) {
    console.log(`  Extra: ${analysis.phase2.extra.join(', ')}`);
  }
  
  console.log('\nArchive Structure:');
  console.log(`  Directories: ${analysis.archive.directories}, Files: ${analysis.archive.files}`);
  
  console.log('\nDev Strategy Structure:');
  console.log(`  Directories: ${analysis.devStrategy.directories}, Files: ${analysis.devStrategy.files}`);
  
  // Phase 0 Logic Results
  console.log('\n🧠 **PHASE 0 LOGIC RESULTS**');
  console.log(`Overall Status: ${logicResults.overall.status.toUpperCase()}`);
  
  if (logicResults.overall.issues.length > 0) {
    console.log('Issues Found:');
    logicResults.overall.issues.forEach(issue => console.log(`  ❌ ${issue}`));
  } else {
    console.log('✅ All Phase 0 patches present and ready');
  }
  
  // Content Validation Results
  console.log('\n📋 **CONTENT VALIDATION RESULTS**');
  console.log(`Phase 0: ${validationResults.phase0.valid} valid, ${validationResults.phase0.invalid} invalid`);
  console.log(`Phase 1: ${validationResults.phase1.valid} valid, ${validationResults.phase1.invalid} invalid`);
  console.log(`Phase 2: ${validationResults.phase2.valid} valid, ${validationResults.phase2.invalid} invalid`);
  
  if (validationResults.phase0.issues.length > 0) {
    console.log('Phase 0 Issues:');
    validationResults.phase0.issues.forEach(issue => console.log(`  ❌ ${issue}`));
  }
  
  if (validationResults.phase1.issues.length > 0) {
    console.log('Phase 1 Issues:');
    validationResults.phase1.issues.forEach(issue => console.log(`  ❌ ${issue}`));
  }
  
  if (validationResults.phase2.issues.length > 0) {
    console.log('Phase 2 Issues:');
    validationResults.phase2.issues.forEach(issue => console.log(`  ❌ ${issue}`));
  }
  
  // Recommendations
  console.log('\n💡 **RECOMMENDATIONS**');
  
  if (logicResults.overall.status === 'ready') {
    console.log('✅ Phase 0 is ready for implementation');
    console.log('✅ All required patches are present');
    console.log('✅ Structure is well-organized');
  } else {
    console.log('⚠️  Phase 0 needs attention before implementation');
    console.log('⚠️  Missing patches need to be created');
    console.log('⚠️  Structure issues need to be resolved');
  }
  
  if (validationResults.phase0.invalid > 0) {
    console.log('⚠️  Some patches have content issues that need fixing');
  }
  
  console.log('\n🎯 **NEXT STEPS**');
  if (logicResults.overall.status === 'ready') {
    console.log('1. ✅ Proceed with Phase 0 implementation');
    console.log('2. ✅ Begin with Step 0.1: Legacy Backup & Reference Setup');
    console.log('3. ✅ Execute patches in order: P0.1.0 → P0.1.1 → P0.2.0 → ...');
  } else {
    console.log('1. ❌ Fix missing patches before proceeding');
    console.log('2. ❌ Resolve structure issues');
    console.log('3. ❌ Validate patch content');
  }
}

function main() {
  console.log('🔍 **PATCH STRUCTURE VALIDATION & PHASE 0 LOGIC PASS**');
  console.log('=======================================================');
  
  // Analyze patch structure
  const analysis = analyzePatchStructure();
  
  // Validate Phase 0 logic
  const logicResults = validatePhase0Logic();
  
  // Validate patch content
  const validationResults = validatePatchContent();
  
  // Generate comprehensive report
  generateReport(analysis, logicResults, validationResults);
  
  return {
    analysis,
    logicResults,
    validationResults,
    ready: logicResults.overall.status === 'ready'
  };
}

if (require.main === module) {
  const results = main();
  process.exit(results.ready ? 0 : 1);
}

module.exports = { 
  analyzePatchStructure,
  validatePhase0Logic,
  validatePatchContent,
  generateReport
}; 