#!/usr/bin/env node

/**
 * Validate headless screenshot functionality
 * Required by patch-v1.4.200(P1.0.0)_revalidate-headless-preflight-2.json
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating headless screenshot infrastructure...');

// Check if screenshots directory exists
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  console.log('📁 Creating screenshots directory...');
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Check if validations directory exists
const validationsDir = path.join(__dirname, '..', 'validations');
if (!fs.existsSync(validationsDir)) {
  console.log('📁 Creating validations directory...');
  fs.mkdirSync(validationsDir, { recursive: true });
}

// Validate Detox configuration
console.log('🧪 Checking Detox configuration...');
try {
  const detoxConfig = path.join(__dirname, '..', '.detoxrc.js');
  if (!fs.existsSync(detoxConfig)) {
    console.log('⚠️  Detox config not found, checking package.json...');
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    if (!packageJson.detox) {
      console.log('❌ Detox configuration not found in package.json');
      process.exit(1);
    }
  }
  console.log('✅ Detox configuration found');
} catch (error) {
  console.log('❌ Failed to validate Detox configuration:', error.message);
  process.exit(1);
}

// Validate Puppeteer availability
console.log('🎭 Checking Puppeteer availability...');
try {
  execSync('npx puppeteer --version', { stdio: 'pipe' });
  console.log('✅ Puppeteer is available');
} catch (error) {
  console.log('❌ Puppeteer not available:', error.message);
  process.exit(1);
}

// Validate Modern Screenshot availability
console.log('📸 Checking Modern Screenshot availability...');
try {
  const modernScreenshotPath = path.join(__dirname, '..', 'node_modules', 'modern-screenshot');
  if (!fs.existsSync(modernScreenshotPath)) {
    console.log('⚠️  Modern Screenshot not installed, attempting to install...');
    execSync('npm install modern-screenshot', { stdio: 'pipe' });
  }
  console.log('✅ Modern Screenshot is available');
} catch (error) {
  console.log('❌ Modern Screenshot validation failed:', error.message);
  process.exit(1);
}

// Create validation log
const validationLog = {
  timestamp: new Date().toISOString(),
  detox: 'available',
  puppeteer: 'available',
  modernScreenshot: 'available',
  screenshotsDir: fs.existsSync(screenshotsDir),
  validationsDir: fs.existsSync(validationsDir),
  status: 'PASSED'
};

fs.writeFileSync(
  path.join(validationsDir, 'headless-screenshot-validation.json'),
  JSON.stringify(validationLog, null, 2)
);

console.log('✅ Headless screenshot validation completed successfully');
console.log('📝 Validation log saved to validations/headless-screenshot-validation.json'); 