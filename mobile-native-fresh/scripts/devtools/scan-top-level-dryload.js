#!/usr/bin/env node

/**
 * Top-Level Dry Load Scanner
 * Scans screens directory for missing components and hooks
 */

const fs = require('fs');
const path = require('path');

const SCREENS_PATH = process.argv[2] || 'src-nextgen/screens';

function findScreenFiles(dir) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.')) {
        scan(fullPath);
      } else if (item.endsWith('.tsx') && !item.endsWith('.test.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

function extractComponentImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = [];
  
  // Match import statements for components and hooks
  const importRegex = /import\s+(?:\{([^}]*)\}|\*\s+as\s+(\w+)|(\w+))\s+from\s+['"`]([^'"`]+)['"`]/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const namedImports = match[1];
    const namespaceImport = match[2];
    const defaultImport = match[3];
    const importPath = match[4];
    
    // Skip external packages
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      continue;
    }
    
    if (namedImports) {
      // Parse named imports
      const namedImportsList = namedImports.split(',').map(imp => imp.trim());
      for (const imp of namedImportsList) {
        if (imp.includes(' as ')) {
          const [original, alias] = imp.split(' as ').map(s => s.trim());
          imports.push({
            file: filePath,
            importPath,
            component: original,
            alias,
            type: 'named'
          });
        } else {
          imports.push({
            file: filePath,
            importPath,
            component: imp,
            type: 'named'
          });
        }
      }
    } else if (defaultImport) {
      imports.push({
        file: filePath,
        importPath,
        component: defaultImport,
        type: 'default'
      });
    }
  }
  
  return imports;
}

function categorizeImports(imports) {
  const categories = {
    components: [],
    hooks: [],
    types: [],
    utils: [],
    providers: [],
    screens: [],
    other: []
  };
  
  for (const imp of imports) {
    const component = imp.component.toLowerCase();
    
    if (component.includes('use') && component !== 'use') {
      categories.hooks.push(imp);
    } else if (component.includes('provider') || component.includes('context')) {
      categories.providers.push(imp);
    } else if (component.includes('screen')) {
      categories.screens.push(imp);
    } else if (component.includes('type') || component.includes('interface')) {
      categories.types.push(imp);
    } else if (component.includes('util') || component.includes('helper')) {
      categories.utils.push(imp);
    } else if (component.includes('card') || component.includes('button') || 
               component.includes('text') || component.includes('view') ||
               component.includes('modal') || component.includes('form')) {
      categories.components.push(imp);
    } else {
      categories.other.push(imp);
    }
  }
  
  return categories;
}

function scanTopLevelLoads() {
  console.log('🔍 Starting top-level dry load scan...');
  
  if (!fs.existsSync(SCREENS_PATH)) {
    console.log(`❌ Screens directory not found: ${SCREENS_PATH}`);
    return null;
  }
  
  const files = findScreenFiles(SCREENS_PATH);
  console.log(`📁 Found ${files.length} screen files`);
  
  const allImports = [];
  const missingImports = [];
  const existingImports = [];
  
  for (const file of files) {
    const imports = extractComponentImports(file);
    allImports.push(...imports);
    
    for (const imp of imports) {
      const relativePath = path.relative(process.cwd(), file);
      const baseDir = path.dirname(file);
      
      // Check if the import exists
      const possibleExtensions = ['.ts', '.tsx', '.js', '.jsx'];
      const possiblePaths = [
        imp.importPath,
        imp.importPath + '/index.ts',
        imp.importPath + '/index.tsx',
        imp.importPath + '/index.js',
        imp.importPath + '/index.jsx'
      ];
      
      for (const ext of possibleExtensions) {
        possiblePaths.push(imp.importPath + ext);
      }
      
      let exists = false;
      for (const possiblePath of possiblePaths) {
        const fullPath = path.resolve(baseDir, possiblePath);
        if (fs.existsSync(fullPath)) {
          exists = true;
          break;
        }
      }
      
      if (exists) {
        existingImports.push({
          ...imp,
          relativePath,
          status: 'exists'
        });
      } else {
        missingImports.push({
          ...imp,
          relativePath,
          status: 'missing'
        });
      }
    }
  }
  
  // Categorize imports
  const categorized = categorizeImports(allImports);
  const categorizedMissing = categorizeImports(missingImports);
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      totalImports: allImports.length,
      existingImports: existingImports.length,
      missingImports: missingImports.length
    },
    categories: {
      total: Object.fromEntries(
        Object.entries(categorized).map(([key, imports]) => [key, imports.length])
      ),
      missing: Object.fromEntries(
        Object.entries(categorizedMissing).map(([key, imports]) => [key, imports.length])
      )
    },
    missingByCategory: categorizedMissing,
    details: {
      missing: missingImports,
      existing: existingImports
    }
  };
  
  console.log('\n📊 Scan Summary:');
  console.log(`  Total files: ${report.summary.totalFiles}`);
  console.log(`  Total imports: ${report.summary.totalImports}`);
  console.log(`  Existing imports: ${report.summary.existingImports}`);
  console.log(`  Missing imports: ${report.summary.missingImports}`);
  
  console.log('\n📋 Import Categories:');
  Object.entries(report.categories.total).forEach(([category, count]) => {
    const missing = report.categories.missing[category] || 0;
    console.log(`  ${category}: ${count} total, ${missing} missing`);
  });
  
  if (report.summary.missingImports > 0) {
    console.log('\n❌ Missing Imports by Category:');
    Object.entries(categorizedMissing).forEach(([category, imports]) => {
      if (imports.length > 0) {
        console.log(`\n  ${category.toUpperCase()}:`);
        imports.slice(0, 5).forEach(imp => {
          console.log(`    - ${imp.component} from ${imp.importPath} (${imp.relativePath})`);
        });
        if (imports.length > 5) {
          console.log(`    ... and ${imports.length - 5} more`);
        }
      }
    });
  }
  
  return report;
}

// Run the scan
try {
  const report = scanTopLevelLoads();
  
  if (report) {
    // Write report to file
    const outputPath = 'validations/top-level-load-check.json';
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    
    console.log(`\n✅ Scan report written to: ${outputPath}`);
    
    // Exit with error code if there are missing imports
    if (report.summary.missingImports > 0) {
      process.exit(1);
    }
  }
} catch (error) {
  console.error('❌ Scan failed:', error.message);
  process.exit(1);
} 