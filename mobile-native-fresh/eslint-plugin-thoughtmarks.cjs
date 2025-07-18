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

    // Rule 5: Enforce text wrapping in JSX
    'enforce-text-wrapping': {
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
    },

    // Rule 6: Enforce AutoRoleView usage for eligible UI components
    'enforce-autoroleview': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce AutoRoleView usage for eligible UI components',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: null, // Disable autofix to prevent breaking changes
        schema: [
          {
            type: 'object',
            properties: {
              eligibleComponents: {
                type: 'array',
                items: { type: 'string' },
                default: ['View', 'TouchableOpacity', 'Pressable', 'Text', 'Button']
              },
              autoRoleViewComponents: {
                type: 'array',
                items: { type: 'string' },
                default: ['AutoRoleView', 'Card', 'Section', 'Header', 'Footer', 'NavigationButton', 'ActionButton', 'NavigationCard', 'Chip', 'Badge']
              },
              roleProps: {
                type: 'array',
                items: { type: 'string' },
                default: ['layoutRole', 'contentRole', 'interactiveRole']
              }
            },
            additionalProperties: false
          }
        ],
        messages: {
          missingRole: 'Component {{componentName}} should use AutoRoleView or explicit role props. Use one of: {{suggestions}}',
          invalidRole: 'Invalid role prop "{{roleName}}" for component {{componentName}}. Valid roles: {{validRoles}}',
          multipleRoles: 'Component {{componentName}} has multiple role types. Use only one of: {{roleTypes}}'
        }
      },

      create(context) {
        const options = context.options[0] || {};
        const eligibleComponents = options.eligibleComponents || ['View', 'TouchableOpacity', 'Pressable', 'Text', 'Button'];
        const autoRoleViewComponents = options.autoRoleViewComponents || ['AutoRoleView', 'Card', 'Section', 'Header', 'Footer', 'NavigationButton', 'ActionButton', 'NavigationCard', 'Chip', 'Badge'];
        const roleProps = options.roleProps || ['layoutRole', 'contentRole', 'interactiveRole'];

        // Valid role values from roles.ts
        const validRoles = {
          layoutRole: ['card', 'section', 'header', 'footer', 'navigation', 'modal', 'container'],
          contentRole: ['heading', 'body', 'caption', 'label', 'button-text', 'link-text'],
          interactiveRole: ['button-nav-primary', 'button-nav-secondary', 'card-as-nav', 'link-nav', 'button-action', 'button-function', 'input', 'toggle', 'slider', 'chip', 'badge', 'tag']
        };

        function isEligibleComponent(node) {
          if (!node.name) return false;
          return eligibleComponents.includes(node.name.name);
        }

        function isAutoRoleViewComponent(node) {
          if (!node.name) return false;
          return autoRoleViewComponents.includes(node.name.name);
        }

        function getRoleProps(props) {
          if (!props) return [];
          return props
            .filter(prop => 
              prop.type === 'JSXAttribute' && 
              roleProps.includes(prop.name.name)
            )
            .map(prop => prop.name.name);
        }

        function validateRoleValue(roleProp, value) {
          if (!value || value.type !== 'Literal') return true;
          const roleName = value.value;
          const validValues = validRoles[roleProp];
          return validValues && validValues.includes(roleName);
        }

        function getSuggestions(componentName) {
          const suggestions = [];
          
          // Suggest AutoRoleView components based on context
          if (componentName === 'View') {
            suggestions.push('Card', 'Section', 'Header', 'Footer');
          } else if (componentName === 'TouchableOpacity' || componentName === 'Pressable') {
            suggestions.push('ActionButton', 'NavigationButton', 'NavigationCard');
          } else if (componentName === 'Text') {
            suggestions.push('AutoRoleView with contentRole');
          }
          
          // Always suggest AutoRoleView with explicit role props
          suggestions.push('AutoRoleView with layoutRole/contentRole/interactiveRole');
          
          return suggestions;
        }

        return {
          JSXElement(node) {
            const openingElement = node.openingElement;
            const componentName = openingElement.name.name;
            const props = openingElement.attributes;

            // Skip if it's already an AutoRoleView component
            if (isAutoRoleViewComponent(openingElement.name)) {
              return;
            }

            // Check if it's an eligible component that needs role enforcement
            if (isEligibleComponent(openingElement.name)) {
              const existingRoleProps = getRoleProps(props);
              
              if (existingRoleProps.length === 0) {
                // No role props - suggest AutoRoleView
                context.report({
                  node: openingElement,
                  messageId: 'missingRole',
                  data: {
                    componentName,
                    suggestions: getSuggestions(componentName).join(', ')
                  }
                });
              } else if (existingRoleProps.length > 1) {
                // Multiple role types - error
                context.report({
                  node: openingElement,
                  messageId: 'multipleRoles',
                  data: {
                    componentName,
                    roleTypes: existingRoleProps.join(', ')
                  }
                });
              } else {
                // Validate role values
                props.forEach(prop => {
                  if (prop.type === 'JSXAttribute' && roleProps.includes(prop.name.name)) {
                    const roleProp = prop.name.name;
                    const roleValue = prop.value;
                    
                    if (!validateRoleValue(roleProp, roleValue)) {
                      context.report({
                        node: prop,
                        messageId: 'invalidRole',
                        data: {
                          componentName,
                          roleName: roleValue?.value || 'undefined',
                          validRoles: validRoles[roleProp].join(', ')
                        }
                      });
                    }
                  }
                });
              }
            }
          }
        };
      },
    },
  },
};
