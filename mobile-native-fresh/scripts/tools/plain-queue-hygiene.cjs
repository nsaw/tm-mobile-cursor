#!/usr/bin/env node
const fs = require('fs'); const path = require('path');
const ROOT = "/Users/sawyer/gitSync/.cursor-cache/CYOPS/patches";
const files = (fs.existsSync(ROOT) ? fs.readdirSync(ROOT) : []).filter(f => /^patch-.*\.json$/.test(f));
const hold = (fs.existsSync(ROOT) ? fs.readdirSync(ROOT) : []).filter(f => /\.hold$/.test(f));
const extras = files.slice(1);
for (const f of extras) {
  const src = path.join(ROOT, f), dst = path.join(ROOT, f + ".hold");
  try { fs.renameSync(src, dst); } catch {}
}
const out = { ts:new Date().toISOString(), plain_count: files.length, held: extras, existing_hold: hold };
console.log(JSON.stringify(out, null, 2));


