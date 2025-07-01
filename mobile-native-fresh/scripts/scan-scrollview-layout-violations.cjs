#!/usr/bin/env node

/**
 * SCAN TOOL: scan-scrollview-layout-violations.cjs
 * 🧠 Finds <ScrollView> components using layout props in `style` instead of `contentContainerStyle`
 * 📌 Use before or after fix pass to verify JSX layout compliance
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const PROJECT_ROOT = path.resolve(__dirname, '../src');
const OUT_PATH = '/tmp/scrollview-layout-violations.json';

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

glob(`${PROJECT_ROOT}/**/*.tsx`, {}, function (err, files) {
  if (err) throw err;

  files.forEach((file) => {
    const code = fs.readFileSync(file, 'utf-8');
    let ast;

    try {
      ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });
    } catch (parseError) {
      return;
    }

    traverse(ast, {
      JSXElement(path) {
        const opening = path.node.openingElement;
        if (!opening || opening.name.name !== 'ScrollView') return;

        const styleAttr = opening.attributes.find(
          (attr) => attr.name && attr.name.name === 'style'
        );

        if (!styleAttr || !styleAttr.value || styleAttr.value.type !== 'JSXExpressionContainer') return;

        const propsText = code.slice(styleAttr.start, styleAttr.end);
        const offending = [...layoutProps].some((prop) => propsText.includes(prop));
        if (offending) {
          results.push({
            file,
            loc: path.node.loc.start,
            props: propsText
          });
        }
      }
    });
  });

  fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
  console.log(`✅ ScrollView layout violation report saved to ${OUT_PATH}`);
});

