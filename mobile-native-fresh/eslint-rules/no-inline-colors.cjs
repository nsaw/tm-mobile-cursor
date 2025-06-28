module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow inline static colors in JSX. Use tokens.colors.* from useTheme() instead.',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noInlineColors: 'Static colors are not allowed. Use `tokens.colors.*` from `useTheme()` instead.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name === 'style' && node.value && node.value.type === 'JSXExpressionContainer') {
          const expression = node.value.expression;
          
          if (expression.type === 'ObjectExpression') {
            expression.properties.forEach(prop => {
              if (prop.type === 'Property' && 
                  (prop.key.name === 'color' || 
                   prop.key.name === 'backgroundColor' || 
                   prop.key.name === 'borderColor' ||
                   prop.key.name === 'tintColor')) {
                
                const value = prop.value;
                
                // Check for string literals (hex, rgb, named colors)
                if (value.type === 'Literal' && typeof value.value === 'string') {
                  const colorValue = value.value;
                  
                  // Match hex colors, rgb/rgba, or common color names
                  const colorPattern = /^(#([0-9A-Fa-f]{3}){1,2}|rgb\(|rgba\(|hsl\(|hsla\(|red|green|blue|yellow|orange|purple|pink|brown|gray|grey|black|white)$/;
                  
                  if (colorPattern.test(colorValue)) {
                    context.report({
                      node: prop,
                      messageId: 'noInlineColors',
                      fix(fixer) {
                        // Suggest a fix based on the property name
                        let suggestedToken = 'text';
                        if (prop.key.name === 'backgroundColor') suggestedToken = 'background';
                        if (prop.key.name === 'borderColor') suggestedToken = 'border';
                        if (prop.key.name === 'tintColor') suggestedToken = 'accent';
                        
                        return fixer.replaceText(
                          prop.value,
                          `tokens.colors.${suggestedToken}`
                        );
                      }
                    });
                  }
                }
              }
            });
          }
        }
      }
    };
  },
}; 