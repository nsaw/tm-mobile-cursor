#!/usr/bin/env node

/**
 * Navigation Definitions Validation Script
 * 
 * Verifies that the navigation definitions system was implemented correctly
 * and all required components and utilities are available.
 */

const fs = require('fs');
const path = require('path');

const NAVIGATION_DIR = path.join(__dirname, '..', 'src-nextgen', 'shell', 'navigation');
const REQUIRED_FILES = [
  'index.ts',
  'types.ts',
  'NavigationDefinitions.tsx',
  'RoutingSystem.tsx',
  'ScreenTransitions.tsx',
  'utils.ts',
  'validation.ts'
];

function validateNavigationDefinitions() {
  console.log('🔍 Validating navigation definitions implementation...');
  
  // Check if navigation directory exists
  if (!fs.existsSync(NAVIGATION_DIR)) {
    console.error('❌ Navigation directory does not exist:', NAVIGATION_DIR);
    process.exit(1);
  }
  
  console.log('✅ Navigation directory exists');
  
  // Check required files
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(NAVIGATION_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Required file missing: ${file}`);
      process.exit(1);
    }
    console.log(`✅ File exists: ${file}`);
  }
  
  // Validate index.ts content
  const indexPath = path.join(NAVIGATION_DIR, 'index.ts');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  const requiredExports = [
    'NavigationDefinitions',
    'RoutingSystem',
    'ScreenTransitions',
    'types',
    'utils',
    'validation'
  ];
  
  for (const exportName of requiredExports) {
    if (!indexContent.includes(`export * from './${exportName}'`)) {
      console.error(`❌ Missing export in index.ts: ${exportName}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Index.ts exports validated');
  
  // Validate types.ts content
  const typesPath = path.join(NAVIGATION_DIR, 'types.ts');
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  
  const requiredTypes = [
    'NavigationRoute',
    'NavigationEnvironment',
    'NavigationRouteDefinition',
    'NavigationRouteOptions',
    'NavigationParams',
    'NavigationState',
    'NavigationTransition',
    'NavigationDefinitionsProps',
    'RoutingSystemProps',
    'ScreenTransitionsProps',
    'NavigationValidationResult'
  ];
  
  for (const typeName of requiredTypes) {
    if (!typesContent.includes(`export type ${typeName}`) && 
        !typesContent.includes(`export interface ${typeName}`)) {
      console.error(`❌ Missing type definition: ${typeName}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Types.ts definitions validated');
  
  // Validate NavigationDefinitions.tsx content
  const navigationDefinitionsPath = path.join(NAVIGATION_DIR, 'NavigationDefinitions.tsx');
  const navigationDefinitionsContent = fs.readFileSync(navigationDefinitionsPath, 'utf8');
  
  const requiredNavigationDefinitionsFeatures = [
    'NavigationDefinitions',
    'routes',
    'environment',
    'children',
    'validateNavigationDefinitions',
    'registerNavigationRoute'
  ];
  
  for (const feature of requiredNavigationDefinitionsFeatures) {
    if (!navigationDefinitionsContent.includes(feature)) {
      console.error(`❌ Missing feature in NavigationDefinitions.tsx: ${feature}`);
      process.exit(1);
    }
  }
  
  console.log('✅ NavigationDefinitions.tsx implementation validated');
  
  // Validate RoutingSystem.tsx content
  const routingSystemPath = path.join(NAVIGATION_DIR, 'RoutingSystem.tsx');
  const routingSystemContent = fs.readFileSync(routingSystemPath, 'utf8');
  
  const requiredRoutingSystemFeatures = [
    'RoutingSystem',
    'state',
    'onNavigate',
    'children',
    'validateRoutingSystem',
    'updateNavigationState'
  ];
  
  for (const feature of requiredRoutingSystemFeatures) {
    if (!routingSystemContent.includes(feature)) {
      console.error(`❌ Missing feature in RoutingSystem.tsx: ${feature}`);
      process.exit(1);
    }
  }
  
  console.log('✅ RoutingSystem.tsx implementation validated');
  
  // Validate ScreenTransitions.tsx content
  const screenTransitionsPath = path.join(NAVIGATION_DIR, 'ScreenTransitions.tsx');
  const screenTransitionsContent = fs.readFileSync(screenTransitionsPath, 'utf8');
  
  const requiredScreenTransitionsFeatures = [
    'ScreenTransitions',
    'transition',
    'children',
    'validateScreenTransition'
  ];
  
  for (const feature of requiredScreenTransitionsFeatures) {
    if (!screenTransitionsContent.includes(feature)) {
      console.error(`❌ Missing feature in ScreenTransitions.tsx: ${feature}`);
      process.exit(1);
    }
  }
  
  console.log('✅ ScreenTransitions.tsx implementation validated');
  
  // Validate utils.ts content
  const utilsPath = path.join(NAVIGATION_DIR, 'utils.ts');
  const utilsContent = fs.readFileSync(utilsPath, 'utf8');
  
  const requiredUtils = [
    'registerNavigationRoute',
    'getNavigationRoute',
    'updateNavigationState',
    'getNavigationState',
    'validateNavigationDefinitions',
    'validateRoutingSystem',
    'validateScreenTransition',
    'getNavigationStatistics'
  ];
  
  for (const util of requiredUtils) {
    if (!utilsContent.includes(`export const ${util}`)) {
      console.error(`❌ Missing utility function: ${util}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Utils.ts functions validated');
  
  // Validate validation.ts content
  const validationPath = path.join(NAVIGATION_DIR, 'validation.ts');
  const validationContent = fs.readFileSync(validationPath, 'utf8');
  
  const requiredValidation = [
    'validateNavigationRouteDefinition',
    'validateNavigationState',
    'validateNavigationTransition',
    'validateNavigationConsistency',
    'getNavigationRouteSuggestions',
    'validateNavigationHierarchy'
  ];
  
  for (const validation of requiredValidation) {
    if (!validationContent.includes(`export const ${validation}`)) {
      console.error(`❌ Missing validation function: ${validation}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Validation.ts functions validated');
  
  console.log('🎉 Navigation definitions implementation validation PASSED');
  process.exit(0);
}

validateNavigationDefinitions(); 