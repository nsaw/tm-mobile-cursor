#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎭 Validating Role Assignment...');

// Check if role assignment system files exist
const roleAssignmentFiles = [
  'src-nextgen/shell/wrappers/AutoRoleView.tsx',
  'src-nextgen/components/Button.tsx'
];

let allFilesExist = true;

roleAssignmentFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check if AutoRoleView has comprehensive role support
const autoRoleViewPath = path.join(process.cwd(), 'src-nextgen/shell/wrappers/AutoRoleView.tsx');
if (fs.existsSync(autoRoleViewPath)) {
  const content = fs.readFileSync(autoRoleViewPath, 'utf8');
  
  // Check for interactive roles
  const interactiveRoles = [
    'button-action',
    'button-navigation', 
    'button-toggle',
    'input-text',
    'input-select',
    'link-external',
    'link-internal'
  ];
  
  interactiveRoles.forEach(role => {
    if (content.includes(role)) {
      console.log(`✅ AutoRoleView supports interactive role '${role}'`);
    } else {
      console.log(`❌ AutoRoleView missing interactive role '${role}'`);
      allFilesExist = false;
    }
  });
  
  // Check for content roles
  const contentRoles = [
    'text-display',
    'text-label',
    'text-caption',
    'text-heading',
    'image-display',
    'image-icon',
    'list-item',
    'list-header'
  ];
  
  contentRoles.forEach(role => {
    if (content.includes(role)) {
      console.log(`✅ AutoRoleView supports content role '${role}'`);
    } else {
      console.log(`❌ AutoRoleView missing content role '${role}'`);
      allFilesExist = false;
    }
  });
  
  // Check for layout roles
  const layoutRoles = [
    'container-main',
    'container-section',
    'container-card',
    'container-modal',
    'spacer',
    'divider'
  ];
  
  layoutRoles.forEach(role => {
    if (content.includes(role)) {
      console.log(`✅ AutoRoleView supports layout role '${role}'`);
    } else {
      console.log(`❌ AutoRoleView missing layout role '${role}'`);
      allFilesExist = false;
    }
  });
  
  // Check for role-based styling
  if (content.includes('getRoleStyles')) {
    console.log('✅ AutoRoleView has role-based styling');
  } else {
    console.log('❌ AutoRoleView missing role-based styling');
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

// Check if Button component uses role assignment correctly
const buttonPath = path.join(process.cwd(), 'src-nextgen/components/Button.tsx');
if (fs.existsSync(buttonPath)) {
  const content = fs.readFileSync(buttonPath, 'utf8');
  
  // Check for correct role assignment
  if (content.includes('interactiveRole="button-action"')) {
    console.log('✅ Button component uses correct interactive role');
  } else {
    console.log('❌ Button component missing correct interactive role');
    allFilesExist = false;
  }
  
  // Check for AutoRoleView wrapper
  if (content.includes('<AutoRoleView') && content.includes('</AutoRoleView>')) {
    console.log('✅ Button component is wrapped with AutoRoleView');
  } else {
    console.log('❌ Button component not wrapped with AutoRoleView');
    allFilesExist = false;
  }
  
  // Check for accessibility props
  const accessibilityProps = [
    'accessibilityLabel',
    'accessibilityRole',
    'accessibilityState'
  ];
  
  accessibilityProps.forEach(prop => {
    if (content.includes(prop)) {
      console.log(`✅ Button component has '${prop}' accessibility prop`);
    } else {
      console.log(`❌ Button component missing '${prop}' accessibility prop`);
      allFilesExist = false;
    }
  });
}

// Check if role assignment system is properly structured
const wrappersPath = path.join(process.cwd(), 'src-nextgen/shell/wrappers');
if (fs.existsSync(wrappersPath)) {
  const files = fs.readdirSync(wrappersPath);
  
  if (files.includes('AutoRoleView.tsx')) {
    console.log('✅ AutoRoleView is in correct wrappers directory');
  } else {
    console.log('❌ AutoRoleView not in wrappers directory');
    allFilesExist = false;
  }
}

// Check if components directory has proper structure
const componentsPath = path.join(process.cwd(), 'src-nextgen/components');
if (fs.existsSync(componentsPath)) {
  const files = fs.readdirSync(componentsPath);
  
  if (files.includes('Button.tsx')) {
    console.log('✅ Button component is in correct components directory');
  } else {
    console.log('❌ Button component not in components directory');
    allFilesExist = false;
  }
}

if (allFilesExist) {
  console.log('✅ Role Assignment validation PASSED');
  process.exit(0);
} else {
  console.log('❌ Role Assignment validation FAILED');
  process.exit(1);
} 