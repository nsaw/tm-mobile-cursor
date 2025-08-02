#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateThemeSystem() {
  console.log('🎨 Validating theme system...');
  
  const themeFiles = [
    'src-nextgen/theme/ThemeSystem.ts',
    'src-nextgen/theme/ThemeProvider.tsx',
    'src-nextgen/theme/index.ts'
  ];

  let allValid = true;
  
  for (const file of themeFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Theme file not found: ${file}`);
      allValid = false;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for required exports
    if (file.includes('ThemeSystem.ts') && !content.includes('export class ThemeSystem')) {
      console.error(`❌ Missing ThemeSystem export in: ${file}`);
      allValid = false;
    }
    
    if (file.includes('ThemeProvider') && !content.includes('export function ThemeProvider')) {
      console.error(`❌ Missing ThemeProvider export in: ${file}`);
      allValid = false;
    }
    
    if (file.includes('index.ts') && !content.includes('useTheme')) {
      console.error(`❌ Missing useTheme export in: ${file}`);
      allValid = false;
    }

    console.log(`✅ Theme file validated: ${file}`);
  }

  // Check for dual-mount compatibility
  const legacyThemePath = path.join(process.cwd(), 'src/theme');
  const nextgenThemePath = path.join(process.cwd(), 'src-nextgen/theme');
  
  if (fs.existsSync(legacyThemePath) && fs.existsSync(nextgenThemePath)) {
    console.log('✅ Dual-mount theme directories detected');
  } else {
    console.log('⚠️  Single mount theme directory detected');
  }

  return allValid;
}

function main() {
  const isValid = validateThemeSystem();
  
  if (isValid) {
    console.log('✅ Theme system validation passed');
    process.exit(0);
  } else {
    console.error('❌ Theme system validation failed');
    process.exit(1);
  }
}

main(); 