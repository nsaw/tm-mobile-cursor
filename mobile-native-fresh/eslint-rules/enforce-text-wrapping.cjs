module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that text strings are wrapped in Text components',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      unwrappedText: 'Text strings must be wrapped in a <Text> component',
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        // Skip if this is already a Text component
        if (node.openingElement.name.name === 'Text') {
          return;
        }

        // Check for text nodes that are direct children
        node.children.forEach(child => {
          if (child.type === 'JSXText') {
            const text = child.value.trim();
            if (text && /[a-zA-Z]/.test(text)) {
              context.report({
                node: child,
                messageId: 'unwrappedText',
                fix(fixer) {
                  return fixer.replaceText(child, `<Text>${text}</Text>`);
                },
              });
            }
          }
        });
      },
      JSXExpressionContainer(node) {
        // Check for string literals in JSX expressions
        if (node.expression.type === 'Literal' && typeof node.expression.value === 'string') {
          const text = node.expression.value.trim();
          if (text && /[a-zA-Z]/.test(text)) {
            // Check if parent is already a Text component
            const parent = node.parent;
            if (parent && parent.type === 'JSXElement' && parent.openingElement.name.name === 'Text') {
              return;
            }

            context.report({
              node: node.expression,
              messageId: 'unwrappedText',
              fix(fixer) {
                return fixer.replaceText(node, `<Text>${text}</Text>`);
              },
            });
          }
        }
      },
    };
  },
}; 