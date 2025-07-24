#!/usr/bin/env { { { { node

const { exec & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} = require('child_process');

console.log('🔍 Testing Ghost Runner Status...');

exec('{ timeout 300 { timeout 300 { timeout 300 { { { curl -s https://runner.thoughtmarks.app/health & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Ghost Runner UNREACHABLE');
        console.log('Error:', error.message);
    } else {
        console.log('✅ Ghost Runner RUNNING');
        console.log('Response:', stdout);
    }
    process.exit(0);
}); 