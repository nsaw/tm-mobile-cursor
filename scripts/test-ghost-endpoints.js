#!/usr/bin/env { { { { node

const http = require('http') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
const url = require('url');

// Simple test server that mimics the gpt-cursor-runner endpoints
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    
    console.log(`Received request: ${req.method} ${path}`);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    let response = {};
    
    switch (path) {
        case '/health':
            response = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            break;
            
        case '/api/patches':
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        console.log('Received patch data:', data);
                        response = {
                            status: 'success',
                            message: 'Patch received successfully',
                            data: data
                        };
                        res.writeHead(200);
                        res.end(JSON.stringify(response));
                    } catch (error) {
                        response = {
                            status: 'error',
                            message: 'Invalid JSON data'
                        };
                        res.writeHead(400);
                        res.end(JSON.stringify(response));
                    }
                });
                return;
            }
            break;
            
        case '/api/summaries':
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        console.log('Received summary data:', data);
                        response = {
                            status: 'success',
                            message: 'Summary received successfully',
                            data: data
                        };
                        res.writeHead(200);
                        res.end(JSON.stringify(response));
                    } catch (error) {
                        response = {
                            status: 'error',
                            message: 'Invalid JSON data'
                        };
                        res.writeHead(400);
                        res.end(JSON.stringify(response));
                    }
                });
                return;
            }
            break;
            
        default:
            response = {
                status: 'error',
                message: 'Endpoint not found'
            };
            res.writeHead(404);
            res.end(JSON.stringify(response));
            return;
    }
    
    res.writeHead(200);
    res.end(JSON.stringify(response));
});

const PORT = 5052;
server.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`Health endpoint: http://localhost:${PORT}/health`);
    console.log(`Patches endpoint: http://localhost:${PORT}/api/patches`);
    console.log(`Summaries endpoint: http://localhost:${PORT}/api/summaries`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down test server...');
    server.close(() => {
        console.log('Test server stopped');
        process.exit(0);
    });
}); 