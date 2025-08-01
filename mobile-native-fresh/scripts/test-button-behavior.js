#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Button Behavior...');

// Test button behavior structure
const buttonBehaviors = [
  {
    name: 'Primary Button',
    variant: 'primary',
    expectedProps: ['title', 'onPress', 'variant']
  },
  {
    name: 'Secondary Button',
    variant: 'secondary',
    expectedProps: ['title', 'onPress', 'variant']
  },
  {
    name: 'Outline Button',
    variant: 'outline',
    expectedProps: ['title', 'onPress', 'variant']
  },
  {
    name: 'Ghost Button',
    variant: 'ghost',
    expectedProps: ['title', 'onPress', 'variant']
  },
  {
    name: 'Small Button',
    size: 'small',
    expectedProps: ['title', 'onPress', 'size']
  },
  {
    name: 'Medium Button',
    size: 'medium',
    expectedProps: ['title', 'onPress', 'size']
  },
  {
    name: 'Large Button',
    size: 'large',
    expectedProps: ['title', 'onPress', 'size']
  },
  {
    name: 'Disabled Button',
    disabled: true,
    expectedProps: ['title', 'onPress', 'disabled']
  },
  {
    name: 'Loading Button',
    loading: true,
    expectedProps: ['title', 'onPress', 'loading']
  }
];

let allTestsPass = true;

// Check if Button component has required behavior functionality
const buttonPath = path.join(process.cwd(), 'src-nextgen/components/Button.tsx');
if (fs.existsSync(buttonPath)) {
  const content = fs.readFileSync(buttonPath, 'utf8');
  
  // Check for variant support
  const variants = ['primary', 'secondary', 'outline', 'ghost'];
  variants.forEach(variant => {
    if (content.includes(variant)) {
      console.log(`✅ Button component supports '${variant}' variant`);
    } else {
      console.log(`❌ Button component missing '${variant}' variant`);
      allTestsPass = false;
    }
  });
  
  // Check for size support
  const sizes = ['small', 'medium', 'large'];
  sizes.forEach(size => {
    if (content.includes(size)) {
      console.log(`✅ Button component supports '${size}' size`);
    } else {
      console.log(`❌ Button component missing '${size}' size`);
      allTestsPass = false;
    }
  });
  
  // Check for state support
  const states = ['disabled', 'loading'];
  states.forEach(state => {
    if (content.includes(state)) {
      console.log(`✅ Button component supports '${state}' state`);
    } else {
      console.log(`❌ Button component missing '${state}' state`);
      allTestsPass = false;
    }
  });
  
  // Check for TouchableOpacity usage
  if (content.includes('TouchableOpacity')) {
    console.log('✅ Button component uses TouchableOpacity for interaction');
  } else {
    console.log('❌ Button component missing TouchableOpacity');
    allTestsPass = false;
  }
  
  // Check for ActivityIndicator for loading state
  if (content.includes('ActivityIndicator')) {
    console.log('✅ Button component has loading indicator');
  } else {
    console.log('❌ Button component missing loading indicator');
    allTestsPass = false;
  }
  
  // Check for proper styling structure
  if (content.includes('StyleSheet.create')) {
    console.log('✅ Button component has proper styling structure');
  } else {
    console.log('❌ Button component missing proper styling structure');
    allTestsPass = false;
  }
  
  // Check for style composition
  if (content.includes('buttonStyle') && content.includes('textStyleCombined')) {
    console.log('✅ Button component has style composition');
  } else {
    console.log('❌ Button component missing style composition');
    allTestsPass = false;
  }
} else {
  console.log('❌ Button.tsx not found');
  allTestsPass = false;
}

// Test button behavior logic
console.log('🧪 Testing button behavior logic...');

buttonBehaviors.forEach(behavior => {
  console.log(`  Testing: ${behavior.name}`);
  
  // Check if all expected props are supported
  behavior.expectedProps.forEach(prop => {
    if (fs.existsSync(buttonPath)) {
      const content = fs.readFileSync(buttonPath, 'utf8');
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
    if (fs.existsSync(buttonPath)) {
      const content = fs.readFileSync(buttonPath, 'utf8');
      if (content.includes(`styles[${behavior.variant}]`)) {
        console.log(`    ✅ Has '${behavior.variant}' variant styling`);
      } else {
        console.log(`    ❌ Missing '${behavior.variant}' variant styling`);
        allTestsPass = false;
      }
    }
  }
  
  if (behavior.size) {
    if (fs.existsSync(buttonPath)) {
      const content = fs.readFileSync(buttonPath, 'utf8');
      if (content.includes(`styles[${behavior.size}]`)) {
        console.log(`    ✅ Has '${behavior.size}' size styling`);
      } else {
        console.log(`    ❌ Missing '${behavior.size}' size styling`);
        allTestsPass = false;
      }
    }
  }
  
  if (behavior.disabled) {
    if (fs.existsSync(buttonPath)) {
      const content = fs.readFileSync(buttonPath, 'utf8');
      if (content.includes('disabled && styles.disabled')) {
        console.log(`    ✅ Has disabled state handling`);
      } else {
        console.log(`    ❌ Missing disabled state handling`);
        allTestsPass = false;
      }
    }
  }
  
  if (behavior.loading) {
    if (fs.existsSync(buttonPath)) {
      const content = fs.readFileSync(buttonPath, 'utf8');
      if (content.includes('loading ?') && content.includes('ActivityIndicator')) {
        console.log(`    ✅ Has loading state handling`);
      } else {
        console.log(`    ❌ Missing loading state handling`);
        allTestsPass = false;
      }
    }
  }
});

// Check if button has proper accessibility behavior
if (fs.existsSync(buttonPath)) {
  const content = fs.readFileSync(buttonPath, 'utf8');
  
  if (content.includes('accessibilityState') && content.includes('disabled')) {
    console.log('✅ Button component has proper accessibility state handling');
  } else {
    console.log('❌ Button component missing proper accessibility state handling');
    allTestsPass = false;
  }
  
  if (content.includes('activeOpacity')) {
    console.log('✅ Button component has touch feedback');
  } else {
    console.log('❌ Button component missing touch feedback');
    allTestsPass = false;
  }
}

if (allTestsPass) {
  console.log('✅ Button Behavior Testing PASSED');
  process.exit(0);
} else {
  console.log('❌ Button Behavior Testing FAILED');
  process.exit(1);
} 