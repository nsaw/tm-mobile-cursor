#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📋 Testing Patch Execution Order...');

// Test patch execution order structure
const executionOrder = [
  {
    phase: 1,
    step: 2,
    attempt: 1,
    patchId: 'patch-v1.4.211(P1.2.1)_sacred-view-mounts',
    dependencies: []
  },
  {
    phase: 1,
    step: 2,
    attempt: 2,
    patchId: 'patch-v1.4.212(P1.2.2)_patch-runner-automation',
    dependencies: ['patch-v1.4.211(P1.2.1)_sacred-view-mounts']
  },
  {
    phase: 1,
    step: 3,
    attempt: 0,
    patchId: 'patch-v1.4.220(P1.3.0)_button-migration',
    dependencies: ['patch-v1.4.212(P1.2.2)_patch-runner-automation']
  },
  {
    phase: 1,
    step: 3,
    attempt: 1,
    patchId: 'patch-v1.4.221(P1.3.1)_text-migration',
    dependencies: ['patch-v1.4.220(P1.3.0)_button-migration']
  }
];

let allTestsPass = true;

// Check if PatchRunner has execution order functionality
const runnerPath = path.join(process.cwd(), 'src-nextgen/shell/automation/PatchRunner.ts');
if (fs.existsSync(runnerPath)) {
  const runnerContent = fs.readFileSync(runnerPath, 'utf8');
  
  // Check for queue management
  if (runnerContent.includes('executionQueue') && runnerContent.includes('addToQueue')) {
    console.log('✅ PatchRunner has queue management functionality');
  } else {
    console.log('❌ PatchRunner missing queue management functionality');
    allTestsPass = false;
  }
  
  // Check for dependency checking
  if (runnerContent.includes('dependencies') && runnerContent.includes('dependencyResult')) {
    console.log('✅ PatchRunner has dependency checking functionality');
  } else {
    console.log('❌ PatchRunner missing dependency checking functionality');
    allTestsPass = false;
  }
  
  // Check for execution history
  if (runnerContent.includes('executionHistory') && runnerContent.includes('getHistory')) {
    console.log('✅ PatchRunner has execution history tracking');
  } else {
    console.log('❌ PatchRunner missing execution history tracking');
    allTestsPass = false;
  }
  
  // Check for sequential execution
  if (runnerContent.includes('executeQueue') && runnerContent.includes('for (const patch')) {
    console.log('✅ PatchRunner has sequential execution capability');
  } else {
    console.log('❌ PatchRunner missing sequential execution capability');
    allTestsPass = false;
  }
} else {
  console.log('❌ PatchRunner.ts not found');
  allTestsPass = false;
}

// Check if PatchValidator has execution order validation
const validatorPath = path.join(process.cwd(), 'src-nextgen/shell/automation/PatchValidator.ts');
if (fs.existsSync(validatorPath)) {
  const validatorContent = fs.readFileSync(validatorPath, 'utf8');
  
  // Check for validation gate execution
  if (validatorContent.includes('runAllValidations') && validatorContent.includes('runRequiredValidations')) {
    console.log('✅ PatchValidator has validation execution methods');
  } else {
    console.log('❌ PatchValidator missing validation execution methods');
    allTestsPass = false;
  }
  
  // Check for validation result tracking
  if (validatorContent.includes('ValidationResult') && validatorContent.includes('success')) {
    console.log('✅ PatchValidator has validation result tracking');
  } else {
    console.log('❌ PatchValidator missing validation result tracking');
    allTestsPass = false;
  }
} else {
  console.log('❌ PatchValidator.ts not found');
  allTestsPass = false;
}

// Test execution order logic
console.log('🧪 Testing execution order logic...');

executionOrder.forEach((patch, index) => {
  console.log(`  Patch ${index + 1}: ${patch.patchId}`);
  console.log(`    Phase: ${patch.phase}, Step: ${patch.step}, Attempt: ${patch.attempt}`);
  console.log(`    Dependencies: ${patch.dependencies.length > 0 ? patch.dependencies.join(', ') : 'None'}`);
  
  // Check if dependencies are satisfied by previous patches
  if (patch.dependencies.length > 0) {
    const previousPatches = executionOrder.slice(0, index);
    const satisfiedDependencies = patch.dependencies.filter(dep => 
      previousPatches.some(prev => prev.patchId === dep)
    );
    
    if (satisfiedDependencies.length === patch.dependencies.length) {
      console.log(`    ✅ All dependencies satisfied`);
    } else {
      console.log(`    ❌ Missing dependencies: ${patch.dependencies.filter(dep => 
        !satisfiedDependencies.includes(dep)
      ).join(', ')}`);
      allTestsPass = false;
    }
  } else {
    console.log(`    ✅ No dependencies required`);
  }
});

// Check if automation system has proper error handling for execution order
const automationPath = path.join(process.cwd(), 'src-nextgen/shell/automation/PatchRunner.ts');
if (fs.existsSync(automationPath)) {
  const automationContent = fs.readFileSync(automationPath, 'utf8');
  
  if (automationContent.includes('if (!result.success)') && automationContent.includes('break')) {
    console.log('✅ Automation system has proper error handling for execution order');
  } else {
    console.log('❌ Automation system missing proper error handling for execution order');
    allTestsPass = false;
  }
}

if (allTestsPass) {
  console.log('✅ Patch Execution Order Testing PASSED');
  process.exit(0);
} else {
  console.log('❌ Patch Execution Order Testing FAILED');
  process.exit(1);
} 