#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs'); const path = require('path');

const projectRoot = "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const patchesPrimary = "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions";
const patchesFallback = "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6";
const backupsRoot = "/Users/sawyer/gitSync/_backups/tm-safety_backups";
const outDir = backupsRoot;
fs.mkdirSync(outDir, { recursive: true });
const ts = new Date().toISOString().replace(/[:.]/g,'-');
const outFile = path.join(outDir, `ROLLBACKSAFE_P66_${ts}.tar.gz`);

// Use BSD tar-compatible invocation: -C to a common root and include relative paths
const root = "/Users/sawyer/gitSync";
const includeRel = [
  "tm-mobile-cursor/mobile-native-fresh",
  fs.existsSync(patchesPrimary) ? ".cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions" : ".cursor-cache/MAIN/patches/phase-6.6",
  ".cursor-cache/MAIN/validation",
  ".cursor-cache/MAIN/summaries"
];

const args = [
  "-czf", outFile,
  "--exclude=.git",
  "--exclude=node_modules",
  "--exclude=_backups",
  "-C", root
].concat(includeRel);

const r = spawnSync("tar", args, { stdio: "inherit" });
if (r.status !== 0) { console.error("tar failed"); process.exit(r.status); }

const manifestPath = path.join(outDir, `ROLLBACKSAFE_P66_${ts}.json`);
fs.writeFileSync(manifestPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  archive: outFile,
  root: root,
  includesRelative: includeRel
}, null, 2));
console.log("backup_created:", outFile);


