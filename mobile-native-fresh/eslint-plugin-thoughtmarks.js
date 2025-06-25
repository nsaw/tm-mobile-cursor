export default {
  rules: {
    'no-global-theme': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow top-level use of designTokens.*',
        },
        fixable: 'code',
        messages: {
          avoid: 'Move {{expr}} into component scope or a getStyles(tokens) factory.',
        },
      },
      create(context) {
        return {
          MemberExpression(node) {
            const isTokensUsage =
              node.object.name === 'tokens' &&
              ['colors', 'spacing', 'typography', 'radius', 'shadows'].includes(node.property.name);

            const isTopLevel = context
              .getAncestors()
              .every(
                (ancestor) =>
                  ancestor.type !== 'FunctionDeclaration' &&
                  ancestor.type !== 'ArrowFunctionExpression'
              );

            if (isTokensUsage && isTopLevel) {
              const expr = `designTokens.${node.property.name}`;
              context.report({
                node,
                messageId: 'avoid',
                data: { expr },
                fix(fixer) {
                  return fixer.insertTextBefore(node, '// TODO: move inside function\n');
                },
              });
            }
          },
        };
      },
    },
  },
};
