#!/usr/bin/env { { { { node

const fs = require('fs') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
const path = require('path');

/**
 * Patch Dependency Validator
 * Validates execution order and dependencies across all phases
 */

const PHASE_DIRS = ['phase-0', 'phase-1', 'phase-2'];
const PATCH_TYPES = ['gpt', 'cursor'];

function loadPatch(patchPath) {
  try {
    const content = fs.readFileSync(patchPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading patch ${patchPath}:`, error.message);
    return null;
  }
}

function extractVersionInfo(filename) {
  const match = filename.match(/patch-v(\d+)\.(\d+)\.(\d+)\(P(\d+)\.(\d+)\.(\d+)\)/);
  if (!match) return null;
  
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3]),
    phase: parseInt(match[4]),
    step: parseInt(match[5]),
    attempt: parseInt(match[6]),
    filename
  };
}

function validatePatchOrder(patches) {
  const sorted = patches.sort((a, b) => {
    if (a.phase !== b.phase) return a.phase - b.phase;
    if (a.step !== b.step) return a.step - b.step;
    if (a.attempt !== b.attempt) return a.attempt - b.attempt;
    return a.patch - b.patch;
  });

  console.log('\n📋 Patch Execution Order Validation:');
  console.log('=====================================');
  
  let previousPhase = -1;
  let previousStep = -1;
  
  for (const patch of sorted) {
    if (patch.phase !== previousPhase) {
      console.log(`\n🔄 Phase ${patch.phase}:`);
      previousPhase = patch.phase;
      previousStep = -1;
    }
    
    if (patch.step !== previousStep) {
      console.log(`  Step ${patch.step}:`);
      previousStep = patch.step;
    }
    
    console.log(`    ✅ ${patch.filename}`);
  }
  
  return sorted;
}

function validateDependencies(patches) {
  console.log('\n🔗 Dependency Validation:');
  console.log('=========================');
  
  const dependencies = {
    'P0.5.3': ['P0.5.2'], // splash-mount-guard depends on sacred-layouts
    'P1.3.5': ['P1.3.4'], // visual-overlay-debug depends on bottomnav-migration
    'P2.9.8': ['P2.1.0'], // auto-test-map depends on dashboard-dual-mount
    'P2.9.9': ['P2.9.8']  // ci-pipeline depends on test-map
  };
  
  let allValid = true;
  
  for (const [dependent, requirements] of Object.entries(dependencies)) {
    const dependentPatch = patches.find(p => p.filename.includes(dependent));
    const requiredPatches = requirements.map(req => patches.find(p => p.filename.includes(req)));
    
    if (!dependentPatch) {
      console.log(`⚠️  Dependent patch ${dependent} not found`);
      allValid = false;
      continue;
    }
    
    const missingDe{ { { { ps = requiredPatches.filter(p => !p) & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
    if (missingDeps.length > 0) {
      console.log(`❌ ${dependent} missing dependencies: ${requirements.join(', ')}`);
      allValid = false;
    } else {
      console.log(`✅ ${dependent} dependencies satisfied`);
    }
  }
  
  return allValid;
}

function validateBuildCommands(patches) {
  console.log('\n🔧 Build Command Validation:');
  console.log('============================');
  
  const requiredCommands = [
    'tsc --noEmit',
    'eslint . --max-warnings=0',
    'yarn test:unit --watchAll=false'
  ];
  
  let allValid = true;
  
  for (const patch of patches) {
    const patchData = loadPatch(patch.fullPath);
    if (!patchData) continue;
    
    const buildCommands = Array.isArray(patchData.postMutationBuild) 
      ? patchData.postMutationBuild 
      : [patchData.postMutationBuild].filter(Boolean);
    
    const missingCommands = requiredCommands.filter(cmd => 
      !buildCommands.some(buildCmd => buildCmd && buildCmd.includes(cmd.split(' ')[0]))
    );
    
    if (missingCommands.length > 0) {
      console.log(`⚠️  ${patch.filename} missing: ${missingCommands.join(', ')}`);
      allValid = false;
    } else {
      console.log(`✅ ${patch.filename} build commands complete`);
    }
  }
  
  return allValid;
}

function main() {
  console.log('🔍 Patch Dependency Validator');
  console.log('==============================');
  
  const patches = [];
  
  // Load all patches
  for (const phaseDir of PHASE_DIRS) {
    for (const patchType of PATCH_TYPES) {
      const patchDir = path.join(__dirname, '..', 'patches', phaseDir, patchType);
      if (!fs.existsSync(patchDir)) continue;
      
      const files = fs.readdirSync(patchDir).filter(f => f.endsWith('.json'));
      
      for (const file of files) {
        const versionInfo = extractVersionInfo(file);
        if (versionInfo) {
          patches.push({
            ...versionInfo,
            fullPath: path.join(patchDir, file),
            type: patchType
          });
        }
      }
    }
  }
  
  console.log(`📊 Found ${patches.length} patches across ${PHASE_DIRS.length} phases`);
  
  // Validate execution order
  const sortedPatches = validatePatchOrder(patches);
  
  // Validate dependencies
  const depsValid = validateDependencies(sortedPatches);
  
  // Validate build commands
  const buildValid = validateBuildCommands(sortedPatches);
  
  console.log('\n📈 Validation Summary:');
  console.log('======================');
  console.log(`✅ Execution Order: ${sortedPatches.length > 0 ? 'Valid' : 'Invalid'}`);
  console.log(`✅ Dependencies: ${depsValid ? 'Valid' : 'Invalid'}`);
  console.log(`✅ Build Commands: ${buildValid ? 'Valid' : 'Invalid'}`);
  
  const overallValid = sortedPatches.length > 0 && depsValid && buildValid;
  console.log(`\n🎯 Overall Status: ${overallValid ? '✅ PASS' : '❌ FAIL'}`);
  
  return overallValid ? 0 : 1;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { validatePatchOrder, validateDependencies, validateBuildCommands }; 