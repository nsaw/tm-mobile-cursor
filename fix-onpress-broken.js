const fs = require('fs');
const glob = require('glob');

// Regex to match broken onPress functions with misplaced accessibility props
const brokenOnPressRegex = /onPress=\{\(\)\s*=>[^>]*accessibilityRole\s*=\s*["']button["'][^>]*>\s*([^}\)]*)\)/gm;

glob('src/**/*.tsx', {}, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    let fixed = false;

    // Replace every broken pattern in the file
    code = code.replace(brokenOnPressRegex, (match, fnBody) => {
      fixed = true;
      // Find all misplaced accessibility props inside the function
      const roleMatch = match.match(/accessibilityRole\s*=\s*["'][^"']+["']/);
      const accessibleMatch = match.match(/accessible\s*=\s*\{?true\}?/);
      const labelMatch = match.match(/accessibilityLabel\s*=\s*({[^}]+}|["'][^"']+["'])/);

      // Compose the props to add to the component (outside onPress)
      let newProps = '';
      if (roleMatch) newProps += ` ${roleMatch[0]}`;
      if (accessibleMatch) newProps += ` ${accessibleMatch[0]}`;
      if (labelMatch) newProps += ` ${labelMatch[0]}`;

      // Fix the onPress
      return `onPress={() => ${fnBody.trim()}}${newProps}`;
    });

    // Fallback for any remaining easy cases (accidentally duplicated or partial fixes)
    code = code.replace(
      /onPress=\{\(\)\s*=>\s*([^>}]+)\}/g,
      (match, fnBody) => {
        return `onPress={() => ${fnBody.trim()}}`;
      }
    );

    if (fixed) {
      fs.writeFileSync(file, code, 'utf8');
      console.log(`🔧 Fixed: ${file}`);
    }
  });

  console.log("✅ Sweep complete. Review any remaining onPress errors by searching for 'onPress={() =' or manual check for edge cases.");
});
