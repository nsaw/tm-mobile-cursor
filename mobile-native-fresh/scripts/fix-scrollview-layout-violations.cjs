#!/usr/bin/env node

/**
 * FIXER TOOL: fix-scrollview-layout-violations.cjs
 * 🧠 Moves layout props from style={{...}} to contentContainerStyle={{...}} for <ScrollView> (inline only)
 * 🔐 Does NOT touch style references (e.g., style={styles.foo})
 * 📝 Logs all mutations to /tmp/scrollview-fix-log.json
 * 📁 Creates .bak backup of each modified file
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const PROJECT_ROOT = path.resolve(__dirname, '../src');
const OUT_PATH = '/tmp/scrollview-fix-log.json';
const layoutProps = new Set([
  'alignItems',
  'justifyContent',
  'flexDirection',
  'gap',
  'rowGap',
  'columnGap',
  'padding',
  'paddingHorizontal',
  'paddingVertical',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight'
]);

let results = [];

(async () => {
  const files = await glob(`${PROJECT_ROOT}/**/*.tsx`);
  for (const file of files) {
    const code = fs.readFileSync(file, 'utf-8');
    let ast;
    try {
      ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });
    } catch (parseError) {
      continue;
    }
    let mutated = false;
    traverse(ast, {
      JSXElement(path) {
        const opening = path.node.openingElement;
        if (!opening || opening.name.name !== 'ScrollView') return;
        // Find style={{...}} only
        const styleAttrIdx = opening.attributes.findIndex(
          (attr) => attr.name && attr.name.name === 'style'
        );
        if (styleAttrIdx === -1) return;
        const styleAttr = opening.attributes[styleAttrIdx];
        // Only handle inline object: style={{...}}
        if (!styleAttr.value ||
            styleAttr.value.type !== 'JSXExpressionContainer' ||
            styleAttr.value.expression.type !== 'ObjectExpression') return;
        const styleObj = styleAttr.value.expression;
        // Split layout and non-layout props
        const layoutPropsList = [];
        const nonLayoutPropsList = [];
        for (const prop of styleObj.properties) {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
            if (layoutProps.has(prop.key.name)) {
              layoutPropsList.push(prop);
            } else {
              nonLayoutPropsList.push(prop);
            }
          } else {
            nonLayoutPropsList.push(prop); // spread or computed
          }
        }
        if (layoutPropsList.length === 0) return;
        // Remove layout props from style
        styleObj.properties = nonLayoutPropsList;
        // Find or create contentContainerStyle
        let ccsAttr = opening.attributes.find(
          (attr) => attr.name && attr.name.name === 'contentContainerStyle'
        );
        if (!ccsAttr) {
          // Add new contentContainerStyle
          opening.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('contentContainerStyle'),
              t.jsxExpressionContainer(
                t.objectExpression(layoutPropsList)
              )
            )
          );
        } else if (
          ccsAttr.value &&
          ccsAttr.value.type === 'JSXExpressionContainer' &&
          ccsAttr.value.expression.type === 'ObjectExpression'
        ) {
          // Merge into existing object
          ccsAttr.value.expression.properties.push(...layoutPropsList);
        } else {
          // If not an object, skip for safety
          return;
        }
        mutated = true;
        results.push({
          file,
          loc: path.node.loc && path.node.loc.start,
          movedProps: layoutPropsList.map(p => p.key.name)
        });
      }
    });
    if (mutated) {
      // Backup
      fs.copyFileSync(file, file + '.bak');
      // Write mutated code
      const output = generate(ast, { retainLines: true }, code).code;
      fs.writeFileSync(file, output);
    }
  }
  fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
  console.log(`✅ ScrollView layout fixer complete. Log saved to ${OUT_PATH}`);
})(); 