import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import unusedImports from 'eslint-plugin-unused-imports';
import promise from 'eslint-plugin-promise';
import reactNative from 'eslint-plugin-react-native';

import thoughtmarks from './eslint-plugin-thoughtmarks.cjs';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescript,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      'unused-imports': unusedImports,
      promise,
      'react-native': reactNative,
      thoughtmarks,
    },
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
      // Custom theming architecture rules
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
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ignores: ['src/theme/**/*.ts', 'src/theme/**/*.tsx', 'src/utils/getRadiusForHeight.ts', 'src/utils/getTextVariant.ts'],
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
      'thoughtmarks/require-use-theme': 'off',
    },
  },
]; 