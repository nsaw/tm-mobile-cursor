#!/usr/bin/env node

const { ESLint } = require('eslint');
const path = require('path');

async function testAccessibilityRule() {
  console.log('🧪 Testing Custom Accessibility ESLint Rule...\n');

  const eslint = new ESLint({
    useEslintrc: true,
    cwd: process.cwd(),
  });

  // Test cases that should trigger the rule
  const testCases = [
    {
      name: '❌ Accessibility props inside onPress (should fail)',
      code: `
        <TouchableOpacity 
          onPress={() => accessibilityRole="button" accessible={true} accessibilityLabel="Button"> handlePress()}
        />
      `,
      shouldFail: true
    },
    {
      name: '❌ Accessibility props in arrow function (should fail)',
      code: `
        <TouchableOpacity 
          onPress={() => {
            accessibilityRole="button";
            accessible={true};
            accessibilityLabel="Button";
            handlePress();
          }}
        />
      `,
      shouldFail: true
    },
    {
      name: '✅ Correct accessibility props placement (should pass)',
      code: `
        <TouchableOpacity 
          onPress={() => handlePress()}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel="Button"
        />
      `,
      shouldFail: false
    },
    {
      name: '✅ No accessibility props (should pass)',
      code: `
        <TouchableOpacity 
          onPress={() => handlePress()}
        />
      `,
      shouldFail: false
    }
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    try {
      const results = await eslint.lintText(testCase.code, {
        filePath: 'test.tsx'
      });

      const hasErrors = results[0].messages.some(msg => 
        msg.ruleId === 'no-inline-accessibility-props-in-function'
      );

      if (testCase.shouldFail && hasErrors) {
        console.log(`✅ ${testCase.name}`);
        passedTests++;
      } else if (!testCase.shouldFail && !hasErrors) {
        console.log(`✅ ${testCase.name}`);
        passedTests++;
      } else {
        console.log(`❌ ${testCase.name}`);
        if (testCase.shouldFail && !hasErrors) {
          console.log('   Expected rule to fail but it passed');
        } else if (!testCase.shouldFail && hasErrors) {
          console.log('   Expected rule to pass but it failed');
        }
      }
    } catch (error) {
      console.log(`❌ ${testCase.name} - Error: ${error.message}`);
    }
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 All accessibility rule tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the rule implementation.');
    process.exit(1);
  }
}

// Run the test
testAccessibilityRule().catch(console.error); 