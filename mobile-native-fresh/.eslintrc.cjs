module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  // parserOptions.project removed to avoid type-aware RAM spike
  rules: {
    // Stricter TypeScript rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    
    // Code quality rules
    'no-empty-function': 'error',
    'no-unused-vars': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    
    // React rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Project-specific overrides
    '@typescript-eslint/no-var-requires': 'error'
  }
}; 