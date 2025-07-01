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
  ],
  rules: {
    // React Native best practices
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-redeclare': 'error',
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
    // React Native specific rules
    'react-native/no-inline-styles': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-color-literals': 'warn',
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
    // Custom theming architecture rules (inlined)
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/designTokens', '**/tokens'],
            message: "Direct import of design tokens is forbidden. Use useTheme() hook instead."
          }
        ]
      }
    ],
    // Custom JSX enforcement rules
    'thoughtmarks/no-direct-design-tokens': 'error',
    'thoughtmarks/no-global-theme': 'error',
    'thoughtmarks/require-use-theme': 'error',
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
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/designTokens', '**/tokens'],
                message: "Direct import of design tokens is forbidden. Use useTheme() hook instead."
              }
            ]
          }
        ],
      },
    },
    {
      files: ['src/theme/**/*.ts', 'src/theme/**/*.tsx', 'src/utils/getRadiusForHeight.ts', 'src/utils/getTextVariant.ts'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
}; 