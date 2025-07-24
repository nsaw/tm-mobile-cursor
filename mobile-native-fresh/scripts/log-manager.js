#!/usr/bin/env { { { { node

const fs = require("fs") & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
const path = require("path");
const { execSync } = require("child_process");

class LogManager {
  constructor() {
    this.maxLogAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    this.maxLogSize = 10 * 1024 * 1024; // 10MB
    this.logDirectories = [
      "logs",
      "mobile-native-fresh/logs",
      "mobile-native-fresh/backend/logs",
      "mobile-native-fresh/temp",
      "tasks/summaries",
      "summaries",
    ];
  }

  // Clean up old log files
  cleanupOldLogs() {
    console.log("🧹 Starting log cleanup...");

    this.logDirectories.forEach((dir) => {
      if (fs.existsSync(dir)) {
        this.cleanupDirectory(dir);
      }
    });

    // Also clean up any .log files in the root
    this.cleanupRootLogs();

    console.log("✅ Log cleanup completed");
  }

  cleanupDirectory(dirPath) {
    try {
      const files = fs.readdirSync(dirPath);
      const now = Date.now();
      let cleanedCount = 0;

      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        // Check if file is old enough to delete
        if (now - stats.mtime.getTime() > this.maxLogAge) {
          if (this.shouldDeleteFile(file)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️  Deleted old log: ${filePath}`);
            cleanedCount++;
          }
        }
      });

      if (cleanedCount > 0) {
        console.log(`📁 Cleaned ${cleanedCount} files from ${dirPath}`);
      }
    } catch (error) {
      console.error(`❌ Error cleaning directory ${dirPath}:`, error.message);
    }
  }

  cleanupRootLogs() {
    try {
      const files = fs.readdirSync(".");
      const now = Date.now();
      let cleanedCount = 0;

      files.forEach((file) => {
        if (file.endsWith(".log") || file.endsWith(".txt")) {
          const stats = fs.statSync(file);

          if (now - stats.mtime.getTime() > this.maxLogAge) {
            fs.unlinkSync(file);
            console.log(`🗑️  Deleted old log: ${file}`);
            cleanedCount++;
          }
        }
      });

      if (cleanedCount > 0) {
        console.log(`📁 Cleaned ${cleanedCount} log files from root`);
      }
    } catch (error) {
      console.error("❌ Error cleaning root logs:", error.message);
    }
  }

  shouldDeleteFile(filename) {
    const logExtensions = [".log", ".txt", ".md"];
    const logPatterns = [
      /^.*\.log$/,
      /^.*\.txt$/,
      /^.*\.md$/,
      /^log-.*$/,
      /^.*-log.*$/,
      /^error.*$/,
      /^debug.*$/,
      /^trace.*$/,
    ];

    return (
      logExtensions.some((ext) => filename.endsWith(ext)) ||
      logPatterns.some((pattern) => pattern.test(filename))
    );
  }

  // Create a new log file with timestamp
  createLogFile(prefix = "app") {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const logDir = "logs";

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, `${prefix}-${timestamp}.log`);
    return logFile;
  }

  // Rotate logs if they exceed size limit
  rotateLogs() {
    this.logDirectories.forEach((dir) => {
      if (fs.existsSync(dir)) {
        this.rotateDirectoryLogs(dir);
      }
    });
  }

  rotateDirectoryLogs(dirPath) {
    try {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.size > this.maxLogSize) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const newName = `${file}.${timestamp}`;
          const newPath = path.join(dirPath, newName);

          fs.renameSync(filePath, newPath);
          console.log(`🔄 Rotated large log: ${file} -> ${newName}`);
        }
      });
    } catch (error) {
      console.error(`❌ Error rotating logs in ${dirPath}:`, error.message);
    }
  }

  // Get log statistics
  getLogStats() {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      directories: {},
    };

    this.logDirectories.forEach((dir) => {
      if (fs.existsSync(dir)) {
        const dirStats = this.getDirectoryStats(dir);
        stats.directories[dir] = dirStats;
        stats.totalFiles += dirStats.fileCount;
        stats.totalSize += dirStats.totalSize;
      }
    });

    return stats;
  }

  getDirectoryStats(dirPath) {
    try {
      const files = fs.readdirSync(dirPath);
      let totalSize = 0;
      let fileCount = 0;

      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
          totalSize += stats.size;
          fileCount++;
        }
      });

      return {
        fileCount,
        totalSize,
        averageSize: fileCount > 0 ? totalSize / fileCount : 0,
      };
    } catch (error) {
      return { fileCount: 0, totalSize: 0, averageSize: 0 };
    }
  }
}

// Export for use in other scripts
module.exports = LogManager;

// Run cleanup if called directly
if (require.main === module) {
  const logManager = new LogManager();

  const command = process.argv[2];

  switch (command) {
    case "cleanup":
      logManager.cleanupOldLogs();
      break;
    case "rotate":
      logManager.rotateLogs();
      break;
    case "stats":
      const stats = logManager.getLogStats();
      console.log("📊 Log Statistics:");
      console.log(JSON.stringify(stats, null, 2));
      break;
    default:
      console.log("Usage: { { { { node log-manager.js [cleanup|rotate|stats]") & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
      console.log("  cleanup - Remove old log files");
      console.log("  rotate  - Rotate large log files");
      console.log("  stats   - Show log statistics");
  }
}
