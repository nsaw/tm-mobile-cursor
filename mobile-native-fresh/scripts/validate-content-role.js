#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📄 Validating Content Role...');

// Check if content role system files exist
const contentRoleFiles = [
  'src-nextgen/shell/wrappers/AutoRoleView.tsx',
  'src-nextgen/components/Text.tsx'
];

let allFilesExist = true;

contentRoleFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check if AutoRoleView has content role support
const autoRoleViewPath = path.join(process.cwd(), 'src-nextgen/shell/wrappers/AutoRoleView.tsx');
if (fs.existsSync(autoRoleViewPath)) {
  const content = fs.readFileSync(autoRoleViewPath, 'utf8');
  
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
  
  // Check for content role prop
  if (content.includes('contentRole?: ContentRole')) {
    console.log('✅ AutoRoleView has contentRole prop');
  } else {
    console.log('❌ AutoRoleView missing contentRole prop');
    allFilesExist = false;
  }
  
  // Check for content role handling
  if (content.includes('contentRole') && content.includes('primaryRole')) {
    console.log('✅ AutoRoleView has content role handling');
  } else {
    console.log('❌ AutoRoleView missing content role handling');
    allFilesExist = false;
  }
} else {
  console.log('❌ AutoRoleView.tsx not found');
  allFilesExist = false;
}

// Check if Text component uses content role correctly
const textPath = path.join(process.cwd(), 'src-nextgen/components/Text.tsx');
if (fs.existsSync(textPath)) {
  const content = fs.readFileSync(textPath, 'utf8');
  
  // Check for content role assignment
  if (content.includes('contentRole=')) {
    console.log('✅ Text component uses content role assignment');
  } else {
    console.log('❌ Text component missing content role assignment');
    allFilesExist = false;
  }
  
  // Check for getContentRole function
  if (content.includes('getContentRole')) {
    console.log('✅ Text component has getContentRole function');
  } else {
    console.log('❌ Text component missing getContentRole function');
    allFilesExist = false;
  }
  
  // Check for role mapping logic
  const roleMappings = [
    'text-heading',
    'text-label', 
    'text-caption',
    'text-display'
  ];
  
  roleMappings.forEach(role => {
    if (content.includes(role)) {
      console.log(`✅ Text component maps to '${role}' content role`);
    } else {
      console.log(`❌ Text component missing '${role}' content role mapping`);
      allFilesExist = false;
    }
  });
  
  // Check for AutoRoleView wrapper
  if (content.includes('<AutoRoleView') && content.includes('</AutoRoleView>')) {
    console.log('✅ Text component is wrapped with AutoRoleView');
  } else {
    console.log('❌ Text component not wrapped with AutoRoleView');
    allFilesExist = false;
  }
  
  // Check for accessibility props
  if (content.includes('accessibilityRole="text"')) {
    console.log('✅ Text component has accessibility props');
  } else {
    console.log('❌ Text component missing accessibility props');
    allFilesExist = false;
  }
} else {
  console.log('❌ Text.tsx not found');
  allFilesExist = false;
}

// Check if content role system is properly structured
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
  
  if (files.includes('Text.tsx')) {
    console.log('✅ Text component is in correct components directory');
  } else {
    console.log('❌ Text component not in components directory');
    allFilesExist = false;
  }
}

if (allFilesExist) {
  console.log('✅ Content Role validation PASSED');
  process.exit(0);
} else {
  console.log('❌ Content Role validation FAILED');
  process.exit(1);
} 