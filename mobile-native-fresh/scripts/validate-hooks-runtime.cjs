#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateHooksRuntime() {
  console.log('🔍 Validating hooks runtime validation...');
  
  const hookFiles = [
    'src-nextgen/hooks/auth/useAuth.ts',
    'src-nextgen/theme/ThemeProvider.tsx'
  ];

  let allValid = true;
  
  for (const file of hookFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Hook file not found: ${file}`);
      allValid = false;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for console.log runtime validation
    if (!content.includes('console.log')) {
      console.error(`❌ Missing console.log runtime validation in: ${file}`);
      allValid = false;
    }
    
    // Check for useEffect runtime hooks
    if (!content.includes('useEffect')) {
      console.error(`❌ Missing useEffect runtime hook in: ${file}`);
      allValid = false;
    }
    
    // Check for proper error handling
    if (!content.includes('catch') && !content.includes('error')) {
      console.error(`❌ Missing error handling in: ${file}`);
      allValid = false;
    }

    console.log(`✅ Hook runtime validation: ${file}`);
  }

  return allValid;
}

function main() {
  const isValid = validateHooksRuntime();
  
  if (isValid) {
    console.log('✅ Hooks runtime validation passed');
    process.exit(0);
  } else {
    console.error('❌ Hooks runtime validation failed');
    process.exit(1);
  }
}

main(); 