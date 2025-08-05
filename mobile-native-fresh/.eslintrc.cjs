module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended'
  ],
  // parserOptions.project removed to avoid type-aware RAM spike
  ignorePatterns: [
    '**/*_quarantine/**/*',
    '**/_quarantine/**/*',
    '**/node_modules/**/*',
    '**/dist/**/*',
    '**/build/**/*',
    '**/.expo/**/*',
    '**/web-build/**/*'
  ],
  rules: {
    // Stricter TypeScript rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    
    // Code quality rules
    'no-empty-function': 'error',
    'no-unused-vars': 'off', // Use TypeScript version instead
    
    // React rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    
    // Project-specific overrides
    '@typescript-eslint/no-var-requires': 'error',
    
    // Accessibility rules
    'jsx-a11y/accessible-emoji': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    
    // Import rules
    'import/no-unresolved': 'off', // TypeScript handles this
    'import/extensions': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}; 