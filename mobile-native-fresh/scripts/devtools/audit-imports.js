#!/usr/bin/env node

/**
 * Import Audit Script
 * Scans src-nextgen for missing imports and dependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC_NEXTGEN_PATH = process.argv[2] || 'src-nextgen';

function findTypeScriptFiles(dir) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

function extractImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = [];
  
  // Match import statements
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"`]([^'"`]+)['"`]/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Skip node_modules and external packages
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      continue;
    }
    
    imports.push({
      file: filePath,
      importPath,
      line: content.substring(0, match.index).split('\n').length
    });
  }
  
  return imports;
}

function checkImportExists(importPath, baseDir) {
  const possibleExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
  const possiblePaths = [
    importPath,
    importPath + '/index.ts',
    importPath + '/index.tsx',
    importPath + '/index.js',
    importPath + '/index.jsx'
  ];
  
  for (const ext of possibleExtensions) {
    possiblePaths.push(importPath + ext);
  }
  
  for (const possiblePath of possiblePaths) {
    const fullPath = path.resolve(baseDir, possiblePath);
    if (fs.existsSync(fullPath)) {
      return true;
    }
  }
  
  return false;
}

function auditImports() {
  console.log('🔍 Starting import audit...');
  
  const files = findTypeScriptFiles(SRC_NEXTGEN_PATH);
  console.log(`📁 Found ${files.length} TypeScript files`);
  
  const allImports = [];
  const missingImports = [];
  const existingImports = [];
  
  for (const file of files) {
    const imports = extractImports(file);
    allImports.push(...imports);
    
    for (const imp of imports) {
      const relativePath = path.relative(process.cwd(), file);
      const baseDir = path.dirname(file);
      
      if (checkImportExists(imp.importPath, baseDir)) {
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
  
  // Group missing imports by module
  const missingModules = {};
  for (const imp of missingImports) {
    const module = imp.importPath;
    if (!missingModules[module]) {
      missingModules[module] = [];
    }
    missingModules[module].push(imp);
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      totalImports: allImports.length,
      existingImports: existingImports.length,
      missingImports: missingImports.length,
      missingModules: Object.keys(missingModules).length
    },
    missingModules: Object.entries(missingModules).map(([module, imports]) => ({
      module,
      importCount: imports.length,
      files: imports.map(imp => ({
        file: imp.relativePath,
        line: imp.line
      }))
    })),
    details: {
      missing: missingImports,
      existing: existingImports
    }
  };
  
  console.log('\n📊 Audit Summary:');
  console.log(`  Total files: ${report.summary.totalFiles}`);
  console.log(`  Total imports: ${report.summary.totalImports}`);
  console.log(`  Existing imports: ${report.summary.existingImports}`);
  console.log(`  Missing imports: ${report.summary.missingImports}`);
  console.log(`  Missing modules: ${report.summary.missingModules}`);
  
  if (report.summary.missingModules > 0) {
    console.log('\n❌ Missing Modules:');
    report.missingModules.forEach(({ module, importCount, files }) => {
      console.log(`  ${module} (${importCount} imports)`);
      files.slice(0, 3).forEach(file => {
        console.log(`    - ${file.file}:${file.line}`);
      });
      if (files.length > 3) {
        console.log(`    ... and ${files.length - 3} more`);
      }
    });
  }
  
  return report;
}

// Run the audit
try {
  const report = auditImports();
  
  // Write report to file
  const outputPath = 'validations/dependency-audit.json';
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  
  console.log(`\n✅ Audit report written to: ${outputPath}`);
  
  // Exit with error code if there are missing imports
  if (report.summary.missingImports > 0) {
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Audit failed:', error.message);
  process.exit(1);
} 