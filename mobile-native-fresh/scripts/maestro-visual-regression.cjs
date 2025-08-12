#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class MaestroVisualRegression {
  constructor() {
    this.maestroPath = path.join(process.cwd(), 'maestro');
    // Unified screenshots path per enforcement
    this.screenshotsPath = '/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/screenshots';
    this.baselinePath = path.join(this.screenshotsPath, 'baseline');
    this.currentPath = path.join(this.screenshotsPath, 'current');
    this.diffPath = path.join(this.screenshotsPath, 'diff');
    this.reportPath = path.join(this.screenshotsPath, 'report.json');
  }

  async ensureDirectories() {
    const dirs = [this.screenshotsPath, this.baselinePath, this.currentPath, this.diffPath];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  async runMaestroFlow(flowFile, outputDir) {
    try {
      console.log(`Running Maestro flow: ${flowFile}`);
      const command = `~/.maestro/bin/maestro test ${flowFile} --output ${outputDir}`;
      execSync(command, { stdio: 'inherit' });
      return true;
    } catch (error) {
      console.error(`Maestro flow failed: ${error.message}`);
      return false;
    }
  }

  async createBaseline() {
    console.log('Creating baseline screenshots...');
    await this.ensureDirectories();
    
    // Clear baseline directory
    if (fs.existsSync(this.baselinePath)) {
      fs.rmSync(this.baselinePath, { recursive: true, force: true });
    }
    fs.mkdirSync(this.baselinePath, { recursive: true });

    const flowFile = path.join(this.maestroPath, 'flows', 'visual-regression.yaml');
    const success = await this.runMaestroFlow(flowFile, this.baselinePath);
    
    if (success) {
      console.log('✅ Baseline screenshots created successfully');
      return true;
    } else {
      console.log('❌ Baseline creation failed');
      return false;
    }
  }

  async captureCurrent() {
    console.log('Capturing current screenshots...');
    await this.ensureDirectories();
    
    // Clear current directory
    if (fs.existsSync(this.currentPath)) {
      fs.rmSync(this.currentPath, { recursive: true, force: true });
    }
    fs.mkdirSync(this.currentPath, { recursive: true });

    const flowFile = path.join(this.maestroPath, 'flows', 'visual-regression.yaml');
    const success = await this.runMaestroFlow(flowFile, this.currentPath);
    
    if (success) {
      console.log('✅ Current screenshots captured successfully');
      return true;
    } else {
      console.log('❌ Current screenshot capture failed');
      return false;
    }
  }

  async compareScreenshots() {
    console.log('Comparing screenshots...');
    const report = {
      timestamp: new Date().toISOString(),
      totalScreenshots: 0,
      passed: 0,
      failed: 0,
      diffs: []
    };

    if (!fs.existsSync(this.baselinePath) || !fs.existsSync(this.currentPath)) {
      console.log('❌ Baseline or current screenshots not found');
      return report;
    }

    const baselineFiles = fs.readdirSync(this.baselinePath).filter(f => f.endsWith('.png'));
    const currentFiles = fs.readdirSync(this.currentPath).filter(f => f.endsWith('.png'));

    report.totalScreenshots = baselineFiles.length;

    for (const baselineFile of baselineFiles) {
      const currentFile = baselineFile;
      const baselinePath = path.join(this.baselinePath, baselineFile);
      const currentPath = path.join(this.currentPath, currentFile);
      const diffPath = path.join(this.diffPath, `diff-${baselineFile}`);

      if (!fs.existsSync(currentPath)) {
        report.failed++;
        report.diffs.push({
          file: baselineFile,
          status: 'missing',
          error: 'Current screenshot not found'
        });
        continue;
      }

      try {
        // Use ImageMagick for comparison
        const command = `compare -metric AE -fuzz 5% "${baselinePath}" "${currentPath}" "${diffPath}" 2>&1`;
        const result = execSync(command, { encoding: 'utf8' });
        const diffValue = parseInt(result.trim());

        if (diffValue <= 100) { // Threshold for acceptable difference
          report.passed++;
          report.diffs.push({
            file: baselineFile,
            status: 'passed',
            diffValue
          });
        } else {
          report.failed++;
          report.diffs.push({
            file: baselineFile,
            status: 'failed',
            diffValue,
            diffPath
          });
        }
      } catch (error) {
        report.failed++;
        report.diffs.push({
          file: baselineFile,
          status: 'error',
          error: error.message
        });
      }
    }

    // Save report
    fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Comparison complete: ${report.passed} passed, ${report.failed} failed`);
    return report;
  }

  async runFullRegression() {
    console.log('🚀 Starting Maestro Visual Regression Test');
    
    const baselineSuccess = await this.createBaseline();
    if (!baselineSuccess) {
      console.log('❌ Baseline creation failed, aborting');
      return false;
    }

    const currentSuccess = await this.captureCurrent();
    if (!currentSuccess) {
      console.log('❌ Current capture failed, aborting');
      return false;
    }

    const report = await this.compareScreenshots();
    
    console.log('\n📊 Visual Regression Report:');
    console.log(`Total Screenshots: ${report.totalScreenshots}`);
    console.log(`Passed: ${report.passed}`);
    console.log(`Failed: ${report.failed}`);
    
    if (report.failed > 0) {
      console.log('\n❌ Failed Screenshots:');
      report.diffs.filter(d => d.status === 'failed').forEach(diff => {
        console.log(`  - ${diff.file} (diff: ${diff.diffValue})`);
      });
    }

    return report.failed === 0;
  }
}

// CLI interface
const command = process.argv[2];
const maestro = new MaestroVisualRegression();

async function main() {
  switch (command) {
    case 'baseline':
      await maestro.createBaseline();
      break;
    case 'capture':
      await maestro.captureCurrent();
      break;
    case 'compare':
      await maestro.compareScreenshots();
      break;
    case 'test':
      const success = await maestro.runFullRegression();
      process.exit(success ? 0 : 1);
      break;
    default:
      console.log('Usage: node maestro-visual-regression.cjs [baseline|capture|compare|test]');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = MaestroVisualRegression; 