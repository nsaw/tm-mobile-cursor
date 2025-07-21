/**
 * Logging Module for AutoLinter
 *
 * Provides structured logging with different levels and output formats
 */

const fs = require("fs");
const path = require("path");

class Logger {
  constructor(module = "autolinter") {
    this.module = module;
    this.logDir = path.join(process.cwd(), "logs");

    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    this.logFile = path.join(this.logDir, `${module}.log`);
  }

  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${this.module}] ${message}`;
  }

  writeToFile(message) {
    try {
      fs.appendFileSync(this.logFile, message + "\n");
    } catch (error) {
      console.error(`Failed to write to log file: ${error.message}`);
    }
  }

  info(message) {
    const formatted = this.formatMessage("info", message);
    console.log(formatted);
    this.writeToFile(formatted);
  }

  warn(message) {
    const formatted = this.formatMessage("warn", message);
    console.warn(formatted);
    this.writeToFile(formatted);
  }

  error(message) {
    const formatted = this.formatMessage("error", message);
    console.error(formatted);
    this.writeToFile(formatted);
  }

  debug(message) {
    if (process.env.DEBUG) {
      const formatted = this.formatMessage("debug", message);
      console.log(formatted);
      this.writeToFile(formatted);
    }
  }

  success(message) {
    const formatted = this.formatMessage("success", message);
    console.log(`✅ ${formatted}`);
    this.writeToFile(formatted);
  }

  getLogPath() {
    return this.logFile;
  }

  clear() {
    try {
      fs.writeFileSync(this.logFile, "");
      this.info("Log file cleared");
    } catch (error) {
      console.error(`Failed to clear log file: ${error.message}`);
    }
  }
}

module.exports = { Logger };
