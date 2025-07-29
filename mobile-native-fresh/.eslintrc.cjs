// Register the local plugin for ESLint
try {
  require('eslint/lib/api').linter.definePlugin('thoughtmarks', require('./eslint-plugin-thoughtmarks.cjs'));
} catch (e) {
  // Ignore if already registered or in environments where this is not needed
}

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'react-native/react-native': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import',
    'thoughtmarks',
    'jsx-a11y',
    'unused-imports',
    'promise',
    'react-native',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:react-native/all',
  ],
  rules: {
    // React Native best practices
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    // Enforce consistent imports
    'import/no-duplicates': 'error',
    'import/order': ['error', { 'newlines-between': 'always' }],
    // Unused imports removal
    'unused-imports/no-unused-imports': 'error',
    // Promise best practices
    'promise/catch-or-return': 'error',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/no-new-statics': 'error',
    'promise/no-return-in-finally': 'error',
    'promise/valid-params': 'error',
    // React Native specific rules - TEMPORARILY RELAXED
    'react-native/no-inline-styles': 'off', // Temporarily disabled
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-color-literals': 'off', // Temporarily disabled
    'react-native/no-raw-text': 'off',
    'react-native/no-single-element-style-arrays': 'warn',
    // React JSX rules to prevent bad prop placement
    'react/jsx-no-bind': [
      'error',
      {
        'allowArrowFunctions': true,
        'allowFunctions': false,
        'allowBind': false,
        'ignoreRefs': true
      }
    ],
    // Custom theming architecture rules - TEMPORARILY RELAXED
    'no-restricted-imports': 'off', // Temporarily disabled
    // TypeScript specific rules
    '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    // Custom JSX enforcement rules - TEMPORARILY RELAXED
    'thoughtmarks/no-direct-design-tokens': 'off', // Temporarily disabled
    'thoughtmarks/no-global-theme': 'off', // Temporarily disabled
    'thoughtmarks/require-use-theme': 'off', // Temporarily disabled
    // 'thoughtmarks/no-circular-text': 'error', // Temporarily disabled due to rule syntax issue
    // Custom text wrapping rule
    'thoughtmarks/enforce-text-wrapping': 'error',
    // Accessibility rules
    'jsx-a11y/accessible-emoji': 'warn',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-role': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-tabindex': 'warn',
    'jsx-a11y/interactive-supports-focus': 'error',
    // TEMPORARILY DISABLE PARSE ERROR RULES
    'import/namespace': 'off', // Temporarily disabled due to react-native parse issues
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      excludedFiles: ['src/theme/**/*.ts', 'src/theme/**/*.tsx', 'src/utils/getRadiusForHeight.ts', 'src/utils/getTextVariant.ts'],
      rules: {
        'no-restricted-imports': 'off', // Temporarily disabled
      },
    },
    {
      files: ['src/theme/**/*.ts', 'src/theme/**/*.tsx', 'src/utils/getRadiusForHeight.ts', 'src/utils/getTextVariant.ts'],
      rules: {
        'no-restricted-imports': 'off',
        'thoughtmarks/require-use-theme': 'off',
      },
    },
  ],
}; 