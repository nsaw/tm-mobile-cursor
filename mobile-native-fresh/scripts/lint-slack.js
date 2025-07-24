#!/usr/bin/env { { { { node
/** & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
 * Slack Integration for Linting
 *
 * Features:
 * - Error notifications
 * - Fix confirmations
 * - Statistics reports
 * - Team collaboration
 */

const fs = require("fs");
const path = require("path");

const { Logger } = require("./logging.js");

class LintSlack {
  constructor() {
    this.logger = new Logger("lint-slack");
    this.config = this.loadConfig();
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL || this.config.webhook_url;
  }

  loadConfig() {
    try {
      const configPath = path.join(process.cwd(), "slack-config.json");
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, "utf8"));
      }
    } catch (error) {
      this.logger.error(`Failed to load Slack config: ${error.message}`);
    }

    return {
      webhook_url: process.env.SLACK_WEBHOOK_URL,
      channel: "#linting",
      username: "LintBot",
      icon_emoji: ":robot_face:",
      notifications: {
        errors: true,
        fixes: true,
        reports: true,
        warnings: false,
      },
    };
  }

  async sendMessage(message) {
    if (!this.webhookUrl) {
      this.logger.warn("No Slack webhook URL configured");
      return false;
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: this.config.channel,
          username: this.config.username,
          icon_emoji: this.config.icon_emoji,
          ...message,
        }),
      });

      if (response.ok) {
        this.logger.info("Slack message sent");
        return true;
      } else {
        this.logger.error(`Slack API error: ${response.status}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Failed to send Slack message: ${error.message}`);
      return false;
    }
  }

  async notifyErrors(errors, context = {}) {
    if (!this.config.notifications.errors) {
      return;
    }

    const errorCount = errors.length;
    const color =
      errorCount > 10 ? "#e74c3c" : errorCount > 5 ? "#f39c12" : "#3498db";

    const attachments = errors.slice(0, 10).map((error) => ({
      color: "#e74c3c",
      title: `${error.file}:${error.line}:${error.column}`,
      text: error.message,
      fields: [
        {
          title: "Rule",
          value: error.rule || "unknown",
          short: true,
        },
        {
          title: "Severity",
          value: error.severity || "error",
          short: true,
        },
      ],
    }));

    const message = {
      text: `:warning: *${errorCount} lint errors found*`,
      attachments: [
        {
          color: color,
          title: "Lint Errors",
          text:
            context.summary ||
            `Found ${errorCount} errors in ${context.filesProcessed || 0} files`,
          fields: [
            {
              title: "Project",
              value: context.project || "Unknown",
              short: true,
            },
            {
              title: "Files Processed",
              value: context.filesProcessed || 0,
              short: true,
            },
          ],
          footer: "AutoLinter",
        },
        ...attachments,
      ],
    };

    return this.sendMessage(message);
  }

  async notifyFixes(fixes, context = {}) {
    if (!this.config.notifications.fixes) {
      return;
    }

    const fixCount = fixes.length;
    const color = "#27ae60";

    const attachments = fixes.slice(0, 10).map((fix) => ({
      color: "#27ae60",
      title: `${fix.file}:${fix.line}:${fix.column}`,
      text: fix.message,
      fields: [
        {
          title: "Rule",
          value: fix.rule || "unknown",
          short: true,
        },
        {
          title: "Auto-fixed",
          value: "Yes",
          short: true,
        },
      ],
    }));

    const message = {
      text: `:white_check_mark: *${fixCount} lint errors auto-fixed*`,
      attachments: [
        {
          color: color,
          title: "Auto-fixes Applied",
          text:
            context.summary ||
            `Fixed ${fixCount} errors in ${context.filesProcessed || 0} files`,
          fields: [
            {
              title: "Project",
              value: context.project || "Unknown",
              short: true,
            },
            {
              title: "Files Processed",
              value: context.filesProcessed || 0,
              short: true,
            },
          ],
          footer: "AutoLinter",
        },
        ...attachments,
      ],
    };

    return this.sendMessage(message);
  }

  async notifyReport(stats, context = {}) {
    if (!this.config.notifications.reports) {
      return;
    }

    const successRate = stats.fixSuccessRate || 0;
    const color =
      successRate > 80 ? "#27ae60" : successRate > 60 ? "#f39c12" : "#e74c3c";

    const message = {
      text: `:bar_chart: *Lint Statistics Report*`,
      attachments: [
        {
          color: color,
          title: "Lint Statistics",
          text: context.summary || "Weekly linting statistics",
          fields: [
            {
              title: "Total Runs",
              value: stats.totalRuns || 0,
              short: true,
            },
            {
              title: "Total Errors",
              value: stats.totalErrors || 0,
              short: true,
            },
            {
              title: "Total Fixes",
              value: stats.totalFixes || 0,
              short: true,
            },
            {
              title: "Success Rate",
              value: `${successRate.toFixed(1)}%`,
              short: true,
            },
            {
              title: "Average Time",
              value: `${stats.averageFixTime || 0}ms`,
              short: true,
            },
            {
              title: "Files Processed",
              value: stats.totalFiles || 0,
              short: true,
            },
          ],
          footer: "AutoLinter",
        },
      ],
    };

    return this.sendMessage(message);
  }

  async notifyWarning(warning, context = {}) {
    if (!this.config.notifications.warnings) {
      return;
    }

    const message = {
      text: `:warning: *${warning.title || "Lint Warning"}*`,
      attachments: [
        {
          color: "#f39c12",
          title: warning.title || "Warning",
          text: warning.message || warning,
          fields: context.fields || [],
          footer: "AutoLinter",
        },
      ],
    };

    return this.sendMessage(message);
  }

  async sendDailyReport(stats) {
    const today = new Date().toISOString().split("T")[0];
    const recentTrends = stats.recentTrends || [];
    const todayStats = recentTrends.find((day) => day.date === today);

    if (!todayStats) {
      return this.notifyWarning({
        title: "No Data Available",
        message: "No linting activity recorded for today",
      });
    }

    const context = {
      summary: `Daily linting report for ${today}`,
      fields: [
        {
          title: "Runs Today",
          value: todayStats.runs,
          short: true,
        },
        {
          title: "Errors Today",
          value: todayStats.errors,
          short: true,
        },
        {
          title: "Fixes Today",
          value: todayStats.fixes,
          short: true,
        },
      ],
    };

    return this.notifyReport(stats, context);
  }

  async sendWeeklyReport(stats) {
    const weekStats = stats.trends?.weekly || {};
    const weekKeys = Object.keys(weekStats).sort().slice(-1);

    if (weekKeys.length === 0) {
      return this.notifyWarning({
        title: "No Weekly Data",
        message: "No weekly linting data available",
      });
    }

    const latestWeek = weekKeys[0];
    const weekData = weekStats[latestWeek];

    const context = {
      summary: `Weekly linting report for ${latestWeek}`,
      fields: [
        {
          title: "Week",
          value: latestWeek,
          short: true,
        },
        {
          title: "Runs This Week",
          value: weekData.runs,
          short: true,
        },
        {
          title: "Errors This Week",
          value: weekData.errors,
          short: true,
        },
        {
          title: "Fixes This Week",
          value: weekData.fixes,
          short: true,
        },
      ],
    };

    return this.notifyReport(stats, context);
  }

  async testConnection() {
    const message = {
      text: ":white_check_mark: *Slack integration test successful*",
      attachments: [
        {
          color: "#27ae60",
          title: "Connection Test",
          text: "Slack integration is working correctly",
          fields: [
            {
              title: "Channel",
              value: this.config.channel,
              short: true,
            },
            {
              title: "Bot Name",
              value: this.config.username,
              short: true,
            },
          ],
          footer: "AutoLinter",
        },
      ],
    };

    return this.sendMessage(message);
  }
}

// CLI Interface
async function main() {
  const command = process.argv[2];
  const slack = new LintSlack();

  switch (command) {
    case "test":
      await slack.testConnection();
      break;

    case "errors":
      const errorFile = process.argv[3];
      if (errorFile && fs.existsSync(errorFile)) {
        const errors = JSON.parse(fs.readFileSync(errorFile, "utf8"));
        await slack.notifyErrors(errors, {
          project: "tm-mobile-cursor",
          filesProcessed: errors.length,
        });
      } else {
        console.log(
          "Usage: { { { { node scripts/lint-slack.js errors <error-file.json>", & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        );
      }
      break;

    case "fixes":
      const fixFile = process.argv[3];
      if (fixFile && fs.existsSync(fixFile)) {
        const fixes = JSON.parse(fs.readFileSync(fixFile, "utf8"));
        await slack.notifyFixes(fixes, {
          project: "tm-mobile-cursor",
          filesProcessed: fixes.length,
        });
      } else {
        console.log("Usage: { { { { node scripts/lint-slack.js fixes <fix-file.json>") & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
      }
      break;

    case "report":
      const statsFile = process.argv[3];
      if (statsFile && fs.existsSync(statsFile)) {
        const stats = JSON.parse(fs.readFileSync(statsFile, "utf8"));
        await slack.notifyReport(stats);
      } else {
        console.log(
          "Usage: { { { { node scripts/lint-slack.js report <stats-file.json>", & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        );
      }
      break;

    case "daily":
      const { LintStats } = require("./lint-stats.js");
      const stats = new LintStats();
      await slack.sendDailyReport(stats.getSummary());
      break;

    case "weekly":
      const { LintStats: LintStats2 } = require("./lint-stats.js");
      const stats2 = new LintStats2();
      await slack.sendWeeklyReport(stats2.getSummary());
      break;

    default:
      console.log(`
Slack Lint Integration

Usage:
  { { { { node scripts/lint-slack.js <command> [file] & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

Commands:
  test     - Test Slack connection
  errors   - Send error notification
  fixes    - Send fix notification
  report   - Send statistics report
  daily    - Send daily report
  weekly   - Send weekly report

Examples:
  { { { { node scripts/lint-slack.js test & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  { { { { node scripts/lint-slack.js errors errors.json & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  { { { { node scripts/lint-slack.js fixes fixes.json & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  { { { { node scripts/lint-slack.js report stats.json & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  { { { { node scripts/lint-slack.js daily & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  { { { { node scripts/lint-slack.js weekly & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { LintSlack };
