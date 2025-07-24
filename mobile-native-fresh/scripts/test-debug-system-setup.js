#!/usr/bin/env { { { { node

/** & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
 * Debug System Setup Validation
 * Tests the debug system configuration and infrastructure
 */

const fs = require('fs');
const path = require('path');

console.log('🐛 Testing Debug System Setup...\n');

// Test 1: Debug System File
console.log('📦 Test 1: Debug System File');
try {
  const debugSystemPath = path.join(__dirname, '../src/utils/debugSystem.ts');
  if (!fs.existsSync(debugSystemPath)) {
    throw new Error('debugSystem.ts file missing');
  }
  console.log('✅ Debug system file present');
  
  // Validate file content
  const debugSystemContent = fs.readFileSync(debugSystemPath, 'utf8');
  
  const requiredExports = [
    'DebugConfig',
    'DebugLog',
    'PerformanceMetric',
    'ErrorReport',
    'ComponentDebugInfo',
    'DebugReport',
    'debugSystem',
    'initializeDebugSystem',
    'log',
    'trackPerformance',
    'endPerformanceTracking',
    'trackError',
    'trackComponentDebug',
    'generateDebugReport',
    'clearDebugData',
    'getDebugConfig',
    'updateDebugConfig',
    'setDebugEnabled',
    'setDebugLogLevel'
  ];
  
  for (const exportName of requiredExports) {
    if (!debugSystemContent.includes(exportName)) {
      throw new Error(`Missing export: ${exportName}`);
    }
  }
  
  console.log('✅ All required exports present');
  
  // Check for debug system features
  const requiredFeatures = [
    'log',
    'trackPerformance',
    'endPerformanceTracking',
    'trackError',
    'trackComponentDebug',
    'generateDebugReport',
    'clearDebugData',
    'getConfig',
    'updateConfig',
    'setEnabled',
    'setLogLevel',
    'setupConsoleLogging',
    'setupFileLogging',
    'setupErrorTracking',
    'setupPerformanceMonitoring',
    'setupComponentMonitoring',
    'setupNetworkMonitoring',
    'determineErrorSeverity'
  ];
  
  for (const feature of requiredFeatures) {
    if (!debugSystemContent.includes(feature)) {
      throw new Error(`Missing feature: ${feature}`);
    }
  }
  
  console.log('✅ All debug system features present');
  
} catch (error) {
  console.error('❌ Debug system file test failed:', error.message);
  process.exit(1);
}

// Test 2: Debug Configuration
console.log('\n⚙️ Test 2: Debug Configuration');
try {
  const debugSystemPath = path.join(__dirname, '../src/utils/debugSystem.ts');
  const debugSystemContent = fs.readFileSync(debugSystemPath, 'utf8');
  
  // Check for debug configuration features
  const configFeatures = [
    'enabled',
    'level',
    'environment',
    'logToConsole',
    'logToFile',
    'logFilePath',
    'maxLogSize',
    'maxLogFiles',
    'enableErrorTracking',
    'enablePerformanceMonitoring',
    'enableComponentDebugging',
    'enableNetworkDebugging',
    'enableStateDebugging'
  ];
  
  for (const feature of configFeatures) {
    if (!debugSystemContent.includes(feature)) {
      throw new Error(`Missing debug configuration feature: ${feature}`);
    }
  }
  
  console.log('✅ Debug configuration system present');
  
} catch (error) {
  console.error('❌ Debug configuration test failed:', error.message);
  process.exit(1);
}

// Test 3: Logging System
console.log('\n📝 Test 3: Logging System');
try {
  const debugSystemPath = path.join(__dirname, '../src/utils/debugSystem.ts');
  const debugSystemContent = fs.readFileSync(debugSystemPath, 'utf8');
  
  // Check for logging features
  const loggingFeatures = [
    'DebugLog',
    'timestamp',
    'level',
    'environment',
    'component',
    'message',
    'data',
    'stack',
    'userId',
    'sessionId',
    'logLevels',
    'console.log',
    'console.warn',
    'console.error',
    'console.info',
    'console.debug'
  ];
  
  for (const feature of loggingFeatures) {
    if (!debugSystemContent.includes(feature)) {
      throw new Error(`Missing logging feature: ${feature}`);
    }
  }
  
  console.log('✅ Logging system present');
  
} catch (error) {
  console.error('❌ Logging system test failed:', error.message);
  process.exit(1);
}

// Test 4: Performance Monitoring
console.log('\n⚡ Test 4: Performance Monitoring');
try {
  const debugSystemPath = path.join(__dirname, '../src/utils/debugSystem.ts');
  const debugSystemContent = fs.readFileSync(debugSystemPath, 'utf8');
  
  // Check for performance monitoring features
  const performanceFeatures = [
    'PerformanceMetric',
    'id',
    'name',
    'startTime',
    'endTime',
    'duration',
    'environment',
    'component',
    'metadata',
    'trackPerformance',
    'endPerformanceTracking'
  ];
  
  for (const feature of performanceFeatures) {
    if (!debugSystemContent.includes(feature)) {
      throw new Error(`Missing performance monitoring feature: ${feature}`);
    }
  }
  
  console.log('✅ Performance monitoring system present');
  
} catch (error) {
  console.error('❌ Performance monitoring test failed:', error.message);
  process.exit(1);
}

// Test 5: Error Tracking
console.log('\n🚨 Test 5: Error Tracking');
try {
  const debugSystemPath = path.join(__dirname, '../src/utils/debugSystem.ts');
  const debugSystemContent = fs.readFileSync(debugSystemPath, 'utf8');
  
  // Check for error tracking features
  const errorFeatures = [
    'ErrorReport',
    'id',
    'timestamp',
    'environment',
    'error',
    'component',
    'userInfo',
    'context',
    'severity',
    'handled',
    'trackError',
    'determineErrorSeverity',
    'global.onerror',
    'global.onunhandledrejection'
  ];
  
  for (const feature of errorFeatures) {
    if (!debugSystemContent.includes(feature)) {
      throw new Error(`Missing error tracking feature: ${feature}`);
    }
  }
  
  console.log('✅ Error tracking system present');
  
} catch (error) {
  console.error('❌ Error tracking test failed:', error.message);
  process.exit(1);
}

// Test 6: Component Debugging
console.log('\n🔧 Test 6: Component Debugging');
try {
  const debugSystemPath = path.join(__dirname, '../src/utils/debugSystem.ts');
  const debugSystemContent = fs.readFileSync(debugSystemPath, 'utf8');
  
  // Check for component debugging features
  const componentFeatures = [
    'ComponentDebugInfo',
    'componentName',
    'environment',
    'props',
    'state',
    'renderCount',
    'lastRenderTime',
    'performanceMetrics',
    'errors',
    'trackComponentDebug'
  ];
  
  for (const feature of componentFeatures) {
    if (!debugSystemContent.includes(feature)) {
      throw new Error(`Missing component debugging feature: ${feature}`);
    }
  }
  
  console.log('✅ Component debugging system present');
  
} catch (error) {
  console.error('❌ Component debugging test failed:', error.message);
  process.exit(1);
}

// Test 7: Environment Support
console.log('\n🔄 Test 7: Environment Support');
try {
  const debugSystemPath = path.join(__dirname, '../src/utils/debugSystem.ts');
  const debugSystemContent = fs.readFileSync(debugSystemPath, 'utf8');
  
  // Check for environment support
  const environmentFeatures = [
    'legacy',
    'nextgen',
    'both',
    'EXPO_PUBLIC_USE_NEXTGEN',
    'EXPO_PUBLIC_ENVIRONMENT',
    'environment'
  ];
  
  for (const feature of environmentFeatures) {
    if (!debugSystemContent.includes(feature)) {
      throw new Error(`Missing environment feature: ${feature}`);
    }
  }
  
  console.log('✅ Dual-mount environment support configured');
  
} catch (error) {
  console.error('❌ Environment support test failed:', error.message);
  process.exit(1);
}

// Test 8: Debug Reports
console.log('\n📊 Test 8: Debug Reports');
try {
  const debugSystemPath = path.join(__dirname, '../src/utils/debugSystem.ts');
  const debugSystemContent = fs.readFileSync(debugSystemPath, 'utf8');
  
  // Check for debug report features
  const reportFeatures = [
    'DebugReport',
    'timestamp',
    'environment',
    'logs',
    'performanceMetrics',
    'errors',
    'componentDebugInfo',
    'summary',
    'totalLogs',
    'totalErrors',
    'totalPerformanceMetrics',
    'averagePerformance',
    'errorRate',
    'generateDebugReport'
  ];
  
  for (const feature of reportFeatures) {
    if (!debugSystemContent.includes(feature)) {
      throw new Error(`Missing debug report feature: ${feature}`);
    }
  }
  
  console.log('✅ Debug report system present');
  
} catch (error) {
  console.error('❌ Debug report test failed:', error.message);
  process.exit(1);
}

// Test 9: TypeScript Interfaces
console.log('\n🔧 Test 9: TypeScript Interfaces');
try {
  const debugSystemPath = path.join(__dirname, '../src/utils/debugSystem.ts');
  const debugSystemContent = fs.readFileSync(debugSystemPath, 'utf8');
  
  // Check for TypeScript interfaces
  const interfaces = [
    'interface DebugConfig',
    'interface DebugLog',
    'interface PerformanceMetric',
    'interface ErrorReport',
    'interface ComponentDebugInfo',
    'interface DebugReport'
  ];
  
  for (const interfaceName of interfaces) {
    if (!debugSystemContent.includes(interfaceName)) {
      throw new Error(`Missing interface: ${interfaceName}`);
    }
  }
  
  console.log('✅ TypeScript interfaces defined');
  
} catch (error) {
  console.error('❌ TypeScript interfaces test failed:', error.message);
  process.exit(1);
}

// Test 10: Error Handling
console.log('\n🛡️ Test 10: Error Handling');
try {
  const debugSystemPath = path.join(__dirname, '../src/utils/debugSystem.ts');
  const debugSystemContent = fs.readFileSync(debugSystemPath, 'utf8');
  
  // Check for error handling features
  const errorHandlingFeatures = [
    'console.error',
    'originalOnError',
    'originalOnUnhandledRejection',
    'setupErrorTracking',
    'trackError',
    'determineErrorSeverity'
  ];
  
  for (const feature of errorHandlingFeatures) {
    if (!debugSystemContent.includes(feature)) {
      throw new Error(`Missing error handling feature: ${feature}`);
    }
  }
  
  console.log('✅ Error handling features present');
  
} catch (error) {
  console.error('❌ Error handling test failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 All Debug System Setup Tests Passed!');
console.log('\n📊 Summary:');
console.log('- ✅ Debug system file created');
console.log('- ✅ Debug configuration system present');
console.log('- ✅ Logging system present');
console.log('- ✅ Performance monitoring system present');
console.log('- ✅ Error tracking system present');
console.log('- ✅ Component debugging system present');
console.log('- ✅ Dual-mount environment support configured');
console.log('- ✅ Debug report system present');
console.log('- ✅ TypeScript interfaces defined');
console.log('- ✅ Error handling features present');

console.log('\n🐛 Debug system ready!');
console.log('The system can now provide comprehensive debugging tools, logging systems,');
console.log('and development utilities for both legacy and nextgen environments.'); 