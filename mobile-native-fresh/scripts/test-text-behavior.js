#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Text Behavior...');

// Test text behavior structure
const textBehaviors = [
  {
    name: 'Display Text',
    variant: 'display',
    expectedProps: ['variant', 'size', 'weight', 'color', 'align']
  },
  {
    name: 'Heading Text',
    variant: 'heading',
    expectedProps: ['variant', 'size', 'weight', 'color', 'align']
  },
  {
    name: 'Body Text',
    variant: 'body',
    expectedProps: ['variant', 'size', 'weight', 'color', 'align']
  },
  {
    name: 'Caption Text',
    variant: 'caption',
    expectedProps: ['variant', 'size', 'weight', 'color', 'align']
  },
  {
    name: 'Label Text',
    variant: 'label',
    expectedProps: ['variant', 'size', 'weight', 'color', 'align']
  },
  {
    name: 'Small Text',
    size: 'small',
    expectedProps: ['variant', 'size', 'weight', 'color', 'align']
  },
  {
    name: 'Medium Text',
    size: 'medium',
    expectedProps: ['variant', 'size', 'weight', 'color', 'align']
  },
  {
    name: 'Large Text',
    size: 'large',
    expectedProps: ['variant', 'size', 'weight', 'color', 'align']
  },
  {
    name: 'XL Text',
    size: 'xl',
    expectedProps: ['variant', 'size', 'weight', 'color', 'align']
  }
];

let allTestsPass = true;

// Check if Text component has required behavior functionality
const textPath = path.join(process.cwd(), 'src-nextgen/components/Text.tsx');
if (fs.existsSync(textPath)) {
  const content = fs.readFileSync(textPath, 'utf8');
  
  // Check for variant support
  const variants = ['display', 'heading', 'body', 'caption', 'label'];
  variants.forEach(variant => {
    if (content.includes(variant)) {
      console.log(`✅ Text component supports '${variant}' variant`);
    } else {
      console.log(`❌ Text component missing '${variant}' variant`);
      allTestsPass = false;
    }
  });
  
  // Check for size support
  const sizes = ['small', 'medium', 'large', 'xl'];
  sizes.forEach(size => {
    if (content.includes(size)) {
      console.log(`✅ Text component supports '${size}' size`);
    } else {
      console.log(`❌ Text component missing '${size}' size`);
      allTestsPass = false;
    }
  });
  
  // Check for weight support
  const weights = ['normal', 'medium', 'semibold', 'bold'];
  weights.forEach(weight => {
    if (content.includes(weight)) {
      console.log(`✅ Text component supports '${weight}' weight`);
    } else {
      console.log(`❌ Text component missing '${weight}' weight`);
      allTestsPass = false;
    }
  });
  
  // Check for color support
  const colors = ['primary', 'secondary', 'tertiary', 'accent', 'error', 'success'];
  colors.forEach(color => {
    if (content.includes(color)) {
      console.log(`✅ Text component supports '${color}' color`);
    } else {
      console.log(`❌ Text component missing '${color}' color`);
      allTestsPass = false;
    }
  });
  
  // Check for alignment support
  const alignments = ['left', 'center', 'right', 'justify'];
  alignments.forEach(align => {
    if (content.includes(align)) {
      console.log(`✅ Text component supports '${align}' alignment`);
    } else {
      console.log(`❌ Text component missing '${align}' alignment`);
      allTestsPass = false;
    }
  });
  
  // Check for RNText usage
  if (content.includes('Text as RNText')) {
    console.log('✅ Text component uses RNText for rendering');
  } else {
    console.log('❌ Text component missing RNText import');
    allTestsPass = false;
  }
  
  // Check for proper styling structure
  if (content.includes('StyleSheet.create')) {
    console.log('✅ Text component has proper styling structure');
  } else {
    console.log('❌ Text component missing proper styling structure');
    allTestsPass = false;
  }
  
  // Check for style composition
  if (content.includes('textStyle')) {
    console.log('✅ Text component has style composition');
  } else {
    console.log('❌ Text component missing style composition');
    allTestsPass = false;
  }
  
  // Check for role mapping logic
  if (content.includes('getContentRole') && content.includes('switch (variant)')) {
    console.log('✅ Text component has role mapping logic');
  } else {
    console.log('❌ Text component missing role mapping logic');
    allTestsPass = false;
  }
} else {
  console.log('❌ Text.tsx not found');
  allTestsPass = false;
}

// Test text behavior logic
console.log('🧪 Testing text behavior logic...');

textBehaviors.forEach(behavior => {
  console.log(`  Testing: ${behavior.name}`);
  
  // Check if all expected props are supported
  behavior.expectedProps.forEach(prop => {
    if (fs.existsSync(textPath)) {
      const content = fs.readFileSync(textPath, 'utf8');
      if (content.includes(prop)) {
        console.log(`    ✅ Supports '${prop}' prop`);
      } else {
        console.log(`    ❌ Missing '${prop}' prop`);
        allTestsPass = false;
      }
    }
  });
  
  // Check for specific behavior implementations
  if (behavior.variant) {
    if (fs.existsSync(textPath)) {
      const content = fs.readFileSync(textPath, 'utf8');
      if (content.includes(`styles[${behavior.variant}]`)) {
        console.log(`    ✅ Has '${behavior.variant}' variant styling`);
      } else {
        console.log(`    ❌ Missing '${behavior.variant}' variant styling`);
        allTestsPass = false;
      }
    }
  }
  
  if (behavior.size) {
    if (fs.existsSync(textPath)) {
      const content = fs.readFileSync(textPath, 'utf8');
      if (content.includes(`styles[${behavior.size}]`)) {
        console.log(`    ✅ Has '${behavior.size}' size styling`);
      } else {
        console.log(`    ❌ Missing '${behavior.size}' size styling`);
        allTestsPass = false;
      }
    }
  }
});

// Check if text has proper accessibility behavior
if (fs.existsSync(textPath)) {
  const content = fs.readFileSync(textPath, 'utf8');
  
  if (content.includes('accessibilityRole="text"')) {
    console.log('✅ Text component has proper accessibility role');
  } else {
    console.log('❌ Text component missing proper accessibility role');
    allTestsPass = false;
  }
  
  if (content.includes('AutoRoleView contentRole=')) {
    console.log('✅ Text component has content role assignment');
  } else {
    console.log('❌ Text component missing content role assignment');
    allTestsPass = false;
  }
}

if (allTestsPass) {
  console.log('✅ Text Behavior Testing PASSED');
  process.exit(0);
} else {
  console.log('❌ Text Behavior Testing FAILED');
  process.exit(1);
} 