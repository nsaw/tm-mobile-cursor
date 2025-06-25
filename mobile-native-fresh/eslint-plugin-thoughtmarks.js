module.exports = {
  rules: {
    // Rule 1: Prevent direct designTokens imports outside ThemeProvider
    'no-direct-design-tokens': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow direct imports of designTokens outside ThemeProvider.tsx',
        },
        fixable: 'code',
        messages: {
          avoid: 'Direct import of designTokens is forbidden. Use useTheme() hook instead.',
        },
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            const source = node.source.value;
            const isThemeProvider = context.getFilename().includes('ThemeProvider.tsx');
            
            // Allow designTokens import only in ThemeProvider.tsx
            if (source.includes('designTokens') && !isThemeProvider) {
              node.specifiers.forEach(specifier => {
                if (specifier.imported && specifier.imported.name === 'designTokens') {
                  context.report({
                    node: specifier,
                    messageId: 'avoid',
                    fix(fixer) {
                      return fixer.replaceText(specifier, '// TODO: Remove designTokens import, use useTheme() instead');
                    },
                  });
                }
              });
            }
          },
        };
      },
    },

    // Rule 2: Prevent top-level tokens usage (enhanced version)
    'no-global-theme': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow top-level use of tokens.* outside of useTheme() hook',
        },
        fixable: 'code',
        messages: {
          avoid: 'Move {{expr}} inside component scope or wrap in getStyles(tokens) function.',
        },
      },
      create(context) {
        return {
          MemberExpression(node) {
            const isTokensUsage =
              node.object.name === 'tokens' &&
              ['colors', 'spacing', 'typography', 'radius', 'shadows'].includes(node.property.name);

            if (!isTokensUsage) return;

            // Check if we're inside a useTheme() call
            const ancestors = context.getAncestors();
            const isInUseTheme = ancestors.some(ancestor => 
              ancestor.type === 'CallExpression' && 
              ancestor.callee.name === 'useTheme'
            );

            // Check if we're inside a component function
            const isInComponent = ancestors.some(ancestor => 
              ancestor.type === 'FunctionDeclaration' ||
              ancestor.type === 'ArrowFunctionExpression' ||
              ancestor.type === 'FunctionExpression'
            );

            // Allow if inside useTheme() or component function
            if (isInUseTheme || isInComponent) return;

            const expr = `tokens.${node.property.name}`;
            context.report({
              node,
              messageId: 'avoid',
              data: { expr },
              fix(fixer) {
                return fixer.insertTextBefore(node, '// TODO: Move inside component or getStyles(tokens)\n');
              },
            });
          },
        };
      },
    },

    // Rule 3: Require useTheme() in components that use tokens
    'require-use-theme': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Require useTheme() hook when using tokens in components',
        },
        fixable: 'code',
        messages: {
          missing: 'Component uses tokens but does not call useTheme(). Add const { tokens } = useTheme();',
        },
      },
      create(context) {
        let hasTokensUsage = false;
        let hasUseTheme = false;

        return {
          MemberExpression(node) {
            if (node.object.name === 'tokens') {
              hasTokensUsage = true;
            }
          },
          CallExpression(node) {
            if (node.callee.name === 'useTheme') {
              hasUseTheme = true;
            }
          },
          'FunctionDeclaration:exit'(node) {
            if (hasTokensUsage && !hasUseTheme) {
              context.report({
                node,
                messageId: 'missing',
                fix(fixer) {
                  const body = node.body.body;
                  if (body.length > 0) {
                    return fixer.insertTextBefore(body[0], 'const { tokens } = useTheme();\n\n');
                  }
                },
              });
            }
            // Reset for next function
            hasTokensUsage = false;
            hasUseTheme = false;
          },
          'ArrowFunctionExpression:exit'(node) {
            if (hasTokensUsage && !hasUseTheme) {
              context.report({
                node,
                messageId: 'missing',
                fix(fixer) {
                  const body = node.body.body;
                  if (body && body.length > 0) {
                    return fixer.insertTextBefore(body[0], 'const { tokens } = useTheme();\n\n');
                  }
                },
              });
            }
            // Reset for next function
            hasTokensUsage = false;
            hasUseTheme = false;
          },
        };
      },
    },

    // Rule 4: Prevent circular usage of Text component
    'no-circular-text': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prevent circular usage of Text component',
          category: 'Possible Errors',
          recommended: true,
        },
        fixable: null,
        schema: [],
        messages: {
          circularTextUsage: 'Circular usage of Text component detected. This causes infinite recursion and runtime errors.',
          selfReferentialText: 'Text component is referencing itself, which will cause infinite recursion.',
          nestedTextInText: 'Text component contains another Text component, which may cause rendering issues.',
        },
      },
      create(context) {
        let textComponentDepth = 0;
        const textComponentNames = ['Text', 'Heading', 'Caption', 'Subheading', 'BodyText', 'Label'];

        function isTextComponent(node) {
          if (!node || !node.name) return false;
          return textComponentNames.includes(node.name);
        }

        function checkForCircularText(node) {
          if (!node || !node.openingElement) return;

          const elementName = node.openingElement.name;
          
          // Check if this is a Text component
          if (isTextComponent(elementName)) {
            textComponentDepth++;
            
            // Check for immediate self-reference
            if (textComponentDepth > 1) {
              context.report({
                node: elementName,
                messageId: 'circularTextUsage',
              });
            }

            // Check children for nested Text components
            if (node.children) {
              node.children.forEach(child => {
                if (child.type === 'JSXElement' && isTextComponent(child.openingElement.name)) {
                  context.report({
                    node: child.openingElement.name,
                    messageId: 'nestedTextInText',
                  });
                }
              });
            }
          }
        }

        function exitJSXElement(node) {
          if (node && node.openingElement && isTextComponent(node.openingElement.name)) {
            textComponentDepth--;
          }
        }

        return {
          JSXElement: {
            enter: checkForCircularText,
            exit: exitJSXElement,
          },
          
          // Also check for Text component usage in JSX expressions
          JSXExpressionContainer(node) {
            if (node.expression && node.expression.type === 'JSXElement') {
              checkForCircularText(node.expression);
            }
          },

          // Check for Text component in function calls
          CallExpression(node) {
            if (node.callee && node.callee.name && isTextComponent(node.callee.name)) {
              // Check if any arguments contain Text components
              node.arguments.forEach(arg => {
                if (arg.type === 'JSXElement') {
                  checkForCircularText(arg);
                }
              });
            }
          },
        };
      },
    },
  },
};
