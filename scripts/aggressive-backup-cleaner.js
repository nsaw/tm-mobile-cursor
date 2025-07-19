#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AggressiveBackupCleaner {
  constructor() {
    this.backupDir = '/Users/sawyer/gitSync/_backups/tm-safety_backups';
    this.quarantineDir = path.join(this.backupDir, 'z_bloated_archive_graveyard');
    this.tempDir = path.join(this.backupDir, 'temp_extraction');
    
    // More aggressive exclusion patterns
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
      '*.tsbuildinfo',
      '.cursor/',
      '.backup/',
      'android/',
      'ios/',
      'node_modules/',
      '.expo-shared/',
      '.expo/',
      'web-build/',
      'dist/',
      'build/',
      'out/',
      '.next/',
      '.turbo/',
      '.vercel/',
      'coverage/',
      '.nyc_output/',
      '.cache/',
      '.parcel-cache/',
      '*.tsbuildinfo',
      '*.log',
      '*.tmp',
      '.DS_Store',
      '*.tar.gz',
      '*.zip',
      '.git/',
      'hooks/',
      'objects/',
      'refs/',
      'HEAD',
      'config',
      'description',
      'info/',
      'logs/',
      'packed-refs'
    ];
  }

  async cleanLargeBackups() {
    console.log('🚀 Aggressive Backup Cleaner v1.0');
    console.log(`Target directory: ${this.backupDir}`);
    
    if (!fs.existsSync(this.backupDir)) {
      console.log('❌ Backup directory not found');
      return;
    }

    // Get all tar.gz files sorted by size (largest first)
    const files = this.getFilesBySize();
    
    if (files.length === 0) {
      console.log('✅ No .tar.gz files found');
      return;
    }

    console.log(`📦 Found ${files.length} .tar.gz files`);
    console.log(`📊 Total size: ${this.formatBytes(this.getTotalSize(files))}`);

    // Process largest files first
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`\n🔧 Processing ${i + 1}/${files.length}: ${path.basename(file.path)} (${this.formatBytes(file.size)})`);
      
      await this.processLargeFile(file);
      
      // Clean up temp files after each file
      this.cleanupTempFiles();
    }

    console.log('\n✅ Aggressive cleanup completed');
  }

  getFilesBySize() {
    const files = [];
    
    if (fs.existsSync(this.backupDir)) {
      const items = fs.readdirSync(this.backupDir);
      
      items.forEach(item => {
        if (item.endsWith('.tar.gz') && !item.includes('_cleaned')) {
          const filePath = path.join(this.backupDir, item);
          const stats = fs.statSync(filePath);
          files.push({
            path: filePath,
            name: item,
            size: stats.size
          });
        }
      });
    }

    // Sort by size (largest first)
    return files.sort((a, b) => b.size - a.size);
  }

  getTotalSize(files) {
    return files.reduce((total, file) => total + file.size, 0);
  }

  async processLargeFile(fileInfo) {
    const { path: filePath, name: fileName, size } = fileInfo;
    
    try {
      // Skip if file is too small to bother with
      if (size < 100 * 1024 * 1024) { // Less than 100MB
        console.log(`⏭️  Skipping small file: ${fileName}`);
        return;
      }

      console.log(`🔍 Analyzing: ${fileName} (${this.formatBytes(size)})`);

      // Extract to temp directory
      const extractDir = path.join(this.tempDir, path.basename(filePath, '.tar.gz'));
      this.cleanTempDir(extractDir);
      
      // Ensure temp directory exists
      if (!fs.existsSync(this.tempDir)) {
        fs.mkdirSync(this.tempDir, { recursive: true });
      }

      // Extract archive
      execSync(`tar -xzf "${filePath}" -C "${this.tempDir}"`, { stdio: 'pipe' });
      
      // Find the extracted directory
      let actualExtractDir = extractDir;
      if (!fs.existsSync(extractDir)) {
        const items = fs.readdirSync(this.tempDir);
        const extractedDir = items.find(item => {
          const itemPath = path.join(this.tempDir, item);
          return fs.statSync(itemPath).isDirectory() && !item.includes('_cleaned');
        });
        
        if (extractedDir) {
          actualExtractDir = path.join(this.tempDir, extractedDir);
        } else {
          throw new Error('Failed to extract archive - no directory found');
        }
      }

      // Analyze contents
      const contents = this.getArchiveContents(actualExtractDir);
      const infectedFiles = this.findInfectedFiles(contents);
      
      console.log(`📊 Analysis: ${contents.length} total files, ${infectedFiles.length} infected files`);

      if (infectedFiles.length > 0) {
        console.log(`⚠️  INFECTED: ${infectedFiles.length} bloated files found`);
        
        // Create cleaned version
        const cleanedDir = path.join(this.tempDir, `${path.basename(filePath, '.tar.gz')}_cleaned`);
        this.cleanTempDir(cleanedDir);
        
        // Copy clean files
        this.copyCleanFiles(actualExtractDir, cleanedDir);
        
        // Create cleaned archive
        const cleanedArchivePath = path.join(this.backupDir, `${path.basename(filePath, '.tar.gz')}_cleaned.tar.gz`);
        execSync(`tar -czf "${cleanedArchivePath}" -C "${cleanedDir}" .`, { stdio: 'pipe' });
        
        const cleanedSize = fs.statSync(cleanedArchivePath).size;
        const sizeReduction = size - cleanedSize;
        const reductionPercent = ((sizeReduction / size) * 100).toFixed(2);
        
        console.log(`✅ Cleaned: ${fileName}`);
        console.log(`   - Original: ${this.formatBytes(size)}`);
        console.log(`   - Cleaned: ${this.formatBytes(cleanedSize)}`);
        console.log(`   - Reduction: ${this.formatBytes(sizeReduction)} (${reductionPercent}%)`);
        
        // Move original to quarantine
        if (!fs.existsSync(this.quarantineDir)) {
          fs.mkdirSync(this.quarantineDir, { recursive: true });
        }
        
        const quarantinePath = path.join(this.quarantineDir, fileName);
        fs.renameSync(filePath, quarantinePath);
        
        // Generate manifest
        const manifestPath = path.join(this.backupDir, `${path.basename(filePath, '.tar.gz')}_cleaned_manifest.txt`);
        this.generateManifest(fileName, size, cleanedSize, cleanedArchivePath, manifestPath);
        
      } else {
        console.log('✅ File is already clean');
      }

    } catch (error) {
      console.error(`❌ Error processing ${fileName}:`, error.message);
    } finally {
      // Clean up temp files
      this.cleanTempDir(extractDir);
      this.cleanTempDir(path.join(this.tempDir, `${path.basename(filePath, '.tar.gz')}_cleaned`));
    }
  }

  cleanTempDir(dir) {
    if (fs.existsSync(dir)) {
      try {
        execSync(`rm -rf "${dir}"`);
      } catch (error) {
        console.error(`❌ Error cleaning temp directory ${dir}:`, error.message);
      }
    }
  }

  cleanupTempFiles() {
    console.log('🧹 Cleaning up temp files...');
    
    // Clean temp_extraction directory
    this.cleanTempDir(this.tempDir);
    
    // Find and clean any other temp files
    try {
      const tempFiles = execSync(`find "${this.backupDir}" -name "*.tmp" -type f`, { encoding: 'utf8' }).trim().split('\n');
      tempFiles.forEach(file => {
        if (file && fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });
    } catch (error) {
      // No temp files found
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

  generateManifest(originalName, originalSize, cleanedSize, cleanedArchivePath, manifestPath) {
    const sha256 = this.calculateSHA256(cleanedArchivePath);
    
    const manifest = `# Aggressive Cleaned Archive Manifest
Original: ${originalName}
Cleaned: ${path.basename(cleanedArchivePath)}
Generated: ${new Date().toISOString()}

## Size Comparison
- Original Size: ${this.formatBytes(originalSize)}
- Cleaned Size: ${this.formatBytes(cleanedSize)}
- Size Reduction: ${this.formatBytes(originalSize - cleanedSize)} (${((1 - cleanedSize / originalSize) * 100).toFixed(2)}%)

## Security
- SHA256: ${sha256}

## Aggressive Exclusion Patterns
${this.exclusionPatterns.map(pattern => `- ${pattern}`).join('\n')}
`;

    fs.writeFileSync(manifestPath, manifest);
    
    // Also write a summary to the mobile-native-fresh summaries directory
    const summaryPath = path.join(process.cwd(), 'mobile-native-fresh', 'tasks', 'summaries', `summary-aggressive-cleanup-${Date.now()}.md`);
    const summaryDir = path.dirname(summaryPath);
    if (!fs.existsSync(summaryDir)) {
      fs.mkdirSync(summaryDir, { recursive: true });
    }
    
    const summary = `# Aggressive Backup Cleanup Summary
Generated: ${new Date().toISOString()}

## Cleanup Details
- **Original File**: ${originalName}
- **Cleaned File**: ${path.basename(cleanedArchivePath)}
- **Original Size**: ${this.formatBytes(originalSize)}
- **Cleaned Size**: ${this.formatBytes(cleanedSize)}
- **Space Freed**: ${this.formatBytes(originalSize - cleanedSize)} (${((1 - cleanedSize / originalSize) * 100).toFixed(2)}%)

## Manifest Location
- **Manifest**: ${manifestPath}
- **SHA256**: ${sha256}

## Process
This file was cleaned using the aggressive backup cleaner with comprehensive exclusion patterns.
`;

    fs.writeFileSync(summaryPath, summary);
    console.log(`📄 Summary written: ${summaryPath}`);
  }

  calculateSHA256(filePath) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    const data = fs.readFileSync(filePath);
    hash.update(data);
    return hash.digest('hex');
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run if called directly
if (require.main === module) {
  const cleaner = new AggressiveBackupCleaner();
  cleaner.cleanLargeBackups().catch(console.error);
}

module.exports = AggressiveBackupCleaner; 