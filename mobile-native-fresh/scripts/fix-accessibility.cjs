#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fix accessibility issues in touchable components
function fixAccessibilityIssues(content) {
  let modified = false;
  
  // Pattern to match TouchableOpacity, TouchableHighlight, Pressable
  const touchablePattern = /<(\w+)([^>]*?)>/g;
  const touchableComponents = ['TouchableOpacity', 'TouchableHighlight', 'Pressable'];
  
  let newContent = content.replace(touchablePattern, (match, componentName, attributes) => {
    if (!touchableComponents.includes(componentName)) {
      return match;
    }
    
    // Check if accessibility props are already present
    const hasLabel = attributes.includes('accessibilityLabel');
    const hasRole = attributes.includes('accessibilityRole');
    const hasAccessible = attributes.includes('accessible');
    
    if (hasLabel && hasRole && hasAccessible) {
      return match; // Already has all required props
    }
    
    modified = true;
    console.log(`  ♿ Found touchable without accessibility props: <${componentName}>`);
    
    // Add missing accessibility props
    let newAttributes = attributes;
    
    if (!hasRole) {
      newAttributes += ' accessibilityRole="button"';
    }
    
    if (!hasAccessible) {
      newAttributes += ' accessible={true}';
    }
    
    // For accessibilityLabel, try to extract from children if possible
    if (!hasLabel) {
      // Look for text content in the component
      const textMatch = content.match(new RegExp(`<${componentName}[^>]*>([^<]+)</${componentName}>`));
      if (textMatch && textMatch[1].trim()) {
        const labelText = textMatch[1].trim().replace(/['"]/g, '');
        newAttributes += ` accessibilityLabel="${labelText}"`;
      } else {
        newAttributes += ' accessibilityLabel="Button"';
      }
    }
    
    return `<${componentName}${newAttributes}>`;
  });
  
  return { content: newContent, modified };
}

// Fix SVG accessibility issues
function fixSVGAccessibility(content) {
  let modified = false;
  
  // Pattern to match SVG elements
  const svgPattern = /<(\w+)([^>]*?)>/g;
  const svgElements = ['Svg', 'Path', 'G', 'Circle', 'Rect', 'Line'];
  
  let newContent = content.replace(svgPattern, (match, elementName, attributes) => {
    if (!svgElements.includes(elementName)) {
      return match;
    }
    
    // Check if accessibility props are present
    const hasAccessibilityRole = attributes.includes('accessibilityRole');
    const hasAccessibilityLabel = attributes.includes('accessibilityLabel');
    const hasAccessible = attributes.includes('accessible');
    
    if (hasAccessibilityRole && hasAccessibilityLabel && hasAccessible) {
      return match; // Already has accessibility props
    }
    
    modified = true;
    console.log(`  🎨 Found SVG element without accessibility props: <${elementName}>`);
    
    // Add missing accessibility props
    let newAttributes = attributes;
    
    if (!hasAccessibilityRole) {
      newAttributes += ' accessibilityRole="image"';
    }
    
    if (!hasAccessible) {
      newAttributes += ' accessible={true}';
    }
    
    if (!hasAccessibilityLabel) {
      newAttributes += ' accessibilityLabel="Icon"';
    }
    
    return `<${elementName}${newAttributes}>`;
  });
  
  return { content: newContent, modified };
}

// Fix modal accessibility issues
function fixModalAccessibility(content) {
  let modified = false;
  
  // Pattern to match Modal components
  const modalPattern = /<Modal([^>]*?)>/g;
  
  let newContent = content.replace(modalPattern, (match, attributes) => {
    // Check if accessibility props are present
    const hasAccessible = attributes.includes('accessible');
    const hasAccessibilityLabel = attributes.includes('accessibilityLabel');
    
    if (hasAccessible && hasAccessibilityLabel) {
      return match; // Already has accessibility props
    }
    
    modified = true;
    console.log(`  🪟 Found Modal without accessibility props`);
    
    // Add missing accessibility props
    let newAttributes = attributes;
    
    if (!hasAccessible) {
      newAttributes += ' accessible={false}';
    }
    
    if (!hasAccessibilityLabel) {
      newAttributes += ' accessibilityLabel="Modal"';
    }
    
    return `<Modal${newAttributes}>`;
  });
  
  return { content: newContent, modified };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let totalModified = false;
    
    console.log(`\n🔍 Processing: ${path.relative(process.cwd(), filePath)}`);
    
    // Apply all accessibility fixes
    const touchableResult = fixAccessibilityIssues(newContent);
    if (touchableResult.modified) {
      newContent = touchableResult.content;
      totalModified = true;
    }
    
    const svgResult = fixSVGAccessibility(newContent);
    if (svgResult.modified) {
      newContent = svgResult.content;
      totalModified = true;
    }
    
    const modalResult = fixModalAccessibility(newContent);
    if (modalResult.modified) {
      newContent = modalResult.content;
      totalModified = true;
    }
    
    if (totalModified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`✅ No accessibility issues found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  const srcDir = path.join(__dirname, '..', 'src-nextgen');
  const pattern = path.join(srcDir, '**/*.tsx');
  
  console.log('🔍 Scanning for accessibility issues...');
  console.log(`📁 Pattern: ${pattern}`);
  console.log('\n📋 Accessibility rules being enforced:');
  console.log('  1. ♿ TouchableOpacity/TouchableHighlight/Pressable must have accessibilityLabel, accessibilityRole, and accessible');
  console.log('  2. 🎨 SVG elements must have accessibilityRole="image", accessibilityLabel, and accessible');
  console.log('  3. 🪟 Modal components must have accessible={false} and accessibilityLabel');
  
  const files = glob.sync(pattern);
  
  if (files.length === 0) {
    console.log('No .tsx files found in src directory');
    return;
  }
  
  console.log(`\n📄 Found ${files.length} .tsx files`);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    if (processFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n🎉 Summary: Fixed ${fixedCount} files`);
  
  if (fixedCount > 0) {
    console.log('\n💡 Next steps:');
    console.log('  1. Review the changes to ensure they look correct');
    console.log('  2. Test the app to make sure nothing broke');
    console.log('  3. Run "npm run lint" to check for any remaining issues');
  }
}

if (require.main === module) {
  main();
}

module.exports = { 
  fixAccessibilityIssues, 
  fixSVGAccessibility, 
  fixModalAccessibility, 
  processFile 
}; 