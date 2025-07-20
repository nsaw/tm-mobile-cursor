const fs = require('fs');
const path = require('path');
const patchDir = path.resolve(__dirname, '../../tasks/patches');
const summaryDir = path.resolve(__dirname, '../../tasks/summaries');
const patchFiles = fs.readdirSync(patchDir).filter(f => f.endsWith('.json'));
const summaryFiles = fs.readdirSync(summaryDir).filter(f => f.endsWith('.md'));
const missing = patchFiles.filter(pf => !summaryFiles.some(sf => sf.includes(pf.split('.json')[0])));
console.log('🔍 Missing Executions:', missing);
