// .eslintrc.js
// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  extends: ['expo'],
  ignorePatterns: [
    '/dist/*', 
    'reference/**/*', 
    '_quarantine/**/*',
    '**/*_quarantine/**/*',
    '**/_quarantine/**/*'
  ],
  rules: {
    // catch any tokens.colors.* at module level
    'no-restricted-syntax': [
      'error',
      {
        selector: "MemberExpression[object.name='tokens'][property.name='colors']",
        message:
          'Do not access tokens.colors.* at the module level. Use useTheme() inside components instead.',
      },
      {
        selector: "MemberExpression[object.name='tokens'][property.name=/\\w+/]",
        message:
          'Move all `tokens.*` access inside component scope or wrap in `getStyles(tokens)`.',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: './mobile-native-fresh/tsconfig.json'
      },
    },
  },
  overrides: [
    {
      // mobile code
      files: ['mobile-native-fresh/**/*.{ts,tsx}'],
      settings: {
        'import/resolver': {
          typescript: { project: './mobile-native-fresh/tsconfig.json' },
        },
      },
    },
    {
      // web code
      files: ['reference/web-src/**/*.{ts,tsx}'],
      settings: {
        'import/resolver': {
          typescript: { project: './reference/web-src/tsconfig.json' },
        },
      },
    },
  ],
};
