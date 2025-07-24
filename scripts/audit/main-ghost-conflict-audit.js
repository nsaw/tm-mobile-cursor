// Ghost Conflict Audit on MAIN
const fs = require('fs');
const { execSync } = require('child_process');

const riskyFiles = [
  'scripts/ghost-bridge.js',
  'scripts/patch-executor.js',
  'scripts/summary-monitor.js',
  'scripts/validate-runtime.sh',
  'scripts/watchdog/*.js'
];

const cpuCheck = execSync('{ { { { { { ps -Ao pid,pcpu,command | grep node || true & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', { stdio: 'pipe' }), { stdio: 'pipe' }), { stdio: 'pipe' })).toString();
fs.writeFileSync('scripts/audit/main-cpu-processes.log', cpuCheck);

const found = riskyFiles.filter(f => fs.existsSync(f));
if (found.length > 0) {
  console.log('❌ ROGUE GHOST FILES FOUND:');
  found.forEach(f => console.log(' -', f));
  process.exit(1);
} else {
  console.log('✅ No ghost-runner conflict files found on MAIN');
} 