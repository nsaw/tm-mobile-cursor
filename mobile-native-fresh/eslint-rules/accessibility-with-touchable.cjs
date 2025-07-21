module.exports = {
  meta: { 
    type: "problem", 
    fixable: "code",
    docs: {
      description: 'Enforce accessibility props on touchable components',
      category: 'Accessibility',
      recommended: true,
    },
  },
  create: (context) => ({
    JSXOpeningElement(node) {
      const name = node.name.name;
      const isTouchable = ["TouchableOpacity","TouchableHighlight","Pressable"].includes(name);
      if (!isTouchable) return;
      const hasLabel = node.attributes.some(attr => attr.name && attr.name.name === "accessibilityLabel");
      const hasRole = node.attributes.some(attr => attr.name && attr.name.name === "accessibilityRole");
      const hasAccessible = node.attributes.some(attr => attr.name && attr.name.name === "accessible");
      if (!hasLabel || !hasRole || !hasAccessible) {
        context.report({
          node,
          message: `${name} requires accessibilityLabel, accessibilityRole, and accessible`,
          fix: fixer => {
            const insert = ` accessibilityRole="button" accessible={true}`;
            return fixer.insertTextAfter(node.name, insert);
          }
        });
      }
    }
  }),
}; 