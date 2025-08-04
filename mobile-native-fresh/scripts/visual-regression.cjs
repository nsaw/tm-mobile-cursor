const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VisualRegressionTester {
  constructor() {
    this.baselineDir = '/Users/sawyer/gitSync/.cursor-cache/MAIN/validations/screenshots/baseline';
    this.currentDir = '/Users/sawyer/gitSync/.cursor-cache/MAIN/validations/screenshots/current';
    this.diffDir = '/Users/sawyer/gitSync/.cursor-cache/MAIN/validations/screenshots/diff';
    this.logDir = '/Users/sawyer/gitSync/.cursor-cache/MAIN/validations/logs';
    this.threshold = 5; // 5% difference threshold
    this.results = [];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    const logFile = path.join(this.logDir, 'visual-regression.log');
    
    fs.appendFileSync(logFile, logMessage);
    console.log(message);
  }

  async compareScreenshots(screenshotName) {
    const baselinePath = path.join(this.baselineDir, `${screenshotName}.png`);
    const currentPath = path.join(this.currentDir, `${screenshotName}.png`);
    const diffPath = path.join(this.diffDir, `${screenshotName}-diff.png`);

    this.log(`Comparing screenshot: ${screenshotName}`);

    // Check if current screenshot exists
    if (!fs.existsSync(currentPath)) {
      this.log(`❌ Current screenshot not found: ${currentPath}`);
      return { 
        status: 'failed', 
        error: 'Current screenshot not found',
        screenshotName 
      };
    }

    // If baseline doesn't exist, create it
    if (!fs.existsSync(baselinePath)) {
      this.log(`📸 Creating baseline for: ${screenshotName}`);
      fs.copyFileSync(currentPath, baselinePath);
      return { 
        status: 'baseline-created', 
        screenshotName,
        message: 'Baseline created successfully'
      };
    }

    // Compare images using ImageMagick (if available) or simple file comparison
    try {
      const result = await this.compareImages(baselinePath, currentPath, diffPath);
      
      if (result.diffPercentage > this.threshold) {
        this.log(`❌ Visual regression detected: ${screenshotName} (${result.diffPercentage.toFixed(2)}% difference)`);
        return { 
          status: 'failed', 
          diffPercentage: result.diffPercentage,
          diffPath,
          screenshotName,
          message: `Visual regression detected: ${result.diffPercentage.toFixed(2)}% difference`
        };
      } else {
        this.log(`✅ Screenshot passed: ${screenshotName} (${result.diffPercentage.toFixed(2)}% difference)`);
        return { 
          status: 'passed', 
          diffPercentage: result.diffPercentage,
          screenshotName,
          message: `Screenshot passed: ${result.diffPercentage.toFixed(2)}% difference`
        };
      }
    } catch (error) {
      this.log(`❌ Comparison failed: ${screenshotName} - ${error.message}`);
      return { 
        status: 'error', 
        error: error.message,
        screenshotName 
      };
    }
  }

  async compareImages(baselinePath, currentPath, diffPath) {
    // Try to use ImageMagick for comparison
    try {
      const output = execSync(`compare -metric AE "${baselinePath}" "${currentPath}" "${diffPath}" 2>&1`, { encoding: 'utf8' });
      const diffValue = parseFloat(output.trim());
      
      // Calculate percentage difference (rough approximation)
      const baselineStats = fs.statSync(baselinePath);
      const maxPixels = (baselineStats.size / 4) * 0.01; // Rough pixel count estimate
      const diffPercentage = (diffValue / maxPixels) * 100;
      
      return { diffPercentage: Math.min(diffPercentage, 100) };
    } catch (error) {
      // Fallback to simple file comparison
      this.log(`⚠️ ImageMagick not available, using file comparison fallback`);
      
      const baselineBuffer = fs.readFileSync(baselinePath);
      const currentBuffer = fs.readFileSync(currentPath);
      
      if (baselineBuffer.equals(currentBuffer)) {
        return { diffPercentage: 0 };
      } else {
        // Simple heuristic: if files are different, assume significant difference
        return { diffPercentage: 15 };
      }
    }
  }

  async runVisualRegressionTests() {
    this.log('🚀 Starting visual regression tests...');
    
    // Ensure directories exist
    [this.baselineDir, this.currentDir, this.diffDir, this.logDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Get all current screenshots
    const currentScreenshots = fs.readdirSync(this.currentDir)
      .filter(file => file.endsWith('.png'))
      .map(file => path.basename(file, '.png'));

    if (currentScreenshots.length === 0) {
      this.log('⚠️ No current screenshots found. Run UI tests first.');
      return { status: 'no-screenshots', message: 'No screenshots to compare' };
    }

    this.log(`📸 Found ${currentScreenshots.length} screenshots to compare`);

    // Compare each screenshot
    for (const screenshotName of currentScreenshots) {
      const result = await this.compareScreenshots(screenshotName);
      this.results.push(result);
    }

    // Generate summary
    const summary = this.generateSummary();
    this.log(summary);

    // Save results to file
    const resultsFile = path.join(this.logDir, 'visual-regression-results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(this.results, null, 2));

    return {
      status: this.results.some(r => r.status === 'failed') ? 'failed' : 'passed',
      results: this.results,
      summary
    };
  }

  generateSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const baselineCreated = this.results.filter(r => r.status === 'baseline-created').length;
    const errors = this.results.filter(r => r.status === 'error').length;

    let summary = `\n📊 Visual Regression Test Summary:\n`;
    summary += `=====================================\n`;
    summary += `Total Screenshots: ${total}\n`;
    summary += `✅ Passed: ${passed}\n`;
    summary += `❌ Failed: ${failed}\n`;
    summary += `📸 Baseline Created: ${baselineCreated}\n`;
    summary += `⚠️ Errors: ${errors}\n`;

    if (failed > 0) {
      summary += `\n❌ Failed Screenshots:\n`;
      this.results
        .filter(r => r.status === 'failed')
        .forEach(r => {
          summary += `  - ${r.screenshotName}: ${r.diffPercentage?.toFixed(2)}% difference\n`;
        });
    }

    if (baselineCreated > 0) {
      summary += `\n📸 New Baselines Created:\n`;
      this.results
        .filter(r => r.status === 'baseline-created')
        .forEach(r => {
          summary += `  - ${r.screenshotName}\n`;
        });
    }

    return summary;
  }

  async createBaseline() {
    this.log('📸 Creating baseline screenshots...');
    
    if (!fs.existsSync(this.currentDir)) {
      this.log('❌ No current screenshots directory found');
      return false;
    }

    const currentScreenshots = fs.readdirSync(this.currentDir)
      .filter(file => file.endsWith('.png'));

    for (const file of currentScreenshots) {
      const sourcePath = path.join(this.currentDir, file);
      const baselinePath = path.join(this.baselineDir, file);
      fs.copyFileSync(sourcePath, baselinePath);
      this.log(`📸 Created baseline: ${file}`);
    }

    this.log(`✅ Baseline creation complete: ${currentScreenshots.length} screenshots`);
    return true;
  }

  async cleanup() {
    this.log('🧹 Cleaning up temporary files...');
    
    // Clean up current screenshots (keep baseline and diff)
    if (fs.existsSync(this.currentDir)) {
      const currentFiles = fs.readdirSync(this.currentDir);
      currentFiles.forEach(file => {
        if (file.endsWith('.png')) {
          fs.unlinkSync(path.join(this.currentDir, file));
        }
      });
    }

    this.log('✅ Cleanup complete');
  }
}

// CLI interface
if (require.main === module) {
  const tester = new VisualRegressionTester();
  const command = process.argv[2];

  switch (command) {
    case 'test':
      tester.runVisualRegressionTests()
        .then(result => {
          process.exit(result.status === 'passed' ? 0 : 1);
        })
        .catch(error => {
          console.error('❌ Visual regression test failed:', error);
          process.exit(1);
        });
      break;

    case 'baseline':
      tester.createBaseline()
        .then(success => {
          process.exit(success ? 0 : 1);
        })
        .catch(error => {
          console.error('❌ Baseline creation failed:', error);
          process.exit(1);
        });
      break;

    case 'cleanup':
      tester.cleanup()
        .then(() => {
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Cleanup failed:', error);
          process.exit(1);
        });
      break;

    default:
      console.log('Usage: node visual-regression.js [test|baseline|cleanup]');
      process.exit(1);
  }
}

module.exports = VisualRegressionTester; 