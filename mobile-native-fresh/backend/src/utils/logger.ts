import fs from 'fs';
import path from 'path';

interface LogLevel {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  private logFile: string;
  private maxLogSize: number = 10 * 1024 * 1024; // 10MB
  private maxLogAge: number = 7 * 24 * 60 * 60 * 1000; // 7 days
  private currentLevel: number = LOG_LEVELS.INFO;

  constructor(prefix: string = 'app') {
    this.logFile = this.createLogFile(prefix);
    this.cleanupOldLogs();
  }

  private createLogFile(prefix: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logDir = path.join(__dirname, '../../logs');
    
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    return path.join(logDir, `${prefix}-${timestamp}.log`);
  }

  private cleanupOldLogs(): void {
    try {
      const logDir = path.join(__dirname, '../../logs');
      if (!fs.existsSync(logDir)) return;

      const files = fs.readdirSync(logDir);
      const now = Date.now();
      let cleanedCount = 0;

      files.forEach(file => {
        const filePath = path.join(logDir, file);
        const stats = fs.statSync(filePath);

        // Delete files older than maxLogAge
        if (now - stats.mtime.getTime() > this.maxLogAge) {
          if (this.shouldDeleteFile(file)) {
            fs.unlinkSync(filePath);
            cleanedCount++;
          }
        }
      });

      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned ${cleanedCount} old log files`);
      }
    } catch (error) {
      console.error('Error cleaning old logs:', error);
    }
  }

  private shouldDeleteFile(filename: string): boolean {
    const logExtensions = ['.log', '.txt'];
    const logPatterns = [
      /^.*\.log$/,
      /^.*\.txt$/,
      /^log-.*$/,
      /^.*-log.*$/,
      /^error.*$/,
      /^debug.*$/,
      /^trace.*$/
    ];

    return logExtensions.some(ext => filename.endsWith(ext)) ||
           logPatterns.some(pattern => pattern.test(filename));
  }

  private rotateLogIfNeeded(): void {
    try {
      if (fs.existsSync(this.logFile)) {
        const stats = fs.statSync(this.logFile);
        
        if (stats.size > this.maxLogSize) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const newName = `${this.logFile}.${timestamp}`;
          fs.renameSync(this.logFile, newName);
          console.log(`🔄 Rotated large log file: ${this.logFile} -> ${newName}`);
        }
      }
    } catch (error) {
      console.error('Error rotating log file:', error);
    }
  }

  private writeLog(level: string, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data: data || null
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    try {
      this.rotateLogIfNeeded();
      fs.appendFileSync(this.logFile, logLine);
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  setLevel(level: keyof LogLevel): void {
    this.currentLevel = LOG_LEVELS[level];
  }

  private shouldLog(level: number): boolean {
    return level >= this.currentLevel;
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      this.writeLog('DEBUG', message, data);
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      this.writeLog('INFO', message, data);
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      this.writeLog('WARN', message, data);
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  error(message: string, data?: any): void {
    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      this.writeLog('ERROR', message, data);
      console.error(`[ERROR] ${message}`, data || '');
    }
  }

  // Get log statistics
  getStats(): { fileCount: number; totalSize: number; currentLogSize: number } {
    try {
      const logDir = path.join(__dirname, '../../logs');
      if (!fs.existsSync(logDir)) {
        return { fileCount: 0, totalSize: 0, currentLogSize: 0 };
      }

      const files = fs.readdirSync(logDir);
      let totalSize = 0;
      let currentLogSize = 0;

      files.forEach(file => {
        const filePath = path.join(logDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        
        if (filePath === this.logFile) {
          currentLogSize = stats.size;
        }
      });

      return {
        fileCount: files.length,
        totalSize,
        currentLogSize
      };
    } catch (error) {
      return { fileCount: 0, totalSize: 0, currentLogSize: 0 };
    }
  }
}

// Create default logger instance
const logger = new Logger('backend');

export default logger;
export { Logger }; 