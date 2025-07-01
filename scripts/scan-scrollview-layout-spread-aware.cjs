#!/usr/bin/env node

/**
 * SCANNER: scan-scrollview-layout-spread-aware.cjs
 * 🔍 Identifies layout props incorrectly placed in `style` on <ScrollView>, even when spread from style objects.
 * 🧠 Supports resolution of identifiers and simple spread patterns like:
 *    - style={{ alignItems: 'center' }}
 *    - style={styles.container}
 *    - style={{ ...styles.container, justifyContent: 'center' }}
 * 📄 Outputs: /tmp/scrollview-layout-spread-violations.json
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const PROJECT_ROOT = path.resolve(__dirname, '../src');
const OUTPUT_PATH = '/tmp/scrollview-layout-spread-violations.json';
const layoutProps = new Set([
  'alignItems', 'justifyContent', 'flexDirection', 'gap', 'rowGap', 'columnGap',
  'padding', 'paddingHorizontal', 'paddingVertical',
  'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'
]);

const results = [];

glob(`${PROJECT_ROOT}/**/*.tsx`, {}, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const code = fs.readFileSync(file, 'utf8');
    let ast;
    const scopeVars = {};

    try {
      ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });
    } catch (e) {
      console.warn(`⚠️ Failed to parse ${file}`);
      return;
    }

    traverse(ast, {
      VariableDeclarator(path) {
        if (
          t.isIdentifier(path.node.id) &&
          t.isObjectExpression(path.node.init)
        ) {
          const varName = path.node.id.name;
          scopeVars[varName] = path.node.init;
        }
      },

      JSXElement(path) {
        const opening = path.node.openingElement;
        if (!t.isJSXIdentifier(opening.name, { name: 'ScrollView' })) return;

        const styleAttr = opening.attributes.find(
          (attr) =>
            t.isJSXAttribute(attr) &&
            attr.name.name === 'style' &&
            t.isJSXExpressionContainer(attr.value)
        );
        if (!styleAttr) return;

        const expression = styleAttr.value.expression;

        let propsToCheck = [];

        // Direct object: style={{ alignItems: 'center' }}
        if (t.isObjectExpression(expression)) {
          propsToCheck = expression.properties;
        }

        // style={styles.container} or style={someVar}
        else if (t.isMemberExpression(expression) || t.isIdentifier(expression)) {
          const varName = t.isIdentifier(expression)
            ? expression.name
            : t.isIdentifier(expression.object)
            ? expression.object.name
            : null;

          if (varName && scopeVars[varName]) {
            propsToCheck = scopeVars[varName].properties;
          }
        }

        // style={{ ...styles.foo, justifyContent: 'center' }}
        else if (t.isObjectExpression(expression)) {
          propsToCheck = expression.properties;
        }

        // Check resolved props for layout violations
        const hasViolation = propsToCheck.some((prop) => {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
            return layoutProps.has(prop.key.name);
          }
          return false;
        });

        if (hasViolation) {
          results.push({
            file,
            loc: path.node.loc.start,
            source: code.split('\n').slice(path.node.loc.start.line - 1, path.node.loc.start.line + 2).join('\n')
          });
        }
      }
    });
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
  console.log(`✅ ScrollView spread-aware layout violation report saved to ${OUTPUT_PATH}`);
});

