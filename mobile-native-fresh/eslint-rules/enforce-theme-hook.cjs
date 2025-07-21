module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce useTheme() hook usage when accessing tokens.colors',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingUseTheme: 'File uses tokens.colors but does not call useTheme(). Add "const { tokens } = useTheme();" to your component.',
    },
  },
  create(context) {
    let hasTokensColorsUsage = false;
    let hasUseThemeCall = false;
    let useThemeImportExists = false;
    
    return {
      // Check for useTheme import
      ImportDeclaration(node) {
        if (node.source.value === '../theme/ThemeProvider' || 
            node.source.value === '../../theme/ThemeProvider' ||
            node.source.value === '../../../theme/ThemeProvider' ||
            node.source.value === '../../../../theme/ThemeProvider') {
          node.specifiers.forEach(specifier => {
            if (specifier.imported && specifier.imported.name === 'useTheme') {
              useThemeImportExists = true;
            }
          });
        }
      },
      
      // Check for tokens.colors usage
      MemberExpression(node) {
        if (node.object.type === 'MemberExpression' &&
            node.object.object.name === 'tokens' &&
            node.object.property.name === 'colors') {
          hasTokensColorsUsage = true;
        }
      },
      
      // Check for useTheme() call
      CallExpression(node) {
        if (node.callee.name === 'useTheme') {
          hasUseThemeCall = true;
        }
      },
      
      // Report at the end of the file
      'Program:exit'() {
        if (hasTokensColorsUsage && !hasUseThemeCall) {
          context.report({
            node: context.getSourceCode().ast,
            messageId: 'missingUseTheme',
            fix(fixer) {
              const sourceCode = context.getSourceCode();
              const firstNode = sourceCode.ast.body[0];
              
              // Add useTheme import if not present
              let importFix = '';
              if (!useThemeImportExists) {
                importFix = "import { useTheme } from '../theme/ThemeProvider';\n";
              }
              
              // Add useTheme call in the first function/component
              const firstFunction = sourceCode.ast.body.find(node => 
                node.type === 'FunctionDeclaration' || 
                node.type === 'VariableDeclarator' ||
                (node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'FunctionDeclaration')
              );
              
              if (firstFunction) {
                const functionBody = firstFunction.body || 
                                   (firstFunction.declaration && firstFunction.declaration.body);
                
                if (functionBody && functionBody.type === 'BlockStatement') {
                  const firstStatement = functionBody.body[0];
                  const useThemeStatement = '\n  const { tokens } = useTheme();\n';
                  
                  return fixer.insertTextBefore(firstStatement, useThemeStatement);
                }
              }
              
              return null;
            }
          });
        }
      }
    };
  },
}; 