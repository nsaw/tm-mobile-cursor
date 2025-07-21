#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

class BackupSanitizer {
  constructor() {
    // Allow custom backup directory via command line argument
    const customDir = process.argv.find(arg => arg.startsWith('--dir='));
    if (customDir) {
      this.backupDir = customDir.split('=')[1];
    } else {
      this.backupDir = path.resolve(process.env.HOME, 'gitSync/_backups/tm-mobile-cursor');
    }
    this.quarantineDir = path.join(this.backupDir, 'z_bloated_archive_graveyard');
    this.tempDir = path.join(this.backupDir, 'temp_extraction');
    this.exclusionPatterns = [
      'node_modules/',
      '.expo/',
      '.turbo/',
      '.next/',
      '.vercel/',
      '*.log',
      'dist/',
      '*.tmp',
      '.DS_Store',
      '*.tar.gz',
      '*.zip',
      '.git/',
      'coverage/',
      '.nyc_output/',
      'build/',
      'out/',
      '.cache/',
      '.parcel-cache/',
      '*.tsbuildinfo'
    ];
    
    this.scanResults = [];
    this.cleanedArchives = [];
  }

  // PHASE 1: Scan & Report
  async scanBackups() {
    console.log('🔍 PHASE 1: Scanning backup archives...');
    
    if (!fs.existsSync(this.backupDir)) {
      console.log(`❌ Backup directory not found: ${this.backupDir}`);
      console.log('Creating backup directory structure...');
      this.createBackupDirectory();
      return;
    }

    const tarGzFiles = this.findTarGzFiles();
    
    if (tarGzFiles.length === 0) {
      console.log('✅ No .tar.gz files found in backup directory');
      return;
    }

    // Check for limit option
    const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
    const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;
    
    const filesToProcess = limit ? tarGzFiles.slice(0, limit) : tarGzFiles;
    
    console.log(`📦 Found ${tarGzFiles.length} .tar.gz files to analyze`);
    if (limit) {
      console.log(`🔢 Processing only first ${limit} files due to --limit option`);
    }

    for (const file of filesToProcess) {
      await this.analyzeArchive(file);
    }

    this.generateScanReport();
  }

  createBackupDirectory() {
    try {
      fs.mkdirSync(this.backupDir, { recursive: true });
      fs.mkdirSync(this.quarantineDir, { recursive: true });
      fs.mkdirSync(this.tempDir, { recursive: true });
      console.log('✅ Created backup directory structure');
    } catch (error) {
      console.error('❌ Error creating backup directory:', error.message);
    }
  }

  findTarGzFiles() {
    const files = [];
    
    if (fs.existsSync(this.backupDir)) {
      const items = fs.readdirSync(this.backupDir);
      items.forEach(item => {
        if (item.endsWith('.tar.gz')) {
          // Skip files that have already been cleaned (contain _cleaned in name)
          if (!item.includes('_cleaned')) {
            files.push(path.join(this.backupDir, item));
          }
        }
      });
    }

    return files;
  }

  async analyzeArchive(archivePath) {
    console.log(`\n📋 Analyzing: ${path.basename(archivePath)}`);
    
    const result = {
      filename: path.basename(archivePath),
      fullPath: archivePath,
      originalSize: fs.statSync(archivePath).size,
      infected: false,
      infectedFiles: [],
      totalFiles: 0,
      extractedSize: 0
    };

    let extractDir = null;

    try {
      // Ensure temp directory exists
      if (!fs.existsSync(this.tempDir)) {
        fs.mkdirSync(this.tempDir, { recursive: true });
      }
      
      // Extract to temp directory
      extractDir = path.join(this.tempDir, path.basename(archivePath, '.tar.gz'));
      this.cleanTempDir(extractDir);
      
      // Extract archive
      execSync(`tar -xzf "${archivePath}" -C "${this.tempDir}"`, { stdio: 'pipe' });
      
      // Check if extraction was successful
      if (!fs.existsSync(extractDir)) {
        // Try to find the extracted directory
        const items = fs.readdirSync(this.tempDir);
        const extractedDir = items.find(item => {
          const itemPath = path.join(this.tempDir, item);
          return fs.statSync(itemPath).isDirectory() && !item.includes('_cleaned');
        });
        
        if (extractedDir) {
          extractDir = path.join(this.tempDir, extractedDir);
        } else {
          throw new Error('Failed to extract archive - no directory found');
        }
      }
      
      // Analyze contents
      const contents = this.getArchiveContents(extractDir);
      result.totalFiles = contents.length;
      
      // Check for infected files
      const infectedFiles = this.findInfectedFiles(contents);
      result.infectedFiles = infectedFiles;
      result.infected = infectedFiles.length > 0;
      
      if (result.infected) {
        console.log(`⚠️  INFECTED: ${infectedFiles.length} bloated files found`);
        infectedFiles.forEach(file => console.log(`   - ${file}`));
      } else {
        console.log('✅ Clean archive');
      }

      // Calculate extracted size
      result.extractedSize = this.calculateDirectorySize(extractDir);
      
    } catch (error) {
      console.error(`❌ Error analyzing ${archivePath}:`, error.message);
      result.error = error.message;
    } finally {
      // Clean up temp files after each archive
      if (extractDir) {
        this.cleanTempDir(extractDir);
      }
    }
    
    this.scanResults.push(result);
  }

  cleanTempDir(dir) {
    if (fs.existsSync(dir)) {
      try {
        execSync(`rm -rf "${dir}"`);
        console.log(`🧹 Cleaned temp directory: ${path.relative(this.backupDir, dir)}`);
      } catch (error) {
        console.error(`❌ Error cleaning temp directory ${dir}:`, error.message);
      }
    }
  }

  // Clean up all temp files immediately
  cleanupAllTempFiles() {
    console.log('🧹 Cleaning up all temporary files...');
    
    // Clean temp_extraction directory
    this.cleanTempDir(this.tempDir);
    
    // Find and clean any other temp files in backup directory
    try {
      const tempFiles = execSync(`find "${this.backupDir}" -name "*.tmp" -type f`, { encoding: 'utf8' }).trim().split('\n');
      tempFiles.forEach(file => {
        if (file && fs.existsSync(file)) {
          fs.unlinkSync(file);
          console.log(`🗑️  Deleted temp file: ${path.relative(this.backupDir, file)}`);
        }
      });
    } catch (error) {
      // No temp files found or error
    }
    
    // Clean any temp directories
    try {
      const tempDirs = execSync(`find "${this.backupDir}" -name "temp_*" -type d`, { encoding: 'utf8' }).trim().split('\n');
      tempDirs.forEach(dir => {
        if (dir && fs.existsSync(dir)) {
          execSync(`rm -rf "${dir}"`);
          console.log(`🗑️  Deleted temp directory: ${path.relative(this.backupDir, dir)}`);
        }
      });
    } catch (error) {
      // No temp directories found or error
    }
  }

  getArchiveContents(dir) {
    const files = [];
    
    function scanDirectory(currentDir, relativePath = '') {
      const items = fs.readdirSync(currentDir);
      
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const relativeItemPath = path.join(relativePath, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          scanDirectory(fullPath, relativeItemPath);
        } else {
          files.push(relativeItemPath);
        }
      });
    }
    
    scanDirectory(dir);
    return files;
  }

  findInfectedFiles(files) {
    const infected = [];
    
    files.forEach(file => {
      for (const pattern of this.exclusionPatterns) {
        if (this.matchesPattern(file, pattern)) {
          infected.push(file);
          break;
        }
      }
    });
    
    return infected;
  }

  matchesPattern(file, pattern) {
    if (pattern.endsWith('/')) {
      return file.includes(pattern.slice(0, -1));
    } else if (pattern.startsWith('*.')) {
      const ext = pattern.slice(1);
      return file.endsWith(ext);
    } else {
      return file.includes(pattern);
    }
  }

  calculateDirectorySize(dir) {
    let totalSize = 0;
    
    function calculateSize(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          calculateSize(fullPath);
        } else {
          totalSize += stats.size;
        }
      });
    }
    
    calculateSize(dir);
    return totalSize;
  }

  generateScanReport() {
    // Use the correct mobile-native-fresh summaries path
    const reportPath = path.join(process.cwd(), 'mobile-native-fresh', 'tasks', 'summaries', 'summary-backup-bloat-scan.md');
    
    // Ensure summaries directory exists
    const summariesDir = path.dirname(reportPath);
    if (!fs.existsSync(summariesDir)) {
      fs.mkdirSync(summariesDir, { recursive: true });
    }

    let report = `# Backup Bloat Scan Report
Generated: ${new Date().toISOString()}

## Summary
- Total archives scanned: ${this.scanResults.length}
- Infected archives: ${this.scanResults.filter(r => r.infected).length}
- Clean archives: ${this.scanResults.filter(r => !r.infected).length}

## Detailed Results

`;

    this.scanResults.forEach(result => {
      report += `### ${result.filename}
- **Status**: ${result.infected ? '⚠️ INFECTED' : '✅ CLEAN'}
- **Original Size**: ${this.formatBytes(result.originalSize)}
- **Total Files**: ${result.totalFiles}
- **Extracted Size**: ${this.formatBytes(result.extractedSize)}

`;

      if (result.infected) {
        report += `**Infected Files:**
`;
        result.infectedFiles.forEach(file => {
          report += `- ${file}
`;
        });
        report += `
`;
      }

      if (result.error) {
        report += `**Error**: ${result.error}

`;
      }
    });

    fs.writeFileSync(reportPath, report);
    console.log(`📄 Scan report written to: ${reportPath}`);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // PHASE 2: Repair
  async repairInfectedArchives() {
    console.log('\n🧹 PHASE 2: Repairing infected archives...');
    
    const infectedArchives = this.scanResults.filter(r => r.infected);
    
    if (infectedArchives.length === 0) {
      console.log('✅ No infected archives to repair');
      return;
    }

    console.log(`🔧 Repairing ${infectedArchives.length} infected archives...`);

    for (const archive of infectedArchives) {
      await this.repairArchive(archive);
    }

    console.log('✅ Repair phase completed');
  }

  async repairArchive(archiveInfo) {
    console.log(`\n🔧 Repairing: ${archiveInfo.filename}`);
    
    let extractDir = null;
    let cleanedDir = null;
    
    try {
      const originalPath = archiveInfo.fullPath;
      const archiveName = path.basename(originalPath, '.tar.gz');
      extractDir = path.join(this.tempDir, archiveName);
      cleanedDir = path.join(this.tempDir, `${archiveName}_cleaned`);
      
      // Ensure temp directory exists
      if (!fs.existsSync(this.tempDir)) {
        fs.mkdirSync(this.tempDir, { recursive: true });
      }
      
      // Clean temp directories
      this.cleanTempDir(cleanedDir);
      
      // Extract original archive
      execSync(`tar -xzf "${originalPath}" -C "${this.tempDir}"`, { stdio: 'pipe' });
      
      // Check if extraction was successful
      if (!fs.existsSync(extractDir)) {
        // Try to find the extracted directory
        const items = fs.readdirSync(this.tempDir);
        const extractedDir = items.find(item => {
          const itemPath = path.join(this.tempDir, item);
          return fs.statSync(itemPath).isDirectory() && !item.includes('_cleaned');
        });
        
        if (extractedDir) {
          extractDir = path.join(this.tempDir, extractedDir);
        } else {
          throw new Error('Failed to extract archive - no directory found');
        }
      }
      
      // Copy files excluding infected ones
      this.copyCleanFiles(extractDir, cleanedDir);
      
      // Create cleaned archive
      const cleanedArchivePath = path.join(this.backupDir, `${archiveName}_cleaned.tar.gz`);
      execSync(`tar -czf "${cleanedArchivePath}" -C "${cleanedDir}" .`, { stdio: 'pipe' });
      
      // Generate manifest
      const manifestPath = path.join(this.backupDir, `${archiveName}_cleaned_manifest.txt`);
      this.generateManifest(archiveInfo, cleanedArchivePath, manifestPath);
      
      // Ensure quarantine directory exists
      if (!fs.existsSync(this.quarantineDir)) {
        fs.mkdirSync(this.quarantineDir, { recursive: true });
      }
      
      // Move original to quarantine
      const quarantinePath = path.join(this.quarantineDir, archiveInfo.filename);
      fs.renameSync(originalPath, quarantinePath);
      
      console.log(`✅ Repaired: ${archiveInfo.filename}`);
      console.log(`   - Original: ${this.formatBytes(archiveInfo.originalSize)}`);
      console.log(`   - Cleaned: ${this.formatBytes(fs.statSync(cleanedArchivePath).size)}`);
      
      this.cleanedArchives.push({
        original: archiveInfo,
        cleaned: cleanedArchivePath,
        manifest: manifestPath,
        quarantine: quarantinePath
      });
      
    } catch (error) {
      console.error(`❌ Error repairing ${archiveInfo.filename}:`, error.message);
    } finally {
      // Clean up temp files after each repair
      if (extractDir) {
        this.cleanTempDir(extractDir);
      }
      if (cleanedDir) {
        this.cleanTempDir(cleanedDir);
      }
    }
  }

  copyCleanFiles(sourceDir, targetDir) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const self = this;
    
    function copyDirectory(currentSource, currentTarget) {
      const items = fs.readdirSync(currentSource);
      
      items.forEach(item => {
        const sourcePath = path.join(currentSource, item);
        const targetPath = path.join(currentTarget, item);
        const relativePath = path.relative(sourceDir, sourcePath);
        
        // Check if file should be excluded
        let shouldExclude = false;
        for (const pattern of self.exclusionPatterns) {
          if (self.matchesPattern(relativePath, pattern)) {
            shouldExclude = true;
            break;
          }
        }
        
        if (!shouldExclude) {
          const stats = fs.statSync(sourcePath);
          
          if (stats.isDirectory()) {
            if (!fs.existsSync(targetPath)) {
              fs.mkdirSync(targetPath, { recursive: true });
            }
            copyDirectory(sourcePath, targetPath);
          } else {
            // Ensure target directory exists
            const targetDir = path.dirname(targetPath);
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }
            fs.copyFileSync(sourcePath, targetPath);
          }
        }
      });
    }
    
    copyDirectory(sourceDir, targetDir);
  }

  generateManifest(originalInfo, cleanedArchivePath, manifestPath) {
    const cleanedSize = fs.statSync(cleanedArchivePath).size;
    const sha256 = this.calculateSHA256(cleanedArchivePath);
    
    const manifest = `# Cleaned Archive Manifest
Original: ${originalInfo.filename}
Cleaned: ${path.basename(cleanedArchivePath)}
Generated: ${new Date().toISOString()}

## Size Comparison
- Original Size: ${this.formatBytes(originalInfo.originalSize)}
- Cleaned Size: ${this.formatBytes(cleanedSize)}
- Size Reduction: ${this.formatBytes(originalInfo.originalSize - cleanedSize)} (${((1 - cleanedSize / originalInfo.originalSize) * 100).toFixed(2)}%)

## File Count
- Original Files: ${originalInfo.totalFiles}
- Infected Files Removed: ${originalInfo.infectedFiles.length}

## Security
- SHA256: ${sha256}

## Excluded Patterns
${this.exclusionPatterns.map(pattern => `- ${pattern}`).join('\n')}
`;

    fs.writeFileSync(manifestPath, manifest);
  }

  calculateSHA256(filePath) {
    const hash = crypto.createHash('sha256');
    const data = fs.readFileSync(filePath);
    hash.update(data);
    return hash.digest('hex');
  }

  // Main execution
  async run() {
    console.log('🚀 Backup Sanitizer v1.0');
    console.log('Target directory:', this.backupDir);
    console.log('Exclusion patterns:', this.exclusionPatterns.length);
    
    await this.scanBackups();
    
    if (this.scanResults.length > 0) {
      const infectedCount = this.scanResults.filter(r => r.infected).length;
      
      if (infectedCount > 0) {
        console.log(`\n⚠️  Found ${infectedCount} infected archives`);
        
        const response = process.argv.includes('--auto-repair') ? 'y' : 
          await this.promptUser('Proceed with repair? (y/N): ');
        
        if (response.toLowerCase() === 'y') {
          await this.repairInfectedArchives();
        } else {
          console.log('Repair skipped by user');
        }
      }
    }
    
    console.log('\n✅ Backup sanitization completed');
  }

  async promptUser(question) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise(resolve => {
      rl.question(question, answer => {
        rl.close();
        resolve(answer);
      });
    });
  }
}

// Run if called directly
if (require.main === module) {
  const sanitizer = new BackupSanitizer();
  sanitizer.run().catch(console.error);
}

module.exports = BackupSanitizer; 