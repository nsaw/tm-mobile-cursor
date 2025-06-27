module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow accessibility props inside JSX function bodies (like onPress arrow functions)",
      category: "Possible Errors",
      recommended: true
    },
    schema: [],
    fixable: null,
    messages: {
      noInlineAccessibilityProps: "Accessibility props must never appear inside function bodies or inline functions (like onPress). Move them outside as separate props."
    }
  },
  create: function(context) {
    return {
      "JSXAttribute[name.name='onPress']"(node) {
        const source = context.getSourceCode().getText(node);
        
        // Check for accessibility props inside onPress function
        const accessibilityPropsPattern = /(accessibilityRole\s*=\s*["']button["']|accessible\s*=\s*{?true}?|accessibilityLabel\s*=)/;
        
        if (accessibilityPropsPattern.test(source)) {
          context.report({
            node,
            messageId: "noInlineAccessibilityProps",
            data: {
              prop: node.name.name
            }
          });
        }
      },
      
      // Also check for accessibility props in any arrow function or function expression
      "ArrowFunctionExpression"(node) {
        const source = context.getSourceCode().getText(node);
        const accessibilityPropsPattern = /(accessibilityRole\s*=\s*["']button["']|accessible\s*=\s*{?true}?|accessibilityLabel\s*=)/;
        
        if (accessibilityPropsPattern.test(source)) {
          context.report({
            node,
            messageId: "noInlineAccessibilityProps",
            data: {
              prop: "arrow function"
            }
          });
        }
      },
      
      "FunctionExpression"(node) {
        const source = context.getSourceCode().getText(node);
        const accessibilityPropsPattern = /(accessibilityRole\s*=\s*["']button["']|accessible\s*=\s*{?true}?|accessibilityLabel\s*=)/;
        
        if (accessibilityPropsPattern.test(source)) {
          context.report({
            node,
            messageId: "noInlineAccessibilityProps",
            data: {
              prop: "function expression"
            }
          });
        }
      }
    };
  }
}; 