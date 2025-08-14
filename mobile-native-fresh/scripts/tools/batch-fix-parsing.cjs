// @ts-nocheck
/**
 * batch-fix-parsing.cjs
 * Targeted, safe replacements across src-nextgen to fix common malformed patterns.
 * - Fix malformed onPress handlers: onPress={() = ...} -> onPress={() => ...}
 * - Remove injected accessibility tokens mistakenly inside onPress attribute
 *
 * Creates timestamped .bak files alongside originals.
 */
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh';
const SRC = path.join(ROOT, 'src-nextgen');

function* walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) { yield* walk(p); }
    else if (/\.tsx$/i.test(ent.name)) { yield p; }
  }
}

const nowTag = () => new Date().toISOString().replace(/[:.Z]/g, '-');

let changed = 0;
for (const file of walk(SRC)) {
  let txt = fs.readFileSync(file, 'utf8');
  const orig = txt;

  // 1) Fix malformed onPress: onPress={() =
  txt = txt.replace(/onPress=\{\s*\(\)\s*=/g, 'onPress={() =>');

  // 2) If accessibility tokens were accidentally injected into onPress attribute, strip them
  // Pattern: onPress={() => accessibilityRole="button" accessible={true} accessibilityLabel="Button"> --> onPress={() =>
  txt = txt.replace(/onPress=\{\s*\(\)\s*=>\s*accessibilityRole="button"\s+accessible=\{true\}\s+accessibilityLabel="Button">\s*/g,
                   'onPress={() => ');

  if (txt !== orig) {
    const bak = file + '.bak.' + nowTag();
    fs.writeFileSync(bak, orig);
    fs.writeFileSync(file, txt);
    changed++;
  }
}

console.log(`batch-fix-parsing: updated ${changed} file(s).`);

