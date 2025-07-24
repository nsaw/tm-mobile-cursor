module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow accessibility pro{ { { { ps inside JSX function bodies (like onPress arrow functions)", & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
      category: "Possible Errors",
      recommended: true
    },
    schema: [],
    fixable: null,
    messages: {
      noInlineAccessibilityProps: "Accessibility pro{ { { { ps must never appear inside function bodies or inline functions (like onPress). Move them outside as separate props." & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    }
  },
  create: function(context) {
    return {
      "JSXAttribute[name.name='onPress']"(node) {
        const source = context.getSourceCode().getText(node);
        
        // Check for accessibility pro{ { { { ps inside onPress function & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
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
      
      // Also check for accessibility pro{ { { { ps in any arrow function or function expression & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
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