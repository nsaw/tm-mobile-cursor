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

const includeList = [
  projectRoot,
  fs.existsSync(patchesPrimary) ? patchesPrimary : patchesFallback,
  "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation",
  "/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries"
].filter(Boolean);

const args = ["-czf", outFile, "--exclude=.git", "--exclude=node_modules", "--absolute-names"].concat(includeList);
const r = spawnSync("tar", args, { stdio: "inherit" });
if (r.status !== 0) { console.error("tar failed"); process.exit(r.status); }

const manifestPath = path.join(outDir, `ROLLBACKSAFE_P66_${ts}.json`);
fs.writeFileSync(manifestPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  archive: outFile,
  includes: includeList
}, null, 2));
console.log("backup_created:", outFile);


