const fs = require('fs');
const glob = require('glob');

glob('src/**/*.tsx', {}, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    // Find ALL the broken patterns and fix them:
    code = code.replace(
      /onPress=\{\(\)\s*=>\s*accessibilityRole="button"\s*accessible=\{?true\}?\s*accessibilityLabel="([^"]*)"\s*>\s*([^}]*)\)/g,
      (match, label, fnBody) => {
        // Guess the accessibilityLabel value
        let labelAttr = `accessibilityLabel="${label}"`;
        return `onPress={() => ${fnBody.trim()}) accessibilityRole="button" accessible={true} ${labelAttr}`;
      }
    );
    // Fallback fix for common pattern
    code = code.replace(
      /onPress=\{\(\)\s*=>\s*accessibilityRole="button"\s*accessible=\{?true\}?\s*accessibilityLabel=\{?([^\}]*)\}?\s*>\s*([^}]*)\)/g,
      (match, label, fnBody) => {
        let labelAttr = `accessibilityLabel={${label}}`;
        return `onPress={() => ${fnBody.trim()}) accessibilityRole="button" accessible={true} ${labelAttr}`;
      }
    );
    // SUPER fallback: kill any onPress with > and accessibilityRole INSIDE and fix it
    code = code.replace(
      /onPress=\{\(\)\s*=>[^>]*>\s*([^}]*)\)/g,
      (match, fnBody) => `onPress={() => ${fnBody.trim()})`
    );
    fs.writeFileSync(file, code, 'utf8');
    console.log('Repaired:', file);
  });
});
