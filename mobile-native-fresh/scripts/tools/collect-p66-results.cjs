#!/usr/bin/env node
const fs = require('fs'); const path = require('path');
const ROOT = "/Users/sawyer/gitSync/.cursor-cache/MAIN";
const verify = path.join(ROOT, "validation/p6.6-ordering-verification.json");
const manifest = path.join(ROOT, "validation/p6.6-compliance-manifest.json");
const state = path.join(ROOT, "validation/p66-execution.state.json");
const out = path.join(ROOT, "validation/p66-postexec-report.json");
const data = {
  generatedAt: new Date().toISOString(),
  verify: fs.existsSync(verify) ? JSON.parse(fs.readFileSync(verify,'utf8')) : null,
  manifest: fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest,'utf8')) : null,
  state: fs.existsSync(state) ? JSON.parse(fs.readFileSync(state,'utf8')) : null,
  artifacts: {
    jest: "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/jest-results.json",
    maestro: "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/test-results/maestro.xml",
    detox: "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/visual"
  }
};
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(data, null, 2));
console.log("postexec_report:", out);


