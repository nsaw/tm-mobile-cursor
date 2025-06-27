const fs = require('fs');
const glob = require('glob');

// Fix patterns where onPress contains any accessibility prop before the function body
const regex = /onPress=\{\(\)\s*=>\s*accessibilityRole="button"\s*accessible=\{?true\}?\s*accessibilityLabel="([^"]*)"\s*>\s*([^\}]*)\)}/g;

glob('src/**/*.tsx', {}, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    let changed = false;
    code = code.replace(
      regex,
      (match, label, fnBody) => {
        changed = true;
        return `onPress={() => ${fnBody.trim()}} accessibilityRole="button" accessible={true} accessibilityLabel="${label}"`;
      }
    );
    if (changed) {
      fs.writeFileSync(file, code, 'utf8');
      console.log(`🩹 Patched: ${file}`);
    }
  });
});
