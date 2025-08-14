// @ts-nocheck
/**
 * batch-fix-onrequestclose.cjs
 * Fix malformed onRequestClose handlers introduced by bad injections.
 * - onRequestClose={() = ...}  -> onRequestClose={() => ...}
 * - Strip injected accessibility tokens if they appear inside onRequestClose attribute.
 */
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh';
const SRC = path.join(ROOT, 'src-nextgen');

function* walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(p);
    else if (/\.tsx$/i.test(ent.name)) yield p;
  }
}

const nowTag = () => new Date().toISOString().replace(/[:.Z]/g, '-');
let count = 0;
for (const file of walk(SRC)) {
  let txt = fs.readFileSync(file, 'utf8');
  const orig = txt;
  txt = txt.replace(/onRequestClose=\{\s*\(\)\s*=/g, 'onRequestClose={() =>');
  txt = txt.replace(/onRequestClose=\{\s*\(\)\s*=>\s*accessible\s*=\{false\}\s*accessibilityLabel="Modal"\s*>\s*/g,
                    'onRequestClose={() => ');
  if (txt !== orig) {
    fs.writeFileSync(file + '.bak.' + nowTag(), orig);
    fs.writeFileSync(file, txt);
    count++;
  }
}
console.log(`batch-fix-onrequestclose: updated ${count} file(s).`);

