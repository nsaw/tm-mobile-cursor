#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const puppeteer = require('puppeteer');

class ScreenCaptureVerifier {
    constructor() {
        this.projectRoot = process.cwd();
        this.capturesDir = path.join(this.projectRoot, 'mobile-native-fresh', 'captures');
        this.verificationDir = path.join(this.projectRoot, 'mobile-native-fresh', 'verification');
        this.logsDir = path.join(this.projectRoot, 'logs');
        
        // Ensure directories exist
        this.ensureDirectories();
        
        // Load configuration from verification-config.json
        this.loadConfiguration();
        
        // Configuration
        this.config = {
            captureTypes: ['app-load', 'content-load', 'dashboard'],
            verificationTimeout: 30000, // 30 seconds
            retryAttempts: 3,
            screenshotQuality: 80,
            viewports: {
                iphone16pro: { width: 402, height: 874, name: 'iPhone 16 Pro' },
                iphone16promax: { width: 440, height: 956, name: 'iPhone 16 Pro Max' }
            },
            defaultViewport: 'iphone16pro',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        };
    }

    loadConfiguration() {
        try {
            const configPath = path.join(this.projectRoot, 'verification-config.json');
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.screenCapture) {
                    this.config = { ...this.config, ...config.screenCapture };
                }
            }
        } catch (error) {
            console.log('Using default configuration, could not load verification-config.json');
        }
    }

    ensureDirectories() {
        const dirs = [this.capturesDir, this.verificationDir, this.logsDir];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    async log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${level}: ${message}\n`;
        const logFile = path.join(this.logsDir, 'screen-capture-verifier.log');
        
        fs.appendFileSync(logFile, logEntry);
        console.log(`[${timestamp}] ${level}: ${message}`);
    }

    async captureAppLoad(viewportKey = null) {
        try {
            const viewport = viewportKey ? this.config.viewports[viewportKey] : this.config.viewports[this.config.defaultViewport];
            const viewportName = viewport.name || viewportKey || this.config.defaultViewport;
            
            await this.log(`Starting app load capture for ${viewportName}...`);
            
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            await page.setViewport(viewport);
            await page.setUserAgent(this.config.userAgent);
            
            // Navigate to Expo development server
            const expoUrl = 'http://localhost:4000';
            await page.goto(expoUrl, { waitUntil: 'networkidle0', timeout: 10000 });
            
            // Wait for app to load
            await page.waitForSelector('[data-testid="app-loaded"]', { timeout: 15000 })
                .catch(() => this.log('App load indicator not found, proceeding anyway', 'WARN'));
            
            // Capture screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `app-load-${viewportName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.png`;
            const filepath = path.join(this.capturesDir, filename);
            
            await page.screenshot({
                path: filepath,
                fullPage: true
            });
            
            await browser.close();
            
            await this.log(`App load capture saved: ${filename}`);
            return { success: true, filepath, filename, viewport: viewportName };
            
        } catch (error) {
            await this.log(`App load capture failed: ${error.message}`, 'ERROR');
            return { success: false, error: error.message };
        }
    }

    async captureContentLoad(viewportKey = null) {
        try {
            const viewport = viewportKey ? this.config.viewports[viewportKey] : this.config.viewports[this.config.defaultViewport];
            const viewportName = viewport.name || viewportKey || this.config.defaultViewport;
            
            await this.log(`Starting content load capture for ${viewportName}...`);
            
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            await page.setViewport(viewport);
            await page.setUserAgent(this.config.userAgent);
            
            // Navigate to Expo development server
            const expoUrl = 'http://localhost:4000';
            await page.goto(expoUrl, { waitUntil: 'networkidle0', timeout: 10000 });
            
            // Wait for content to load (thoughtmarks, bins, etc.)
            await page.waitForSelector('[data-testid="content-loaded"]', { timeout: 15000 })
                .catch(() => this.log('Content load indicator not found, proceeding anyway', 'WARN'));
            
            // Scroll to trigger content loading
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            
            // Wait a bit for content to load
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Capture screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `content-load-${viewportName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.png`;
            const filepath = path.join(this.capturesDir, filename);
            
            await page.screenshot({
                path: filepath,
                fullPage: true
            });
            
            await browser.close();
            
            await this.log(`Content load capture saved: ${filename}`);
            return { success: true, filepath, filename, viewport: viewportName };
            
        } catch (error) {
            await this.log(`Content load capture failed: ${error.message}`, 'ERROR');
            return { success: false, error: error.message };
        }
    }

    async captureDashboard(viewportKey = null) {
        try {
            const viewport = viewportKey ? this.config.viewports[viewportKey] : this.config.viewports[this.config.defaultViewport];
            const viewportName = viewport.name || viewportKey || this.config.defaultViewport;
            
            await this.log(`Starting dashboard capture for ${viewportName}...`);
            
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            await page.setViewport(viewport);
            await page.setUserAgent(this.config.userAgent);
            
            // Navigate to Expo development server
            const expoUrl = 'http://localhost:4000';
            await page.goto(expoUrl, { waitUntil: 'networkidle0', timeout: 10000 });
            
            // Wait for dashboard to load
            await page.waitForSelector('[data-testid="dashboard"]', { timeout: 15000 })
                .catch(() => this.log('Dashboard indicator not found, proceeding anyway', 'WARN'));
            
            // Wait for dashboard content
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Capture screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `dashboard-${viewportName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.png`;
            const filepath = path.join(this.capturesDir, filename);
            
            await page.screenshot({
                path: filepath,
                fullPage: true
            });
            
            await browser.close();
            
            await this.log(`Dashboard capture saved: ${filename}`);
            return { success: true, filepath, filename, viewport: viewportName };
            
        } catch (error) {
            await this.log(`Dashboard capture failed: ${error.message}`, 'ERROR');
            return { success: false, error: error.message };
        }
    }

    async captureAllScreens() {
        await this.log('Starting comprehensive screen capture verification for all viewports...');
        
        const results = {
            timestamp: new Date().toISOString(),
            captures: {},
            summary: { success: 0, failed: 0, total: 0 }
        };
        
        // Get all viewport keys
        const viewportKeys = Object.keys(this.config.viewports);
        
        // Capture each screen type for each viewport
        const captureMethods = [
            { name: 'app-load', method: (viewportKey) => this.captureAppLoad(viewportKey) },
            { name: 'content-load', method: (viewportKey) => this.captureContentLoad(viewportKey) },
            { name: 'dashboard', method: (viewportKey) => this.captureDashboard(viewportKey) }
        ];
        
        for (const viewportKey of viewportKeys) {
            const viewportName = this.config.viewports[viewportKey].name || viewportKey;
            await this.log(`Capturing for viewport: ${viewportName}`);
            
            results.captures[viewportKey] = {};
            
            for (const capture of captureMethods) {
                await this.log(`Capturing ${capture.name} for ${viewportName}...`);
                
                let attempt = 0;
                let result = null;
                
                while (attempt < this.config.retryAttempts && !result?.success) {
                    attempt++;
                    if (attempt > 1) {
                        await this.log(`Retry attempt ${attempt} for ${capture.name} on ${viewportName}...`);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    
                    result = await capture.method(viewportKey);
                }
                
                results.captures[viewportKey][capture.name] = result;
                
                if (result.success) {
                    results.summary.success++;
                    await this.log(`✅ ${capture.name} capture successful for ${viewportName}`);
                } else {
                    results.summary.failed++;
                    await this.log(`❌ ${capture.name} capture failed for ${viewportName}: ${result.error}`, 'ERROR');
                }
                
                results.summary.total++;
            }
        }
        
        // Save verification report
        const reportPath = path.join(this.verificationDir, `verification-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
        
        await this.log(`Verification report saved: ${reportPath}`);
        await this.log(`Capture summary: ${results.summary.success}/${results.summary.total} successful`);
        
        return results;
    }

    async generateVerificationRequest(captures) {
        const timestamp = new Date().toISOString();
        const requestId = `verification-${timestamp.replace(/[:.]/g, '-')}`;
        
        const verificationRequest = {
            id: requestId,
            timestamp: timestamp,
            type: 'screen-capture-verification',
            captures: captures,
            instructions: {
                human: [
                    'Review the captured screenshots for visual integrity',
                    'Check for proper app loading, content display, and dashboard functionality',
                    'Verify no blank screens, broken layouts, or visual regressions',
                    'Confirm all UI elements are visible and properly positioned'
                ],
                gpt: [
                    'Analyze screenshots for visual consistency and UI integrity',
                    'Check for proper component rendering and layout structure',
                    'Verify navigation elements and interactive components',
                    'Identify any visual regressions or broken UI elements'
                ]
            },
            status: 'pending',
            requiresApproval: true
        };
        
        const requestPath = path.join(this.verificationDir, `${requestId}.json`);
        fs.writeFileSync(requestPath, JSON.stringify(verificationRequest, null, 2));
        
        await this.log(`Verification request generated: ${requestId}`);
        return verificationRequest;
    }

    async waitForVerification(requestId, timeout = this.config.verificationTimeout) {
        await this.log(`Waiting for verification approval: ${requestId}`);
        
        const startTime = Date.now();
        const requestPath = path.join(this.verificationDir, `${requestId}.json`);
        
        while (Date.now() - startTime < timeout) {
            if (fs.existsSync(requestPath)) {
                const request = JSON.parse(fs.readFileSync(requestPath, 'utf8'));
                
                if (request.status === 'approved') {
                    await this.log(`✅ Verification approved: ${requestId}`);
                    return { approved: true, request };
                } else if (request.status === 'rejected') {
                    await this.log(`❌ Verification rejected: ${requestId}`, 'ERROR');
                    return { approved: false, request };
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        await this.log(`⏰ Verification timeout: ${requestId}`, 'WARN');
        return { approved: false, timeout: true };
    }

    async runVerificationWorkflow() {
        try {
            await this.log('Starting screen capture verification workflow...');
            
            // Step 1: Capture all screens
            const captureResults = await this.captureAllScreens();
            
            if (captureResults.summary.failed > 0) {
                await this.log(`⚠️ Some captures failed, but proceeding with verification`, 'WARN');
            }
            
            // Step 2: Generate verification request
            const successfulCaptures = Object.entries(captureResults.captures)
                .filter(([key, result]) => result.success)
                .reduce((acc, [key, result]) => {
                    acc[key] = result;
                    return acc;
                }, {});
            
            const verificationRequest = await this.generateVerificationRequest(successfulCaptures);
            
            // Step 3: Wait for verification approval
            const verificationResult = await this.waitForVerification(verificationRequest.id);
            
            // Step 4: Return result
            const finalResult = {
                success: verificationResult.approved,
                captures: captureResults,
                verification: verificationResult,
                timestamp: new Date().toISOString()
            };
            
            if (verificationResult.approved) {
                await this.log('✅ Screen capture verification completed successfully');
            } else {
                await this.log('❌ Screen capture verification failed or was rejected', 'ERROR');
            }
            
            return finalResult;
            
        } catch (error) {
            await this.log(`Verification workflow failed: ${error.message}`, 'ERROR');
            return { success: false, error: error.message };
        }
    }

    async cleanupOldCaptures(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
        try {
            await this.log('Cleaning up old captures...');
            
            const files = fs.readdirSync(this.capturesDir);
            const now = Date.now();
            let cleaned = 0;
            
            for (const file of files) {
                const filePath = path.join(this.capturesDir, file);
                const stats = fs.statSync(filePath);
                
                if (now - stats.mtime.getTime() > maxAge) {
                    fs.unlinkSync(filePath);
                    cleaned++;
                }
            }
            
            await this.log(`Cleaned up ${cleaned} old capture files`);
            
        } catch (error) {
            await this.log(`Cleanup failed: ${error.message}`, 'ERROR');
        }
    }
}

// CLI usage
if (require.main === module) {
    const verifier = new ScreenCaptureVerifier();
    const command = process.argv[2];
    
    switch (command) {
        case 'capture-all':
            verifier.captureAllScreens().then(results => {
                console.log(JSON.stringify(results, null, 2));
            });
            break;
        case 'verify':
            verifier.runVerificationWorkflow().then(results => {
                console.log(JSON.stringify(results, null, 2));
            });
            break;
        case 'cleanup':
            verifier.cleanupOldCaptures().then(() => {
                console.log('Cleanup completed');
            });
            break;
        case 'capture-app-load':
            verifier.captureAppLoad().then(results => {
                console.log(JSON.stringify(results, null, 2));
            });
            break;
        case 'capture-content-load':
            verifier.captureContentLoad().then(results => {
                console.log(JSON.stringify(results, null, 2));
            });
            break;
        case 'capture-dashboard':
            verifier.captureDashboard().then(results => {
                console.log(JSON.stringify(results, null, 2));
            });
            break;
        default:
            console.log('Usage: node screen-capture-verifier.js [capture-all|verify|cleanup|capture-app-load|capture-content-load|capture-dashboard]');
    }
}

module.exports = ScreenCaptureVerifier; 