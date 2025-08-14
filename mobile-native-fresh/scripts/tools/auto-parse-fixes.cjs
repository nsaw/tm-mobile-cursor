// @ts-nocheck
/**
 * auto-parse-fixes.cjs
 * Safe, mechanical TSX/TS parser-fix heuristics with file backups.
 * Use on SPECIFIC files only. Creates .bak.<ts> alongside originals.
 *
 * Heuristics applied (idempotent):
 *  1) Unterminated template literals → add closing backtick at EOL if line has odd backtick count.
 *  2) Common JSX unclosed tags for self-closing components (<Foo> → <Foo />) when next non-space is newline/','/')'.
 *  3) Dangling fragment open "<>" without close → append "</>" at EOF if counts mismatch.
 *  4) Obvious unbalanced braces/parens at file end → append '}' and/or ')' to balance if deltas are 1–2.
 *  5) Replace BOMs and stray CR chars; ensure trailing newline.
 *
 * All changes are minimal; if file diff exceeds 3% of bytes, abort (safety).
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node auto-parse-fixes.cjs <abs-file> [<abs-file> ...]');
  process.exit(64);
}
const nowTag = () => new Date().toISOString().replace(/[:.Z]/g, '-');

const fixFile = (file) => {
  if (!fs.existsSync(file)) { console.error('skip (missing):', file); return false; }
  const orig = fs.readFileSync(file, 'utf8');
  let txt = orig;

  // Normalizations
  txt = txt.replace(/^\uFEFF/, ''); // strip BOM
  txt = txt.replace(/\r/g, '');     // CR→LF

  // 1) close backticks on lines with odd count
  txt = txt.split('\n').map(line => {
    const bt = (line.match(/`/g) || []).length;
    if (bt % 2 === 1 && !line.trim().endsWith('`')) return line + '`';
    return line;
  }).join('\n');

  // 2) self-close obvious JSX with no children: <Tag> followed by , ) ] } or newline
  txt = txt.replace(/<([A-Z][A-Za-z0-9_]*)\s*>\s*(?=[,\)\]\}\n])/g, '<$1 />');

  // 3) fragment <> ... ensure closing
  const openFrag = (txt.match(/<>\s*/g) || []).length;
  const closeFrag = (txt.match(/<\/>\s*/g) || []).length;
  if (openFrag > closeFrag) { txt = txt + '\n</>\n'; }

  // 4) Balance braces/parens at EOF (only small deltas)
  const c = (s, re) => (s.match(re) || []).length;
  const deltaBrace = c(txt, /\{/g) - c(txt, /\}/g);
  const deltaParen = c(txt, /\(/g) - c(txt, /\)/g);
  if (deltaBrace > 0 && deltaBrace <= 2) txt += '\n' + '}'.repeat(deltaBrace) + '\n';
  if (deltaParen > 0 && deltaParen <= 2) txt += '\n' + ')'.repeat(deltaParen) + '\n';

  if (!txt.endsWith('\n')) txt += '\n';

  // Safety: refuse huge diffs
  const changePct = Math.abs(txt.length - orig.length) / Math.max(1, orig.length);
  if (changePct > 0.03) { console.error('refuse (diff too large):', file); return false; }

  // Write backup + updated
  const bak = file + '.bak.' + nowTag();
  fs.writeFileSync(bak, orig);
  fs.writeFileSync(file, txt);
  console.log('fixed:', path.relative('/', file));
  return true;
};

let ok = true;
for (const f of args) { ok = fixFile(f) && ok; }
process.exit(ok ? 0 : 2);


