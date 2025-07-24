#!/usr/bin/env { { { { node
/** & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
 * Linting Dashboard
 *
 * Features:
 * - Real-time error display
 * - Fix statistics
 * - Performance metrics
 * - Trend visualization
 * - Web-based interface
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

const { Logger } = require("./logging.js");
const { LintStats } = require("./lint-stats.js");

class LintDashboard {
  constructor(port = 3001) {
    this.port = port;
    this.logger = new Logger("lint-dashboard");
    this.stats = new LintStats();
    this.server = null;
    this.clients = new Set();
  }

  start() {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    this.server.listen(this.port, () => {
      this.logger.info(`Dashboard started on http://localhost:${this.port}`);
    });

    // Set up SSE for real-time updates
    this.setupSSE();
  }

  setupSSE() {
    // This would be implemented with a proper SSE endpoint
    // For now, we'll use a simple polling mechanism
  }

  handleRequest(req, res) {
    const url = req.url;

    if (url === "/") {
      this.serveDashboard(res);
    } else if (url === "/api/stats") {
      this.serveStats(res);
    } else if (url === "/api/events") {
      this.serveSSE(res);
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  }

  serveDashboard(res) {
    const html = this.generateDashboardHTML();

    res.writeHead(200, {
      "Content-Type": "text/html",
      "Cache-Control": "no-cache",
    });

    res.end(html);
  }

  serveStats(res) {
    const stats = this.stats.getSummary();

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    });

    res.end(JSON.stringify(stats));
  }

  serveSSE(res) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    const clientId = Date.now();
    this.clients.add(res);

    res.write(
      `data: ${JSON.stringify({ type: "connected", id: clientId })}\n\n`,
    );

    req.on("close", () => {
      this.clients.delete(res);
    });
  }

  generateDashboardHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lint Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .header h1 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .stat-card {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .stat-card h3 {
            color: #7f8c8d;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        
        .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .stat-success { color: #27ae60; }
        .stat-warning { color: #f39c12; }
        .stat-error { color: #e74c3c; }
        
        .chart-container {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .chart-container h2 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        
        .error-list {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .error-item {
            padding: 10px;
            border-left: 4px solid #e74c3c;
            margin-bottom: 10px;
            background: #fdf2f2;
        }
        
        .error-item .file {
            font-weight: bold;
            color: #2c3e50;
        }
        
        .error-item .message {
            color: #7f8c8d;
            margin-top: 5px;
        }
        
        .refresh-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .refresh-btn:hover {
            background: #2980b9;
        }
        
        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 10px;
        }
        
        .status-online { background: #27ae60; }
        .status-offline { background: #e74c3c; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>
                <span class="status-indicator status-online" id="status"></span>
                Lint Dashboard
            </h1>
            <p>Real-time linting statistics and monitoring</p>
            <button class="refresh-btn" onclick="refreshStats()">Refresh</button>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Runs</h3>
                <div class="stat-value" id="totalRuns">-</div>
            </div>
            <div class="stat-card">
                <h3>Total Errors</h3>
                <div class="stat-value stat-error" id="totalErrors">-</div>
            </div>
            <div class="stat-card">
                <h3>Total Fixes</h3>
                <div class="stat-value stat-success" id="totalFixes">-</div>
            </div>
            <div class="stat-card">
                <h3>Success Rate</h3>
                <div class="stat-value stat-success" id="successRate">-</div>
            </div>
        </div>
        
        <div class="chart-container">
            <h2>Recent Activity</h2>
            <canvas id="activityChart" width="400" height="200"></canvas>
        </div>
        
        <div class="error-list">
            <h2>Top Errors</h2>
            <div id="topErrors">Loading...</div>
        </div>
    </div>
    
    <script>
        let stats = {};
        
        async function refreshStats() {
            try {
                const response = await fetch('/api/stats');
                stats = await response.json();
                updateDashboard();
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        }
        
        function updateDashboard() {
            // Update overview stats
            document.getElementById('totalRuns').textContent = stats.overview?.totalRuns || 0;
            document.getElementById('totalErrors').textContent = stats.overview?.totalErrors || 0;
            document.getElementById('totalFixes').textContent = stats.overview?.totalFixes || 0;
document.getElementById('successRate').textContent = stats.overview?.fixSuccessRate || '0%';
            
            // Update top errors
            const topErrorsContainer = document.getElementById('topErrors');
            if (stats.topErrors && stats.topErrors.length > 0) {
                topErrorsContainer.innerHTML = stats.topErrors.map(error => 
                    \`<div class="error-item">
                        <div class="file">\${error.rule}</div>
                        <div class="message">\${error.count} occurrences</div>
                    </div>\`
                ).join('');
            } else {
                topErrorsContainer.innerHTML = '<p>No errors found</p>';
            }
            
            // Update status
            const statusIndicator = document.getElementById('status');
            statusIndicator.className = 'status-indicator status-online';
        }
        
        // Auto-refresh every 5 seconds
        setInterval(refreshStats, 5000);
        
        // Initial load
        refreshStats();
    </script>
</body>
</html>
    `;
  }

  broadcastEvent(event) {
    this.clients.forEach((client) => {
      client.write(`data: ${JSON.stringify(event)}\n\n`);
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.logger.info("Dashboard stopped");
    }
  }

  getStatus() {
    return {
      isRunning: this.server !== null,
      port: this.port,
      clients: this.clients.size,
    };
  }
}

// CLI Interface
async function main() {
  const command = process.argv[2];
  const port = parseInt(process.argv[3]) || 3001;
  const dashboard = new LintDashboard(port);

  switch (command) {
    case "start":
      dashboard.start();
      break;

    case "stop":
      dashboard.stop();
      break;

    case "status":
      console.log(JSON.stringify(dashboard.getStatus(), null, 2));
      break;

    default:
      console.log(`
Lint Dashboard

Usage:
  { { { { node scripts/lint-dashboard.js <command> [port] & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

Commands:
  start   - Start the dashboard server
  stop    - Stop the dashboard server
  status  - Show dashboard status

Examples:
  { { { { node scripts/lint-dashboard.js start & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  { { { { node scripts/lint-dashboard.js start 3002 & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  { { { { node scripts/lint-dashboard.js status & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { LintDashboard };
