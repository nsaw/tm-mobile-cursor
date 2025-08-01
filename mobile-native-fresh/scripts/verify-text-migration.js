#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📝 Verifying Text Migration...');

// Check if text migration files exist
const textMigrationFiles = [
  'src-nextgen/components/Text.tsx'
];

let allFilesExist = true;

textMigrationFiles.forEach(file => {
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
  'src-nextgen/components'
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

// Check if Text component has required functionality
const textPath = path.join(process.cwd(), 'src-nextgen/components/Text.tsx');
if (fs.existsSync(textPath)) {
  const content = fs.readFileSync(textPath, 'utf8');
  
  // Check for required props
  const requiredProps = ['variant', 'size', 'weight', 'color', 'align'];
  requiredProps.forEach(prop => {
    if (content.includes(prop)) {
      console.log(`✅ Text component has '${prop}' prop`);
    } else {
      console.log(`❌ Text component missing '${prop}' prop`);
      allFilesExist = false;
    }
  });
  
  // Check for role assignment
  if (content.includes('contentRole=')) {
    console.log('✅ Text component has content role assignment');
  } else {
    console.log('❌ Text component missing content role assignment');
    allFilesExist = false;
  }
  
  // Check for AutoRoleView import
  if (content.includes('AutoRoleView')) {
    console.log('✅ Text component imports AutoRoleView');
  } else {
    console.log('❌ Text component missing AutoRoleView import');
    allFilesExist = false;
  }
  
  // Check for accessibility props
  if (content.includes('accessibilityRole="text"')) {
    console.log('✅ Text component has accessibility props');
  } else {
    console.log('❌ Text component missing accessibility props');
    allFilesExist = false;
  }
  
  // Check for variant support
  const variants = ['display', 'heading', 'body', 'caption', 'label'];
  variants.forEach(variant => {
    if (content.includes(variant)) {
      console.log(`✅ Text component supports '${variant}' variant`);
    } else {
      console.log(`❌ Text component missing '${variant}' variant`);
      allFilesExist = false;
    }
  });
  
  // Check for size support
  const sizes = ['small', 'medium', 'large', 'xl'];
  sizes.forEach(size => {
    if (content.includes(size)) {
      console.log(`✅ Text component supports '${size}' size`);
    } else {
      console.log(`❌ Text component missing '${size}' size`);
      allFilesExist = false;
    }
  });
  
  // Check for weight support
  const weights = ['normal', 'medium', 'semibold', 'bold'];
  weights.forEach(weight => {
    if (content.includes(weight)) {
      console.log(`✅ Text component supports '${weight}' weight`);
    } else {
      console.log(`❌ Text component missing '${weight}' weight`);
      allFilesExist = false;
    }
  });
  
  // Check for color support
  const colors = ['primary', 'secondary', 'tertiary', 'accent', 'error', 'success'];
  colors.forEach(color => {
    if (content.includes(color)) {
      console.log(`✅ Text component supports '${color}' color`);
    } else {
      console.log(`❌ Text component missing '${color}' color`);
      allFilesExist = false;
    }
  });
  
  // Check for alignment support
  const alignments = ['left', 'center', 'right', 'justify'];
  alignments.forEach(align => {
    if (content.includes(align)) {
      console.log(`✅ Text component supports '${align}' alignment`);
    } else {
      console.log(`❌ Text component missing '${align}' alignment`);
      allFilesExist = false;
    }
  });
}

if (allFilesExist) {
  console.log('✅ Text Migration verification PASSED');
  process.exit(0);
} else {
  console.log('❌ Text Migration verification FAILED');
  process.exit(1);
} 