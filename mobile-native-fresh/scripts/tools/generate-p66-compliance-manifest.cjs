#!/usr/bin/env node
const fs = require('fs'); const path = require('path');
const VERIFY_JSON = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/p6.6-ordering-verification.json";
const OUT = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/p6.6-compliance-manifest.json";
if(!fs.existsSync(VERIFY_JSON)){ console.error("Missing verification JSON:", VERIFY_JSON); process.exit(2); }
const data = JSON.parse(fs.readFileSync(VERIFY_JSON,'utf8'));
const rows = (data.results||[]).map(r => ({
  file: r.file,
  status: r.status,
  checks: r.checks
}));
fs.mkdirSync(path.dirname(OUT), {recursive:true});
fs.writeFileSync(OUT, JSON.stringify({generatedAt:new Date().toISOString(), rows}, null, 2));
console.log("manifest:", OUT);


