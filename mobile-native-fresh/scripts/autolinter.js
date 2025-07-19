#!/usr/bin/env node
/**
 * AutoLinter - Continuous Linter Error Fixing System for TypeScript/JavaScript
 * 
 * Based on gpt-cursor-runner's Python autolinter patterns
 * 
 * Features:
 * - Continuous file monitoring with debouncing
 * - ESLint + Prettier integration
 * - Automatic error fixing
 * - Statistics tracking
 * - Custom rule enforcement
 * - Real-time notifications
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const chokidar = require('chokidar');

// Simple logger fallback if logging module is not available
class SimpleLogger {
  constructor(module = 'autolinter') {
    this.module = module;
  }

  info(message) {
    console.log(`[INFO] [${this.module}] ${message}`);
  }

  warn(message) {
    console.warn(`[WARN] [${this.module}] ${message}`);
  }

  error(message) {
    console.error(`[ERROR] [${this.module}] ${message}`);
  }

  success(message) {
    console.log(`✅ [${this.module}] ${message}`);
  }
}

let logging;
try {
  logging = require('./logging.js');
} catch (error) {
  logging = { Logger: SimpleLogger };
}

class AutoLinter {
  constructor(configPath = './autolinter_config.json') {
    this.logger = new logging.Logger('autolinter');
    this.config = this.loadConfig(configPath);
    this.processedFiles = new Set();
    this.errorStats = {
      totalErrorsFixed: 0,
      filesProcessed: 0,
      lastRun: null,
      errorsByType: {},
      fixSuccessRate: 0
    };
    this.isRunning = false;
    this.watcher = null;
    
    this.setupLogging();
  }

  loadConfig(configPath) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      this.logger.info('Loaded autolinter configuration');
      return config;
    } catch (error) {
      this.logger.error(`Failed to load config: ${error.message}`);
      // Default configuration
      return {
        project_directories: ['./src'],
        ignore_patterns: [
          '.git', 'node_modules', 'dist', 'build', 'logs', 'temp',
          '*.md', '*.json', '*.lock', '*.log'
        ],
        linter_settings: {
          eslint_config: './config/.eslintrc.cjs',
          prettier_config: './.prettierrc',
          select_errors: ['error', 'warn'],
          auto_fix: true
        },
        monitoring: {
          debounce_delay: 1.0,
          save_stats_interval: 300,
          log_level: 'INFO'
        },
        fixing_strategies: {
          use_eslint: true,
          use_prettier: true,
          use_manual_fixes: true,
          max_line_length: 100
        }
      };
    }
  }

  setupLogging() {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  shouldIgnoreFile(filePath) {
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Check file extension
    const ext = path.extname(filePath);
    if (!['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      return true;
    }

    // Check ignore patterns
    for (const pattern of this.config.ignore_patterns) {
      // Handle glob patterns
      if (pattern.includes('*')) {
        const regexPattern = pattern.replace(/\*/g, '.*').replace(/\./g, '\\.');
        try {
          const regex = new RegExp(regexPattern);
          if (relativePath.match(regex)) {
            return true;
          }
        } catch (error) {
          // If regex fails, fall back to simple string matching
          if (relativePath.includes(pattern.replace('*', ''))) {
            return true;
          }
        }
      } else {
        // Simple string matching
        if (relativePath.includes(pattern)) {
          return true;
        }
      }
    }

    return false;
  }

  async getLinterErrors(filePath) {
    return new Promise((resolve) => {
      const cmd = [
        'npx', 'eslint',
        filePath,
        '--format=json',
        '--config', this.config.linter_settings.eslint_config,
        '--no-eslintrc'
      ];

      const child = spawn(cmd[0], cmd.slice(1), {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve([]);
        } else {
          try {
            const results = JSON.parse(stdout);
            const errors = [];
            
            for (const result of results) {
              for (const message of result.messages) {
                if (this.config.linter_settings.select_errors.includes(message.severity)) {
                  errors.push({
                    line: message.line,
                    column: message.column,
                    rule: message.ruleId,
                    message: message.message,
                    severity: message.severity,
                    fixable: message.fix
                  });
                }
              }
            }
            
            resolve(errors);
          } catch (error) {
            this.logger.error(`Failed to parse ESLint output: ${error.message}`);
            resolve([]);
          }
        }
      });

      child.on('error', (error) => {
        this.logger.error(`ESLint execution error: ${error.message}`);
        resolve([]);
      });
    });
  }

  async fixFileWithESLint(filePath) {
    return new Promise((resolve) => {
      const cmd = [
        'npx', 'eslint',
        filePath,
        '--fix',
        '--config', this.config.linter_settings.eslint_config
      ];

      const child = spawn(cmd[0], cmd.slice(1), {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stderr = '';

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          this.logger.info(`ESLint fixed: ${filePath}`);
          resolve(true);
        } else {
          this.logger.error(`ESLint fix failed for ${filePath}: ${stderr}`);
          resolve(false);
        }
      });

      child.on('error', (error) => {
        this.logger.error(`ESLint execution error: ${error.message}`);
        resolve(false);
      });
    });
  }

  async fixFileWithPrettier(filePath) {
    return new Promise((resolve) => {
      const cmd = [
        'npx', 'prettier',
        '--write',
        filePath
      ];

      const child = spawn(cmd[0], cmd.slice(1), {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stderr = '';

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          this.logger.info(`Prettier formatted: ${filePath}`);
          resolve(true);
        } else {
          this.logger.error(`Prettier format failed for ${filePath}: ${stderr}`);
          resolve(false);
        }
      });

      child.on('error', (error) => {
        this.logger.error(`Prettier execution error: ${error.message}`);
        resolve(false);
      });
    });
  }

  async fixLineLengthIssues(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      let modified = false;

      const fixedLines = lines.map(line => {
        if (line.length > this.config.fixing_strategies.max_line_length) {
          // Try to break long lines intelligently
          if (line.includes('import') && line.includes('from')) {
            return this.breakImportLine(line);
          } else if (line.includes('const') && line.includes('=')) {
            return this.breakVariableDeclaration(line);
          } else {
            return this.breakLongLine(line);
          }
        }
        return line;
      });

      if (fixedLines.join('\n') !== content) {
        fs.writeFileSync(filePath, fixedLines.join('\n'));
        modified = true;
        this.logger.info(`Manual line length fixes applied: ${filePath}`);
      }

      return modified;
    } catch (error) {
      this.logger.error(`Manual fix error for ${filePath}: ${error.message}`);
      return false;
    }
  }

  breakImportLine(line) {
    // Break long import statements
    if (line.includes('import') && line.includes('from')) {
      const importMatch = line.match(/import\s+(.+?)\s+from\s+['"](.+?)['"]/);
      if (importMatch) {
        const imports = importMatch[1];
        const fromPath = importMatch[2];
        
        if (imports.length > 50) {
          return `import {\n  ${imports}\n} from '${fromPath}';`;
        }
      }
    }
    return line;
  }

  breakVariableDeclaration(line) {
    // Break long variable declarations
    if (line.includes('const') && line.includes('=')) {
      const match = line.match(/const\s+(\w+)\s*=\s*(.+)/);
      if (match && match[2].length > 60) {
        return `const ${match[1]} = ${match[2]}`;
      }
    }
    return line;
  }

  breakLongLine(line) {
    // Simple line breaking for long lines
    const words = line.split(' ');
    if (words.length > 1) {
      let currentLine = '';
      const brokenLines = [];
      
      for (const word of words) {
        if (currentLine.length + word.length + 1 > this.config.fixing_strategies.max_line_length) {
          if (currentLine) {
            brokenLines.push(currentLine.trim());
            currentLine = word;
          } else {
            brokenLines.push(word);
          }
        } else {
          currentLine += (currentLine ? ' ' : '') + word;
        }
      }
      
      if (currentLine) {
        brokenLines.push(currentLine.trim());
      }
      
      return brokenLines.join('\n');
    }
    return line;
  }

  async fixFileSystematically(filePath) {
    const results = {
      eslintFixed: 0,
      prettierFixed: 0,
      manualFixed: 0,
      totalErrors: 0
    };

    try {
      // Get initial errors
      const initialErrors = await this.getLinterErrors(filePath);
      results.totalErrors = initialErrors.length;

      // Apply ESLint fixes
      if (this.config.fixing_strategies.use_eslint) {
        const eslintSuccess = await this.fixFileWithESLint(filePath);
        if (eslintSuccess) {
          results.eslintFixed = initialErrors.filter(e => e.fixable).length;
        }
      }

      // Apply Prettier formatting
      if (this.config.fixing_strategies.use_prettier) {
        const prettierSuccess = await this.fixFileWithPrettier(filePath);
        if (prettierSuccess) {
          results.prettierFixed = 1;
        }
      }

      // Apply manual fixes
      if (this.config.fixing_strategies.use_manual_fixes) {
        const manualSuccess = await this.fixLineLengthIssues(filePath);
        if (manualSuccess) {
          results.manualFixed = 1;
        }
      }

      // Check final errors
      const finalErrors = await this.getLinterErrors(filePath);
      const errorsFixed = results.totalErrors - finalErrors.length;
      
      this.errorStats.totalErrorsFixed += errorsFixed;
      this.errorStats.filesProcessed++;

      this.logger.info(`Fixed ${errorsFixed} errors in ${filePath}`);
      
      return results;
    } catch (error) {
      this.logger.error(`Systematic fix failed for ${filePath}: ${error.message}`);
      return results;
    }
  }

  async processFile(filePath) {
    if (this.shouldIgnoreFile(filePath)) {
      return false;
    }

    if (this.processedFiles.has(filePath)) {
      return false;
    }

    this.processedFiles.add(filePath);
    
    try {
      const results = await this.fixFileSystematically(filePath);
      
      // Update statistics
      this.errorStats.lastRun = new Date().toISOString();
      
      if (results.totalErrors > 0) {
        this.errorStats.errorsByType[path.extname(filePath)] = 
          (this.errorStats.errorsByType[path.extname(filePath)] || 0) + results.totalErrors;
      }

      return results.totalErrors > 0;
    } catch (error) {
      this.logger.error(`Process file error for ${filePath}: ${error.message}`);
      return false;
    }
  }

  async scanAllFiles() {
    this.logger.info('Starting full project scan...');
    
    for (const projectDir of this.config.project_directories) {
      const fullPath = path.resolve(projectDir);
      
      if (!fs.existsSync(fullPath)) {
        this.logger.warn(`Project directory not found: ${fullPath}`);
        continue;
      }

      const files = await this.findTypeScriptFiles(fullPath);
      
      for (const file of files) {
        await this.processFile(file);
      }
    }

    this.saveStats();
    this.logger.info('Full project scan completed');
  }

  async findTypeScriptFiles(dir) {
    const files = [];
    
    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!this.shouldIgnoreFile(fullPath)) {
            walk(fullPath);
          }
        } else if (stat.isFile()) {
          if (['.ts', '.tsx', '.js', '.jsx'].includes(path.extname(fullPath))) {
            files.push(fullPath);
          }
        }
      }
    };

    walk(dir);
    return files;
  }

  saveStats() {
    try {
      const statsPath = path.join(process.cwd(), 'logs', 'autolinter_stats.json');
      fs.writeFileSync(statsPath, JSON.stringify(this.errorStats, null, 2));
      this.logger.info('Statistics saved');
    } catch (error) {
      this.logger.error(`Failed to save stats: ${error.message}`);
    }
  }

  loadStats() {
    try {
      const statsPath = path.join(process.cwd(), 'logs', 'autolinter_stats.json');
      if (fs.existsSync(statsPath)) {
        this.errorStats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
        this.logger.info('Statistics loaded');
      }
    } catch (error) {
      this.logger.error(`Failed to load stats: ${error.message}`);
    }
  }

  startWatching() {
    if (this.isRunning) {
      this.logger.warn('Autolinter is already running');
      return;
    }

    this.isRunning = true;
    this.loadStats();

    const watchPaths = this.config.project_directories.map(dir => 
      path.resolve(dir)
    );

    this.watcher = chokidar.watch(watchPaths, {
      ignored: this.config.ignore_patterns,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: this.config.monitoring.debounce_delay * 1000,
        pollInterval: 100
      }
    });

    this.watcher
      .on('add', (filePath) => this.handleFileChange(filePath))
      .on('change', (filePath) => this.handleFileChange(filePath))
      .on('unlink', (filePath) => this.handleFileChange(filePath))
      .on('error', (error) => this.logger.error(`Watcher error: ${error.message}`));

    this.logger.info('File watching started');
    
    // Save stats periodically
    setInterval(() => {
      this.saveStats();
    }, this.config.monitoring.save_stats_interval * 1000);
  }

  async handleFileChange(filePath) {
    if (this.shouldIgnoreFile(filePath)) {
      return;
    }

    this.logger.info(`File changed: ${filePath}`);
    await this.processFile(filePath);
  }

  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    
    this.isRunning = false;
    this.saveStats();
    this.logger.info('File watching stopped');
  }

  getStats() {
    return {
      ...this.errorStats,
      isRunning: this.isRunning,
      config: this.config
    };
  }
}

// CLI Interface
async function main() {
  const command = process.argv[2];
  const autolinter = new AutoLinter();

  switch (command) {
    case 'start':
      autolinter.startWatching();
      break;
      
    case 'stop':
      autolinter.stopWatching();
      break;
      
    case 'scan':
      await autolinter.scanAllFiles();
      break;
      
    case 'stats':
      console.log(JSON.stringify(autolinter.getStats(), null, 2));
      break;
      
    default:
      console.log(`
AutoLinter - Continuous Linter Error Fixing System

Usage:
  node scripts/autolinter.js <command>

Commands:
  start   - Start file watching and autolinting
  stop    - Stop file watching
  scan    - Scan all files once
  stats   - Show current statistics

Examples:
  node scripts/autolinter.js start
  node scripts/autolinter.js scan
  node scripts/autolinter.js stats
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AutoLinter; 