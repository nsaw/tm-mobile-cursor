const noTextOutsideText = require('./eslint-rules/no-text-outside-text.cjs');
const noInlineColors = require('./eslint-rules/no-inline-colors.cjs');
const enforceThemeHook = require('./eslint-rules/enforce-theme-hook.cjs');

module.exports = {
  rules: {
    'no-text-outside-text': noTextOutsideText,
    'no-inline-colors': noInlineColors,
    'enforce-theme-hook': enforceThemeHook,
  },
}; 