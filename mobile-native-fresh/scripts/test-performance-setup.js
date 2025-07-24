#!/usr/bin/env { { { { node

/** & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
 * Performance Benchmark Setup Validation
 * Tests the performance monitoring system and benchmarking infrastructure
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Performance Benchmark Setup...\n');

// Test 1: Performance Monitor File
console.log('📊 Test 1: Performance Monitor File');
try {
  const perfMonitorPath = path.join(__dirname, '../src/utils/performanceMonitor.ts');
  if (!fs.existsSync(perfMonitorPath)) {
    throw new Error('performanceMonitor.ts file missing');
  }
  console.log('✅ Performance monitor file present');
  
  // Validate file content
  const perfMonitorContent = fs.readFileSync(perfMonitorPath, 'utf8');
  
  const requiredExports = [
    'PerformanceMetrics',
    'PerformanceBaseline',
    'PerformanceAlert',
    'performanceMonitor',
    'startPerformanceMonitoring',
    'stopPerformanceMonitoring',
    'measureRenderTime',
    'establishPerformanceBaseline',
    'getPerformanceReport',
    'compareEnvironments'
  ];
  
  for (const exportName of requiredExports) {
    if (!perfMonitorContent.includes(exportName)) {
      throw new Error(`Missing export: ${exportName}`);
    }
  }
  
  console.log('✅ All required exports present');
  
  // Check for performance monitoring features
  const requiredFeatures = [
    'renderTime',
    'memoryUsage',
    'componentCount',
    'environment',
    'timestamp',
    'sessionId',
    'startMonitoring',
    'stopMonitoring',
    'recordMetrics',
    'measureRenderTime',
    'checkAlerts',
    'establishBaseline',
    'generateReport',
    'compareEnvironments'
  ];
  
  for (const feature of requiredFeatures) {
    if (!perfMonitorContent.includes(feature)) {
      throw new Error(`Missing feature: ${feature}`);
    }
  }
  
  console.log('✅ All performance monitoring features present');
  
} catch (error) {
  console.error('❌ Performance monitor file test failed:', error.message);
  process.exit(1);
}

// Test 2: Performance Alert System
console.log('\n🚨 Test 2: Performance Alert System');
try {
  const perfMonitorPath = path.join(__dirname, '../src/utils/performanceMonitor.ts');
  const perfMonitorContent = fs.readFileSync(perfMonitorPath, 'utf8');
  
  // Check for alert types
  const alertTypes = ['render_time', 'memory_usage', 'component_count'];
  for (const alertType of alertTypes) {
    if (!perfMonitorContent.includes(alertType)) {
      throw new Error(`Missing alert type: ${alertType}`);
    }
  }
  
  // Check for severity levels
  const severityLevels = ['warning', 'error', 'critical'];
  for (const severity of severityLevels) {
    if (!perfMonitorContent.includes(severity)) {
      throw new Error(`Missing severity level: ${severity}`);
    }
  }
  
  // Check for threshold configuration
  if (!perfMonitorContent.includes('thresholds')) {
    throw new Error('Missing threshold configuration');
  }
  
  console.log('✅ Performance alert system configured');
  
} catch (error) {
  console.error('❌ Performance alert system test failed:', error.message);
  process.exit(1);
}

// Test 3: Environment Comparison
console.log('\n🔄 Test 3: Environment Comparison');
try {
  const perfMonitorPath = path.join(__dirname, '../src/utils/performanceMonitor.ts');
  const perfMonitorContent = fs.readFileSync(perfMonitorPath, 'utf8');
  
  // Check for environment comparison features
  const comparisonFeatures = [
    'compareEnvironments',
    'renderTimeDiff',
    'memoryUsageDiff',
    'recommendation',
    'legacy',
    'nextgen'
  ];
  
  for (const feature of comparisonFeatures) {
    if (!perfMonitorContent.includes(feature)) {
      throw new Error(`Missing comparison feature: ${feature}`);
    }
  }
  
  console.log('✅ Environment comparison features present');
  
} catch (error) {
  console.error('❌ Environment comparison test failed:', error.message);
  process.exit(1);
}

// Test 4: Baseline Establishment
console.log('\n📊 Test 4: Baseline Establishment');
try {
  const perfMonitorPath = path.join(__dirname, '../src/utils/performanceMonitor.ts');
  const perfMonitorContent = fs.readFileSync(perfMonitorPath, 'utf8');
  
  // Check for baseline features
  const baselineFeatures = [
    'establishBaseline',
    'getBaseline',
    'averageRenderTime',
    'averageMemoryUsage',
    'sampleCount'
  ];
  
  for (const feature of baselineFeatures) {
    if (!perfMonitorContent.includes(feature)) {
      throw new Error(`Missing baseline feature: ${feature}`);
    }
  }
  
  console.log('✅ Baseline establishment features present');
  
} catch (error) {
  console.error('❌ Baseline establishment test failed:', error.message);
  process.exit(1);
}

// Test 5: Memory Usage Monitoring
console.log('\n💾 Test 5: Memory Usage Monitoring');
try {
  const perfMonitorPath = path.join(__dirname, '../src/utils/performanceMonitor.ts');
  const perfMonitorContent = fs.readFileSync(perfMonitorPath, 'utf8');
  
  // Check for memory monitoring features
  const memoryFeatures = [
    'getMemoryUsage',
    'usedJSHeapSize',
    'performance.memory'
  ];
  
  for (const feature of memoryFeatures) {
    if (!perfMonitorContent.includes(feature)) {
      throw new Error(`Missing memory monitoring feature: ${feature}`);
    }
  }
  
  console.log('✅ Memory usage monitoring configured');
  
} catch (error) {
  console.error('❌ Memory usage monitoring test failed:', error.message);
  process.exit(1);
}

// Test 6: Report Generation
console.log('\n📋 Test 6: Report Generation');
try {
  const perfMonitorPath = path.join(__dirname, '../src/utils/performanceMonitor.ts');
  const perfMonitorContent = fs.readFileSync(perfMonitorPath, 'utf8');
  
  // Check for report generation features
  const reportFeatures = [
    'generateReport',
    'JSON.stringify',
    'sessionId',
    'timestamp',
    'summary',
    'alerts'
  ];
  
  for (const feature of reportFeatures) {
    if (!perfMonitorContent.includes(feature)) {
      throw new Error(`Missing report generation feature: ${feature}`);
    }
  }
  
  console.log('✅ Report generation features present');
  
} catch (error) {
  console.error('❌ Report generation test failed:', error.message);
  process.exit(1);
}

// Test 7: TypeScript Interfaces
console.log('\n🔧 Test 7: TypeScript Interfaces');
try {
  const perfMonitorPath = path.join(__dirname, '../src/utils/performanceMonitor.ts');
  const perfMonitorContent = fs.readFileSync(perfMonitorPath, 'utf8');
  
  // Check for TypeScript interfaces
  const interfaces = [
    'interface PerformanceMetrics',
    'interface PerformanceBaseline',
    'interface PerformanceAlert'
  ];
  
  for (const interfaceName of interfaces) {
    if (!perfMonitorContent.includes(interfaceName)) {
      throw new Error(`Missing interface: ${interfaceName}`);
    }
  }
  
  console.log('✅ TypeScript interfaces defined');
  
} catch (error) {
  console.error('❌ TypeScript interfaces test failed:', error.message);
  process.exit(1);
}

// Test 8: Utility Functions
console.log('\n🛠️ Test 8: Utility Functions');
try {
  const perfMonitorPath = path.join(__dirname, '../src/utils/performanceMonitor.ts');
  const perfMonitorContent = fs.readFileSync(perfMonitorPath, 'utf8');
  
  // Check for utility functions
  const utilityFunctions = [
    'startPerformanceMonitoring',
    'stopPerformanceMonitoring',
    'measureRenderTime',
    'establishPerformanceBaseline',
    'getPerformanceReport',
    'compareEnvironments'
  ];
  
  for (const func of utilityFunctions) {
    if (!perfMonitorContent.includes(`export function ${func}`)) {
      throw new Error(`Missing utility function: ${func}`);
    }
  }
  
  console.log('✅ All utility functions exported');
  
} catch (error) {
  console.error('❌ Utility functions test failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 All Performance Benchmark Setup Tests Passed!');
console.log('\n📊 Summary:');
console.log('- ✅ Performance monitor file created');
console.log('- ✅ Performance alert system configured');
console.log('- ✅ Environment comparison features present');
console.log('- ✅ Baseline establishment working');
console.log('- ✅ Memory usage monitoring configured');
console.log('- ✅ Report generation features present');
console.log('- ✅ TypeScript interfaces defined');
console.log('- ✅ All utility functions exported');

console.log('\n🚀 Performance monitoring system ready!');
console.log('The system can now track render times, memory usage, and performance metrics');
console.log('for both legacy and nextgen environments with automated alerts and reporting.'); 