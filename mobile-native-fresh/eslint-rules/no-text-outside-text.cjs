module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detect unwrapped string literals outside <Text> in JSX',
    },
    fixable: 'code',
    messages: {
      wrapInText: 'Text strings must be wrapped in a <Text> component.',
    },
  },
  create(context) {
    return {
      Literal(node) {
        // Check if this is a string literal in JSX
        if (typeof node.value === 'string' && node.value.trim() !== '') {
          const parent = node.parent;
          if (parent && parent.type === 'JSXElement') {
            const isTextComponent = 
              parent.openingElement &&
              parent.openingElement.name &&
              parent.openingElement.name.name === 'Text';
            
            if (!isTextComponent) {
              context.report({
                node,
                messageId: 'wrapInText',
                fix: fixer => {
                  const fixed = `<Text>${node.value}</Text>`;
                  return fixer.replaceText(node, fixed);
                },
              });
            }
          }
        }
      },
    };
  },
}; 