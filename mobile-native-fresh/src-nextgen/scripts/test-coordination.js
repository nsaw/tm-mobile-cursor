#!/usr/bin/env { { { { node

const fs = require('fs') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
const path = require('path');

/**
 * Test Coordination Script
 * Validates GPT and Cursor patch compatibility and test coordination
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

function validateTestCompatibility(patches) {
  console.log('\n🧪 Test Coordination Validation:');
  console.log('================================');
  
  const testMap = {};
  
  // Group patches by phase and step
  for (const patch of patches) {
    const key = `P${patch.phase}.${patch.step}`;
    if (!testMap[key]) {
      testMap[key] = { gpt: [], cursor: [] };
    }
    testMap[key][patch.type].push(patch);
  }
  
  let allCompatible = true;
  
  for (const [phaseStep, patchGroups] of Object.entries(testMap)) {
    const gptPatches = patchGroups.gpt;
    const cursorPatches = patchGroups.cursor;
    
    if (gptPatches.length > 0 && cursorPatches.length > 0) {
      console.log(`\n🔄 ${phaseStep} - GPT/Cursor Coordination:`);
      
      // Check if both have compatible test commands
      const gptTestCommands = gptPatches.flatMap(p => {
        const data = loadPatch(p.fullPath);
        return data?.postMutationBuild || [];
      });
      
      const cursorTestCommands = cursorPatches.flatMap(p => {
        const data = loadPatch(p.fullPath);
        return data?.postMutationBuild || [];
      });
      
      const hasGptTests = gptTestCommands.some(cmd => cmd.includes('test'));
      const hasCursorTests = cursorTestCommands.some(cmd => cmd.includes('test'));
      
      if (hasGptTests && hasCursorTests) {
        console.log(`  ✅ Both GPT and Cursor have test commands`);
      } else if (hasGptTests || hasCursorTests) {
        console.log(`  ⚠️  Only ${hasGptTests ? 'GPT' : 'Cursor'} has test commands`);
      } else {
        console.log(`  ❌ Neither GPT nor Cursor have test commands`);
        allCompatible = false;
      }
      
      // Check for conflicting test targets
      const gptTargets = gptPatches.map(p => p.filename);
      const cursorTargets = cursorPatches.map(p => p.filename);
      
      console.log(`  📋 GPT patches: ${gptTargets.join(', ')}`);
      console.log(`  📋 Cursor patches: ${cursorTargets.join(', ')}`);
    }
  }
  
  return allCompatible;
}

function generateTestMap(patches) {
  console.log('\n🗺️  Generating Test Map:');
  console.log('========================');
  
  const testMap = {
    phases: {},
    riskLevels: {
      low: ['P0.1.0', 'P0.1.1', 'P0.2.0'],
      medium: ['P0.5.0', 'P0.5.1', 'P0.5.2', 'P1.1.0', 'P1.1.1'],
      high: ['P1.3.0', 'P1.3.4', 'P1.3.5', 'P2.1.0', 'P2.2.0']
    },
    testCommands: {
      low: ['tsc --noEmit'],
      medium: ['tsc --noEmit', 'eslint . --max-warnings=0'],
      high: ['tsc --noEmit', 'eslint . --max-warnings=0', 'yarn test:unit --watchAll=false']
    }
  };
  
  // Group by phase
  for (const patch of patches) {
    if (!testMap.phases[patch.phase]) {
      testMap.phases[patch.phase] = [];
    }
    testMap.phases[patch.phase].push({
      filename: patch.filename,
      phase: patch.phase,
      step: patch.step,
      type: patch.type
    });
  }
  
  // Write test map
  const testMapPath = path.join(__dirname, '..', 'test-map.json');
  fs.writeFileSync(testMapPath, JSON.stringify(testMap, null, 2));
  
  console.log(`✅ Test map written to: ${testMapPath}`);
  console.log(`📊 Phases: ${Object.keys(testMap.phases).length}`);
  console.log(`🎯 Risk levels: ${Object.keys(testMap.riskLevels).length}`);
  
  return testMap;
}

function validatePatchCompatibility(patches) {
  console.log('\n🔗 Patch Compatibility Check:');
  console.log('=============================');
  
  const compatibilityIssues = [];
  
  for (const patch of patches) {
    const patchData = loadPatch(patch.fullPath);
    if (!patchData) continue;
    
    // Check for required fields
    const requiredFields = ['notes', 'phases', 'branch'];
    const missingFields = requiredFields.filter(field => !patchData[field]);
    
    if (missingFields.length > 0) {
      compatibilityIssues.push({
        patch: patch.filename,
        issue: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check for valid phase structure
    if (patchData.phases && !Array.isArray(patchData.phases)) {
      compatibilityIssues.push({
        patch: patch.filename,
        issue: 'Phases should be an array'
      });
    }
  }
  
  if (compatibilityIssues.length > 0) {
    console.log('❌ Compatibility issues found:');
    compatibilityIssues.forEach(issue => {
      console.log(`  - ${issue.patch}: ${issue.issue}`);
    });
    return false;
  } else {
    console.log('✅ All patches are compatible');
    return true;
  }
}

function main() {
  console.log('🧪 Test Coordination Validator');
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
  
  // Validate test compatibility
  const testCompatible = validateTestCompatibility(patches);
  
  // Generate test map
  const testMap = generateTestMap(patches);
  
  // Validate patch compatibility
  const patchCompatible = validatePatchCompatibility(patches);
  
  console.log('\n📈 Test Coordination Summary:');
  console.log('=============================');
  console.log(`✅ Test Compatibility: ${testCompatible ? 'Valid' : 'Invalid'}`);
  console.log(`✅ Patch Compatibility: ${patchCompatible ? 'Valid' : 'Invalid'}`);
  console.log(`✅ Test Map Generated: ${testMap ? 'Yes' : 'No'}`);
  
  const overallValid = testCompatible && patchCompatible;
  console.log(`\n🎯 Overall Status: ${overallValid ? '✅ PASS' : '❌ FAIL'}`);
  
  return overallValid ? 0 : 1;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { validateTestCompatibility, generateTestMap, validatePatchCompatibility }; 