#!/usr/bin/env node

/**
 * FIXER TOOL: fix-scrollview-ref-styles.cjs
 * 🧠 Moves layout props from style={styles.*} to contentContainerStyle for <ScrollView>
 * 🔐 Handles style references (e.g., style={styles.container}) by modifying the referenced style object
 * 📝 Logs all mutations to /tmp/scrollview-ref-fix-log.json
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
const OUT_PATH = '/tmp/scrollview-ref-fix-log.json';
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
    let styleObjects = new Map(); // Track style objects by name
    
    // First pass: collect all style objects
    traverse(ast, {
      VariableDeclarator(path) {
        if (path.node.id.name && path.node.init && 
            path.node.init.type === 'CallExpression' &&
            path.node.init.callee.type === 'MemberExpression' &&
            path.node.init.callee.object.name === 'StyleSheet' &&
            path.node.init.callee.property.name === 'create') {
          const styleName = path.node.id.name;
          if (path.node.init.arguments[0] && 
              path.node.init.arguments[0].type === 'ObjectExpression') {
            styleObjects.set(styleName, path.node.init.arguments[0]);
          }
        }
      },
      // Handle getStyles = (tokens) => StyleSheet.create({...}) pattern
      AssignmentExpression(path) {
        if (path.node.left.type === 'Identifier' && 
            path.node.left.name === 'getStyles' &&
            path.node.right.type === 'ArrowFunctionExpression' &&
            path.node.right.body.type === 'CallExpression' &&
            path.node.right.body.callee.type === 'MemberExpression' &&
            path.node.right.body.callee.object.name === 'StyleSheet' &&
            path.node.right.body.callee.property.name === 'create') {
          if (path.node.right.body.arguments[0] && 
              path.node.right.body.arguments[0].type === 'ObjectExpression') {
            styleObjects.set('getStyles', path.node.right.body.arguments[0]);
          }
        }
      }
    });
    
    // Second pass: find ScrollView with style references and fix them
    traverse(ast, {
      JSXElement(path) {
        const opening = path.node.openingElement;
        if (!opening || opening.name.name !== 'ScrollView') return;
        
        // Find style={styles.*} references
        const styleAttr = opening.attributes.find(
          (attr) => attr.name && attr.name.name === 'style'
        );
        
        if (!styleAttr || !styleAttr.value) return;
        
                // Handle style={styles.something} references
        if (styleAttr.value.type === 'JSXExpressionContainer' &&
            styleAttr.value.expression.type === 'MemberExpression' &&
            styleAttr.value.expression.object.name === 'styles' &&
            styleAttr.value.expression.property.name) {
          
          const styleName = styleAttr.value.expression.property.name;
          const styleObj = styleObjects.get(styleName);
          
          if (!styleObj) return;
          
          // Check if this style has layout props
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
          
          // Remove layout props from the style object
          styleObj.properties = nonLayoutPropsList;
          
          // Check if contentContainerStyle already exists
          let ccsAttr = opening.attributes.find(
            (attr) => attr.name && attr.name.name === 'contentContainerStyle'
          );
          
          if (!ccsAttr) {
            // Create new contentContainerStyle with layout props
            const layoutStyleObj = t.objectExpression(layoutPropsList);
            opening.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('contentContainerStyle'),
                t.jsxExpressionContainer(layoutStyleObj)
              )
            );
          } else if (
            ccsAttr.value &&
            ccsAttr.value.type === 'JSXExpressionContainer' &&
            ccsAttr.value.expression.type === 'ObjectExpression'
          ) {
            // Merge into existing contentContainerStyle
            ccsAttr.value.expression.properties.push(...layoutPropsList);
          } else {
            // If not an object, skip for safety
            return;
          }
          
          mutated = true;
          results.push({
            file,
            loc: path.node.loc && path.node.loc.start,
            styleName,
            movedProps: layoutPropsList.map(p => p.key.name)
          });
        }
        
        // Handle style={getStyles(tokens).something} references
        if (styleAttr.value.type === 'JSXExpressionContainer' &&
            styleAttr.value.expression.type === 'MemberExpression' &&
            styleAttr.value.expression.object.type === 'CallExpression' &&
            styleAttr.value.expression.object.callee.name === 'getStyles' &&
            styleAttr.value.expression.property.name) {
          
          const styleName = styleAttr.value.expression.property.name;
          const styleObj = styleObjects.get('getStyles');
          
          if (!styleObj) return;
          
          // Find the specific style property in the getStyles object
          const targetStyle = styleObj.properties.find(
            prop => t.isObjectProperty(prop) && 
                   t.isIdentifier(prop.key) && 
                   prop.key.name === styleName
          );
          
          if (!targetStyle || !t.isObjectProperty(targetStyle) || 
              !t.isObjectExpression(targetStyle.value)) return;
          
          // Check if this style has layout props
          const layoutPropsList = [];
          const nonLayoutPropsList = [];
          
          for (const prop of targetStyle.value.properties) {
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
          
          // Remove layout props from the style object
          targetStyle.value.properties = nonLayoutPropsList;
          
          // Check if contentContainerStyle already exists
          let ccsAttr = opening.attributes.find(
            (attr) => attr.name && attr.name.name === 'contentContainerStyle'
          );
          
          if (!ccsAttr) {
            // Create new contentContainerStyle with layout props
            const layoutStyleObj = t.objectExpression(layoutPropsList);
            opening.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('contentContainerStyle'),
                t.jsxExpressionContainer(layoutStyleObj)
              )
            );
          } else if (
            ccsAttr.value &&
            ccsAttr.value.type === 'JSXExpressionContainer' &&
            ccsAttr.value.expression.type === 'ObjectExpression'
          ) {
            // Merge into existing contentContainerStyle
            ccsAttr.value.expression.properties.push(...layoutPropsList);
          } else {
            // If not an object, skip for safety
            return;
          }
          
          mutated = true;
          results.push({
            file,
            loc: path.node.loc && path.node.loc.start,
            styleName,
            movedProps: layoutPropsList.map(p => p.key.name)
          });
        }
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
  console.log(`✅ ScrollView style reference fixer complete. Log saved to ${OUT_PATH}`);
})(); 