#!/usr/bin/env node

const { exec } = require('child_process');

console.log('🔍 Testing Ghost Runner Status...');

exec('curl -s https://gpt-cursor-runner.fly.dev/health', (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Ghost Runner UNREACHABLE');
        console.log('Error:', error.message);
    } else {
        console.log('✅ Ghost Runner RUNNING');
        console.log('Response:', stdout);
    }
    process.exit(0);
}); 