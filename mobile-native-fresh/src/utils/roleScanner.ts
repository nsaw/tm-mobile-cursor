import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

export interface RoleSnapshot {
  componentName: string;
  filePath: string;
  roles: string[];
  tokens: string[];
  styleOverlays: string[];
  themeAssignment: string;
  timestamp: number;
  environment: 'legacy' | 'nextgen';
}

export interface RoleManifest {
  version: string;
  timestamp: number;
  totalComponents: number;
  totalRoles: number;
  environments: {
    legacy: number;
    nextgen: number;
  };
  roleCoverage: Record<string, number>;
  snapshots: RoleSnapshot[];
  summary: {
    componentsWithRoles: number;
    componentsWithoutRoles: number;
    roleDistribution: Record<string, number>;
    tokenUsage: Record<string, number>;
  };
}

/**
 * Scan UI components for role assignments and generate a manifest
 */
export function scanUIRoles(): RoleManifest {
  const srcPath = join(__dirname, '..');
  const componentsPath = join(srcPath, 'components');
  const snapshots: RoleSnapshot[] = [];
  
  // Scan components directory
  const components = scanDirectory(componentsPath, ['.tsx', '.ts']);
  
  for (const component of components) {
    const snapshot = analyzeComponent(component);
    if (snapshot) {
      snapshots.push(snapshot);
    }
  }
  
  // Generate manifest
  const manifest = generateManifest(snapshots);
  return manifest;
}

/**
 * Recursively scan directory for files with specified extensions
 */
function scanDirectory(dirPath: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  try {
    const items = readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...scanDirectory(fullPath, extensions));
      } else if (stat.isFile() && extensions.includes(extname(item))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dirPath}:`, error);
  }
  
  return files;
}

/**
 * Analyze a single component file for role information
 */
function analyzeComponent(filePath: string): RoleSnapshot | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const componentName = extractComponentName(filePath);
    
    // Extract roles from content
    const roles = extractRoles(content);
    const tokens = extractTokens(content);
    const styleOverlays = extractStyleOverlays(content);
    const themeAssignment = extractThemeAssignment(content);
    const environment = determineEnvironment(filePath);
    
    return {
      componentName,
      filePath,
      roles,
      tokens,
      styleOverlays,
      themeAssignment,
      timestamp: Date.now(),
      environment,
    };
  } catch (error) {
    console.warn(`Warning: Could not analyze component ${filePath}:`, error);
    return null;
  }
}

/**
 * Extract component name from file path
 */
function extractComponentName(filePath: string): string {
  const fileName = filePath.split('/').pop() || '';
  return fileName.replace(/\.(tsx|ts)$/, '');
}

/**
 * Extract role assignments from component content
 */
function extractRoles(content: string): string[] {
  const roles: string[] = [];
  
  // Look for role prop assignments
  const roleMatches = content.match(/role\s*=\s*["']([^"']+)["']/g);
  if (roleMatches) {
    roleMatches.forEach(match => {
      const role = match.match(/["']([^"']+)["']/)?.[1];
      if (role) roles.push(role);
    });
  }
  
  // Look for AutoRoleView usage
  const autoRoleMatches = content.match(/AutoRoleView\s+role\s*=\s*["']([^"']+)["']/g);
  if (autoRoleMatches) {
    autoRoleMatches.forEach(match => {
      const role = match.match(/["']([^"']+)["']/)?.[1];
      if (role) roles.push(role);
    });
  }
  
  // Look for role type imports
  const roleTypeMatches = content.match(/import.*Role\s+from.*role/gi);
  if (roleTypeMatches) {
    roles.push('role-type-imported');
  }
  
  return [...new Set(roles)]; // Remove duplicates
}

/**
 * Extract token usage from component content
 */
function extractTokens(content: string): string[] {
  const tokens: string[] = [];
  
  // Look for theme token usage
  const tokenMatches = content.match(/theme\.([a-zA-Z]+)/g);
  if (tokenMatches) {
    tokenMatches.forEach(match => {
      const token = match.replace('theme.', '');
      tokens.push(token);
    });
  }
  
  // Look for color token usage
  const colorMatches = content.match(/colors\.([a-zA-Z]+)/g);
  if (colorMatches) {
    colorMatches.forEach(match => {
      const token = match.replace('colors.', '');
      tokens.push(`color-${token}`);
    });
  }
  
  // Look for spacing token usage
  const spacingMatches = content.match(/spacing\.([a-zA-Z]+)/g);
  if (spacingMatches) {
    spacingMatches.forEach(match => {
      const token = match.replace('spacing.', '');
      tokens.push(`spacing-${token}`);
    });
  }
  
  return [...new Set(tokens)]; // Remove duplicates
}

/**
 * Extract style overlays from component content
 */
function extractStyleOverlays(content: string): string[] {
  const overlays: string[] = [];
  
  // Look for style prop assignments
  const styleMatches = content.match(/style\s*=\s*\{([^}]+)\}/g);
  if (styleMatches) {
    styleMatches.forEach(match => {
      // Extract style properties
      const properties = match.match(/([a-zA-Z]+)\s*:\s*[^,}]+/g);
      if (properties) {
        properties.forEach(prop => {
          const propertyName = prop.split(':')[0].trim();
          overlays.push(propertyName);
        });
      }
    });
  }
  
  return [...new Set(overlays)]; // Remove duplicates
}

/**
 * Extract theme assignment from component content
 */
function extractThemeAssignment(content: string): string {
  // Look for theme context usage
  if (content.includes('useTheme()')) {
    return 'theme-context';
  }
  
  // Look for theme prop
  if (content.includes('theme=')) {
    return 'theme-prop';
  }
  
  // Look for SafeComponentZone usage
  if (content.includes('SafeComponentZone')) {
    return 'frozen-zone';
  }
  
  return 'default';
}

/**
 * Determine environment based on file path
 */
function determineEnvironment(filePath: string): 'legacy' | 'nextgen' {
  if (filePath.includes('src-nextgen')) {
    return 'nextgen';
  }
  return 'legacy';
}

/**
 * Generate the complete manifest from snapshots
 */
function generateManifest(snapshots: RoleSnapshot[]): RoleManifest {
  const roleDistribution: Record<string, number> = {};
  const tokenUsage: Record<string, number> = {};
  let componentsWithRoles = 0;
  let componentsWithoutRoles = 0;
  
  // Count roles and tokens
  snapshots.forEach(snapshot => {
    if (snapshot.roles.length > 0) {
      componentsWithRoles++;
    } else {
      componentsWithoutRoles++;
    }
    
    snapshot.roles.forEach(role => {
      roleDistribution[role] = (roleDistribution[role] || 0) + 1;
    });
    
    snapshot.tokens.forEach(token => {
      tokenUsage[token] = (tokenUsage[token] || 0) + 1;
    });
  });
  
  // Count environments
  const environments = {
    legacy: snapshots.filter(s => s.environment === 'legacy').length,
    nextgen: snapshots.filter(s => s.environment === 'nextgen').length,
  };
  
  // Calculate role coverage
  const roleCoverage: Record<string, number> = {};
  const totalComponents = snapshots.length;
  Object.keys(roleDistribution).forEach(role => {
    roleCoverage[role] = (roleDistribution[role] / totalComponents) * 100;
  });
  
  return {
    version: '1.0.0',
    timestamp: Date.now(),
    totalComponents,
    totalRoles: Object.values(roleDistribution).reduce((sum, count) => sum + count, 0),
    environments,
    roleCoverage,
    snapshots,
    summary: {
      componentsWithRoles,
      componentsWithoutRoles,
      roleDistribution,
      tokenUsage,
    },
  };
} 