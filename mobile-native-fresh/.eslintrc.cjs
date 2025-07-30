module.exports = {
  extends: ['expo'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'promise/catch-or-return': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    'backend/dist/',
    '*.d.ts'
  ]
}; 