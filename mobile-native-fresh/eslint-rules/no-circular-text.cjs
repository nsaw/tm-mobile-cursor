module.exports = {
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
}; 