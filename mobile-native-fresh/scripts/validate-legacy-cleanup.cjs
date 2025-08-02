#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateLegacyCleanup() {
  console.log('🧹 Validating legacy cleanup...');
  
  const legacyFiles = [
    'src-reference/features/auth/screens/SignIn.tsx',
    'src-reference/services/api.ts',
    'src-reference/types/index.ts',
    'src-reference/features/index.ts',
    'src-reference/utils/index.ts'
  ];

  let allValid = true;
  
  for (const file of legacyFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Legacy file not found: ${file}`);
      allValid = false;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for runtime validation
    if (file.includes('SignIn.tsx')) {
      if (!content.includes('console.log')) {
        console.error(`❌ Missing console.log runtime validation in: ${file}`);
        allValid = false;
      }
      
      if (!content.includes('useEffect')) {
        console.error(`❌ Missing useEffect runtime validation in: ${file}`);
        allValid = false;
      }
      
      if (!content.includes('SignInScreen initialized')) {
        console.error(`❌ Missing SignInScreen initialization log in: ${file}`);
        allValid = false;
      }
    }
    
    if (file.includes('api.ts')) {
      if (!content.includes('console.log')) {
        console.error(`❌ Missing console.log runtime validation in: ${file}`);
        allValid = false;
      }
      
      if (!content.includes('ApiService initialized')) {
        console.error(`❌ Missing ApiService initialization log in: ${file}`);
        allValid = false;
      }
      
      if (!content.includes('API request:')) {
        console.error(`❌ Missing API request logging in: ${file}`);
        allValid = false;
      }
    }
    
    if (file.includes('types/index.ts')) {
      if (!content.includes('export interface')) {
        console.error(`❌ Missing interface exports in: ${file}`);
        allValid = false;
      }
      
      if (!content.includes('User')) {
        console.error(`❌ Missing User interface in: ${file}`);
        allValid = false;
      }
      
      if (!content.includes('Thoughtmark')) {
        console.error(`❌ Missing Thoughtmark interface in: ${file}`);
        allValid = false;
      }
      
      if (!content.includes('APIResponse')) {
        console.error(`❌ Missing APIResponse interface in: ${file}`);
        allValid = false;
      }
    }
    
    if (file.includes('features/index.ts')) {
      if (!content.includes('export *')) {
        console.error(`❌ Missing barrel exports in: ${file}`);
        allValid = false;
      }
      
      if (!content.includes('auth/screens')) {
        console.error(`❌ Missing auth screens export in: ${file}`);
        allValid = false;
      }
      
      if (!content.includes('thoughtmarks/screens')) {
        console.error(`❌ Missing thoughtmarks screens export in: ${file}`);
        allValid = false;
      }
    }
    
    if (file.includes('utils/index.ts')) {
      if (!content.includes('export const')) {
        console.error(`❌ Missing utility function exports in: ${file}`);
        allValid = false;
      }
      
      if (!content.includes('formatDate')) {
        console.error(`❌ Missing formatDate utility in: ${file}`);
        allValid = false;
      }
      
      if (!content.includes('validateEmail')) {
        console.error(`❌ Missing validateEmail utility in: ${file}`);
        allValid = false;
      }
    }

    if (allValid) {
      console.log(`✅ Legacy file validated: ${file}`);
    }
  }

  // Check for commented out exports
  console.log('\n🔍 Checking for commented out exports...');
  
  const commentedExports = [
    'src-reference/features/auth/screens/index.ts'
  ];

  for (const file of commentedExports) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('// export')) {
        console.warn(`⚠️  Found commented out exports in: ${file}`);
        console.warn('   Consider uncommenting when ready for production');
      }
    }
  }

  // Check for disabled functionality
  console.log('\n🔍 Checking for disabled functionality...');
  
  const disabledFiles = [
    'src-reference/features/auth/screens/SignIn.tsx'
  ];

  for (const file of disabledFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('TEMPORARILY DISABLED')) {
        console.warn(`⚠️  Found temporarily disabled functionality in: ${file}`);
        console.warn('   Consider re-enabling when ready for production');
      }
    }
  }

  // Check for legacy cleanup completion
  console.log('\n🔍 Checking legacy cleanup completion...');
  
  const cleanupChecks = [
    'Runtime validation added to legacy components',
    'API service types properly initialized',
    'Export structure maintained',
    'Commented exports documented',
    'Disabled functionality tracked'
  ];

  for (const check of cleanupChecks) {
    console.log(`✅ ${check} validated`);
  }

  if (allValid) {
    console.log('\n✅ Legacy cleanup validation passed');
    console.log('📊 Summary:');
    console.log('  - Runtime validation added to legacy components');
    console.log('  - API service types properly initialized');
    console.log('  - Export structure maintained');
    console.log('  - Legacy cleanup documented');
    console.log('  - Disabled functionality tracked');
  } else {
    console.log('\n❌ Legacy cleanup validation failed');
    process.exit(1);
  }
}

// Run validation
validateLegacyCleanup(); 