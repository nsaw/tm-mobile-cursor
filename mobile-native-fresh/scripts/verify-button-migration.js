#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔘 Verifying Button Migration...');

// Check if button migration files exist
const buttonMigrationFiles = [
  'src-nextgen/components/Button.tsx',
  'src-nextgen/shell/wrappers/AutoRoleView.tsx'
];

let allFilesExist = true;

buttonMigrationFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check if components directory structure is correct
const componentsDirs = [
  'src-nextgen/components',
  'src-nextgen/shell/wrappers'
];

componentsDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir} directory exists`);
  } else {
    console.log(`❌ ${dir} directory missing`);
    allFilesExist = false;
  }
});

// Check if Button component has required functionality
const buttonPath = path.join(process.cwd(), 'src-nextgen/components/Button.tsx');
if (fs.existsSync(buttonPath)) {
  const content = fs.readFileSync(buttonPath, 'utf8');
  
  // Check for required props
  const requiredProps = ['title', 'onPress', 'variant', 'size', 'disabled', 'loading'];
  requiredProps.forEach(prop => {
    if (content.includes(prop)) {
      console.log(`✅ Button component has '${prop}' prop`);
    } else {
      console.log(`❌ Button component missing '${prop}' prop`);
      allFilesExist = false;
    }
  });
  
  // Check for role assignment
  if (content.includes('interactiveRole="button-action"')) {
    console.log('✅ Button component has correct role assignment');
  } else {
    console.log('❌ Button component missing role assignment');
    allFilesExist = false;
  }
  
  // Check for AutoRoleView import
  if (content.includes('AutoRoleView')) {
    console.log('✅ Button component imports AutoRoleView');
  } else {
    console.log('❌ Button component missing AutoRoleView import');
    allFilesExist = false;
  }
  
  // Check for accessibility props
  if (content.includes('accessibilityLabel') && content.includes('accessibilityRole')) {
    console.log('✅ Button component has accessibility props');
  } else {
    console.log('❌ Button component missing accessibility props');
    allFilesExist = false;
  }
}

// Check if AutoRoleView has required functionality
const autoRoleViewPath = path.join(process.cwd(), 'src-nextgen/shell/wrappers/AutoRoleView.tsx');
if (fs.existsSync(autoRoleViewPath)) {
  const content = fs.readFileSync(autoRoleViewPath, 'utf8');
  
  // Check for role types
  const roleTypes = ['InteractiveRole', 'ContentRole', 'LayoutRole'];
  roleTypes.forEach(type => {
    if (content.includes(type)) {
      console.log(`✅ AutoRoleView has '${type}' type`);
    } else {
      console.log(`❌ AutoRoleView missing '${type}' type`);
      allFilesExist = false;
    }
  });
  
  // Check for button-action role
  if (content.includes('button-action')) {
    console.log('✅ AutoRoleView supports button-action role');
  } else {
    console.log('❌ AutoRoleView missing button-action role');
    allFilesExist = false;
  }
  
  // Check for accessibility props generation
  if (content.includes('getAccessibilityProps')) {
    console.log('✅ AutoRoleView has accessibility props generation');
  } else {
    console.log('❌ AutoRoleView missing accessibility props generation');
    allFilesExist = false;
  }
}

if (allFilesExist) {
  console.log('✅ Button Migration verification PASSED');
  process.exit(0);
} else {
  console.log('❌ Button Migration verification FAILED');
  process.exit(1);
} 