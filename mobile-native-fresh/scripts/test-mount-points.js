#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Mount Points...');

// Test mount point structure
const mountPoints = [
  {
    id: 'bottom-nav',
    description: 'Bottom navigation bar',
    expectedZIndex: 1000
  },
  {
    id: 'fab',
    description: 'Floating action button',
    expectedZIndex: 1001
  },
  {
    id: 'top-bar',
    description: 'Top navigation bar',
    expectedZIndex: 999
  },
  {
    id: 'modal-overlay',
    description: 'Modal overlay',
    expectedZIndex: 1002
  }
];

let allTestsPass = true;

// Check if mount points are properly defined in registry
const registryPath = path.join(process.cwd(), 'src-nextgen/shell/mounts/SacredMountRegistry.ts');
if (fs.existsSync(registryPath)) {
  const registryContent = fs.readFileSync(registryPath, 'utf8');
  
  mountPoints.forEach(mount => {
    if (registryContent.includes(`mountId: '${mount.id}'`)) {
      console.log(`✅ Mount point '${mount.id}' is registered`);
      
      // Check if z-index is properly set
      if (registryContent.includes(`zIndex: ${mount.expectedZIndex}`)) {
        console.log(`✅ Mount point '${mount.id}' has correct z-index (${mount.expectedZIndex})`);
      } else {
        console.log(`❌ Mount point '${mount.id}' has incorrect z-index`);
        allTestsPass = false;
      }
    } else {
      console.log(`❌ Mount point '${mount.id}' is not registered`);
      allTestsPass = false;
    }
  });
} else {
  console.log('❌ SacredMountRegistry.ts not found');
  allTestsPass = false;
}

// Check if SacredViewMount component has proper z-index handling
const sacredMountPath = path.join(process.cwd(), 'src-nextgen/shell/mounts/SacredViewMount.tsx');
if (fs.existsSync(sacredMountPath)) {
  const sacredMountContent = fs.readFileSync(sacredMountPath, 'utf8');
  
  if (sacredMountContent.includes('zIndex: 1000')) {
    console.log('✅ SacredViewMount has high z-index for protection');
  } else {
    console.log('❌ SacredViewMount missing high z-index');
    allTestsPass = false;
  }
  
  if (sacredMountContent.includes('testID={`sacred-mount-${mountId}`}')) {
    console.log('✅ SacredViewMount has proper testID generation');
  } else {
    console.log('❌ SacredViewMount missing testID generation');
    allTestsPass = false;
  }
} else {
  console.log('❌ SacredViewMount.tsx not found');
  allTestsPass = false;
}

// Check if useSacredMount hook has required methods
const hookPath = path.join(process.cwd(), 'src-nextgen/shell/mounts/useSacredMount.ts');
if (fs.existsSync(hookPath)) {
  const hookContent = fs.readFileSync(hookPath, 'utf8');
  
  const requiredMethods = ['registerMount', 'isSacredMount', 'getSacredMount', 'getAllSacredMounts'];
  requiredMethods.forEach(method => {
    if (hookContent.includes(method)) {
      console.log(`✅ useSacredMount has '${method}' method`);
    } else {
      console.log(`❌ useSacredMount missing '${method}' method`);
      allTestsPass = false;
    }
  });
} else {
  console.log('❌ useSacredMount.ts not found');
  allTestsPass = false;
}

if (allTestsPass) {
  console.log('✅ Mount Points Testing PASSED');
  process.exit(0);
} else {
  console.log('❌ Mount Points Testing FAILED');
  process.exit(1);
} 