/**
 * ESLint Rule: enforce-autoroleview
 * 
 * Enforces the use of AutoRoleView components or explicit role props
 * for eligible UI primitives that should have semantic roles.
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce AutoRoleView usage for eligible UI components',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
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
              },
              fix(fixer) {
                // Suggest replacing with appropriate AutoRoleView component
                const suggestions = getSuggestions(componentName);
                const replacement = suggestions[0]; // Use first suggestion
                
                return fixer.replaceText(
                  openingElement.name,
                  replacement
                );
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
  }
}; 