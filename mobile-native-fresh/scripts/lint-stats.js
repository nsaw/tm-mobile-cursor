#!/usr/bin/env node
/**
 * Lint Statistics and Monitoring System
 *
 * Features:
 * - Error categorization
 * - Fix success rates
 * - Performance metrics
 * - Trend analysis
 * - Real-time monitoring
 */

const fs = require("fs");
const path = require("path");
const { Logger } = require("./logging.js");

class LintStats {
  constructor() {
    this.logger = new Logger("lint-stats");
    this.statsFile = path.join(process.cwd(), "logs", "lint_stats.json");
    this.stats = this.loadStats();
  }

  loadStats() {
    try {
      if (fs.existsSync(this.statsFile)) {
        return JSON.parse(fs.readFileSync(this.statsFile, "utf8"));
      }
    } catch (error) {
      this.logger.error(`Failed to load stats: ${error.message}`);
    }

    return {
      totalRuns: 0,
      totalErrors: 0,
      totalFixes: 0,
      totalFiles: 0,
      errorsByType: {},
      errorsByFile: {},
      fixSuccessRate: 0,
      averageFixTime: 0,
      performance: {
        totalTime: 0,
        averageTime: 0,
        fastestRun: Infinity,
        slowestRun: 0,
      },
      trends: {
        daily: {},
        weekly: {},
        monthly: {},
      },
      lastRun: null,
      createdAt: new Date().toISOString(),
    };
  }

  saveStats() {
    try {
      const statsDir = path.dirname(this.statsFile);
      if (!fs.existsSync(statsDir)) {
        fs.mkdirSync(statsDir, { recursive: true });
      }

      fs.writeFileSync(this.statsFile, JSON.stringify(this.stats, null, 2));
      this.logger.info("Statistics saved");
    } catch (error) {
      this.logger.error(`Failed to save stats: ${error.message}`);
    }
  }

  recordRun(results) {
    const startTime = Date.now();

    this.stats.totalRuns++;
    this.stats.lastRun = new Date().toISOString();

    // Record errors
    if (results.errors) {
      this.stats.totalErrors += results.errors.length;

      for (const error of results.errors) {
        // Categorize by error type
        const errorType = error.rule || "unknown";
        this.stats.errorsByType[errorType] =
          (this.stats.errorsByType[errorType] || 0) + 1;

        // Categorize by file
        const fileName = path.basename(error.filePath || "unknown");
        this.stats.errorsByFile[fileName] =
          (this.stats.errorsByFile[fileName] || 0) + 1;
      }
    }

    // Record fixes
    if (results.fixes) {
      this.stats.totalFixes += results.fixes.length;
    }

    // Record files processed
    if (results.filesProcessed) {
      this.stats.totalFiles += results.filesProcessed;
    }

    // Calculate performance metrics
    const runTime = Date.now() - startTime;
    this.stats.performance.totalTime += runTime;
    this.stats.performance.averageTime =
      this.stats.performance.totalTime / this.stats.totalRuns;

    if (runTime < this.stats.performance.fastestRun) {
      this.stats.performance.fastestRun = runTime;
    }

    if (runTime > this.stats.performance.slowestRun) {
      this.stats.performance.slowestRun = runTime;
    }

    // Calculate fix success rate
    if (this.stats.totalErrors > 0) {
      this.stats.fixSuccessRate =
        (this.stats.totalFixes / this.stats.totalErrors) * 100;
    }

    // Update trends
    this.updateTrends();

    this.saveStats();
    this.logger.info(
      `Run recorded: ${results.errors?.length || 0} errors, ${results.fixes?.length || 0} fixes`,
    );
  }

  updateTrends() {
    const now = new Date();
    const dateKey = now.toISOString().split("T")[0];
    const weekKey = this.getWeekKey(now);
    const monthKey = now.toISOString().substring(0, 7);

    // Daily trends
    if (!this.stats.trends.daily[dateKey]) {
      this.stats.trends.daily[dateKey] = {
        errors: 0,
        fixes: 0,
        runs: 0,
      };
    }

    this.stats.trends.daily[dateKey].runs++;

    // Weekly trends
    if (!this.stats.trends.weekly[weekKey]) {
      this.stats.trends.weekly[weekKey] = {
        errors: 0,
        fixes: 0,
        runs: 0,
      };
    }

    this.stats.trends.weekly[weekKey].runs++;

    // Monthly trends
    if (!this.stats.trends.monthly[monthKey]) {
      this.stats.trends.monthly[monthKey] = {
        errors: 0,
        fixes: 0,
        runs: 0,
      };
    }

    this.stats.trends.monthly[monthKey].runs++;
  }

  getWeekKey(date) {
    const year = date.getFullYear();
    const week = Math.ceil((date.getDate() + date.getDay()) / 7);
    return `${year}-W${week.toString().padStart(2, "0")}`;
  }

  getSummary() {
    const summary = {
      overview: {
        totalRuns: this.stats.totalRuns,
        totalErrors: this.stats.totalErrors,
        totalFixes: this.stats.totalFixes,
        totalFiles: this.stats.totalFiles,
        fixSuccessRate: this.stats.fixSuccessRate.toFixed(2) + "%",
        averageFixTime: this.stats.performance.averageTime.toFixed(2) + "ms",
      },
      performance: {
        fastestRun: this.stats.performance.fastestRun + "ms",
        slowestRun: this.stats.performance.slowestRun + "ms",
        averageTime: this.stats.performance.averageTime.toFixed(2) + "ms",
      },
      topErrors: this.getTopErrors(),
      topFiles: this.getTopFiles(),
      recentTrends: this.getRecentTrends(),
    };

    return summary;
  }

  getTopErrors(limit = 10) {
    return Object.entries(this.stats.errorsByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([rule, count]) => ({ rule, count }));
  }

  getTopFiles(limit = 10) {
    return Object.entries(this.stats.errorsByFile)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([file, count]) => ({ file, count }));
  }

  getRecentTrends(days = 7) {
    const trends = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      trends.push({
        date: dateKey,
        runs: this.stats.trends.daily[dateKey]?.runs || 0,
        errors: this.stats.trends.daily[dateKey]?.errors || 0,
        fixes: this.stats.trends.daily[dateKey]?.fixes || 0,
      });
    }

    return trends;
  }

  generateReport() {
    const summary = this.getSummary();

    const report = `
# Lint Statistics Report
Generated: ${new Date().toISOString()}

## Overview
- Total Runs: ${summary.overview.totalRuns}
- Total Errors: ${summary.overview.totalErrors}
- Total Fixes: ${summary.overview.totalFixes}
- Total Files: ${summary.overview.totalFiles}
- Fix Success Rate: ${summary.overview.fixSuccessRate}
- Average Fix Time: ${summary.overview.averageFixTime}

## Performance
- Fastest Run: ${summary.performance.fastestRun}
- Slowest Run: ${summary.performance.slowestRun}
- Average Time: ${summary.performance.averageTime}

## Top Error Types
${summary.topErrors.map(({ rule, count }) => `- ${rule}: ${count}`).join("\n")}

## Top Problem Files
${summary.topFiles.map(({ file, count }) => `- ${file}: ${count}`).join("\n")}

## Recent Trends (Last 7 Days)
${summary.recentTrends
  .map(
    (day) =>
      `- ${day.date}: ${day.runs} runs, ${day.errors} errors, ${day.fixes} fixes`,
  )
  .join("\n")}
`;

    return report;
  }

  exportToFile(filename = null) {
    const report = this.generateReport();
    const reportFile =
      filename ||
      path.join(
        process.cwd(),
        "logs",
        `lint_report_${new Date().toISOString().split("T")[0]}.md`,
      );

    try {
      const reportDir = path.dirname(reportFile);
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }

      fs.writeFileSync(reportFile, report);
      this.logger.success(`Report exported to: ${reportFile}`);
      return reportFile;
    } catch (error) {
      this.logger.error(`Failed to export report: ${error.message}`);
      return null;
    }
  }

  reset() {
    this.stats = {
      totalRuns: 0,
      totalErrors: 0,
      totalFixes: 0,
      totalFiles: 0,
      errorsByType: {},
      errorsByFile: {},
      fixSuccessRate: 0,
      averageFixTime: 0,
      performance: {
        totalTime: 0,
        averageTime: 0,
        fastestRun: Infinity,
        slowestRun: 0,
      },
      trends: {
        daily: {},
        weekly: {},
        monthly: {},
      },
      lastRun: null,
      createdAt: new Date().toISOString(),
    };

    this.saveStats();
    this.logger.info("Statistics reset");
  }
}

// CLI Interface
async function main() {
  const command = process.argv[2];
  const stats = new LintStats();

  switch (command) {
    case "summary":
      console.log(JSON.stringify(stats.getSummary(), null, 2));
      break;

    case "report":
      console.log(stats.generateReport());
      break;

    case "export":
      const filename = process.argv[3];
      const reportFile = stats.exportToFile(filename);
      if (reportFile) {
        console.log(`Report exported to: ${reportFile}`);
      }
      break;

    case "reset":
      stats.reset();
      console.log("Statistics reset");
      break;

    default:
      console.log(`
Lint Statistics System

Usage:
  node scripts/lint-stats.js <command>

Commands:
  summary  - Show statistics summary
  report   - Generate detailed report
  export   - Export report to file
  reset    - Reset all statistics

Examples:
  node scripts/lint-stats.js summary
  node scripts/lint-stats.js report
  node scripts/lint-stats.js export
  node scripts/lint-stats.js reset
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { LintStats };
