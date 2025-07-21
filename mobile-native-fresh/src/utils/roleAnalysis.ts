// src/utils/roleAnalysis.ts
// Role analysis and validation framework for dual-mount architecture

export interface RoleDefinition {
  name: string;
  description: string;
  category: 'layout' | 'content' | 'interaction' | 'navigation' | 'feedback';
  priority: 'low' | 'medium' | 'high' | 'critical';
  required: boolean;
  autoAssign: boolean;
  conflicts: string[];
  dependencies: string[];
}

export interface RoleAssignment {
  componentName: string;
  roleName: string;
  environment: 'legacy' | 'nextgen';
  timestamp: number;
  assignedBy: 'manual' | 'auto' | 'inherited';
  confidence: number;
  metadata: {
    filePath: string;
    lineNumber: number;
    context: string;
  };
}

export interface RoleConflict {
  componentName: string;
  environment: 'legacy' | 'nextgen';
  conflictingRoles: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolution: string;
  timestamp: number;
}

export interface RoleAnalysis {
  componentName: string;
  environment: 'legacy' | 'nextgen';
  assignedRoles: RoleAssignment[];
  conflicts: RoleConflict[];
  missingRoles: string[];
  recommendations: string[];
  score: number;
  timestamp: number;
}

export interface RoleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  score: number;
}

export interface RoleAnalysisConfig {
  autoAssign: boolean;
  strictMode: boolean;
  conflictDetection: boolean;
  validationRules: string[];
  priorityWeights: Record<string, number>;
}

class RoleAnalyzer {
  private roles: Map<string, RoleDefinition> = new Map();
  private assignments: RoleAssignment[] = [];
  private conflicts: RoleConflict[] = [];
  private config: RoleAnalysisConfig;

  constructor(config: Partial<RoleAnalysisConfig> = {}) {
    this.config = {
      autoAssign: true,
      strictMode: false,
      conflictDetection: true,
      validationRules: ['required-roles', 'no-conflicts', 'proper-hierarchy'],
      priorityWeights: {
        critical: 1.0,
        high: 0.8,
        medium: 0.6,
        low: 0.4,
      },
      ...config,
    };

    this.initializeDefaultRoles();
  }

  /**
   * Initialize default role definitions
   */
  private initializeDefaultRoles(): void {
    const defaultRoles: RoleDefinition[] = [
      {
        name: 'container',
        description: 'Layout container component',
        category: 'layout',
        priority: 'medium',
        required: false,
        autoAssign: true,
        conflicts: ['content'],
        dependencies: [],
      },
      {
        name: 'content',
        description: 'Content display component',
        category: 'content',
        priority: 'high',
        required: true,
        autoAssign: true,
        conflicts: ['container'],
        dependencies: [],
      },
      {
        name: 'button',
        description: 'Interactive button component',
        category: 'interaction',
        priority: 'high',
        required: false,
        autoAssign: true,
        conflicts: ['link'],
        dependencies: [],
      },
      {
        name: 'link',
        description: 'Navigation link component',
        category: 'navigation',
        priority: 'high',
        required: false,
        autoAssign: true,
        conflicts: ['button'],
        dependencies: [],
      },
      {
        name: 'input',
        description: 'Form input component',
        category: 'interaction',
        priority: 'high',
        required: false,
        autoAssign: true,
        conflicts: [],
        dependencies: ['label'],
      },
      {
        name: 'label',
        description: 'Form label component',
        category: 'content',
        priority: 'medium',
        required: false,
        autoAssign: true,
        conflicts: [],
        dependencies: [],
      },
      {
        name: 'navigation',
        description: 'Navigation component',
        category: 'navigation',
        priority: 'critical',
        required: true,
        autoAssign: false,
        conflicts: [],
        dependencies: [],
      },
      {
        name: 'feedback',
        description: 'User feedback component',
        category: 'feedback',
        priority: 'medium',
        required: false,
        autoAssign: true,
        conflicts: [],
        dependencies: [],
      },
    ];

    defaultRoles.forEach(role => {
      this.roles.set(role.name, role);
    });
  }

  /**
   * Analyze component roles
   */
  analyzeComponent(
    componentName: string,
    environment: 'legacy' | 'nextgen',
    componentCode: string
  ): RoleAnalysis {
    try {
      // Set environment variable for dual-mount
      process.env.EXPO_PUBLIC_USE_NEXTGEN = environment === 'nextgen' ? 'true' : 'false';
      process.env.EXPO_PUBLIC_ENVIRONMENT = environment;

      // Analyze component code for role indicators
      const detectedRoles = this.detectRoles(componentCode);
      const assignedRoles = this.assignRoles(componentName, environment, detectedRoles);
      const conflicts = this.detectConflicts(componentName, environment, assignedRoles);
      const missingRoles = this.findMissingRoles(componentName, environment, assignedRoles);
      const recommendations = this.generateRecommendations(componentName, environment, assignedRoles, conflicts, missingRoles);
      const score = this.calculateScore(assignedRoles, conflicts, missingRoles);

      const analysis: RoleAnalysis = {
        componentName,
        environment,
        assignedRoles,
        conflicts,
        missingRoles,
        recommendations,
        score,
        timestamp: Date.now(),
      };

      console.log(`🔍 Role analysis completed for ${componentName} (${environment})`);
      
      return analysis;
    } catch (error) {
      console.error(`❌ Failed to analyze ${componentName}:`, error);
      throw error;
    }
  }

  /**
   * Detect roles from component code
   */
  private detectRoles(componentCode: string): string[] {
    const detectedRoles: string[] = [];
    const code = componentCode.toLowerCase();

    // Detect roles based on code patterns
    if (code.includes('touchableopacity') || code.includes('pressable') || code.includes('onpress')) {
      detectedRoles.push('button');
    }

    if (code.includes('text') && (code.includes('onpress') || code.includes('href'))) {
      detectedRoles.push('link');
    }

    if (code.includes('textinput') || code.includes('input')) {
      detectedRoles.push('input');
    }

    if (code.includes('text') && !code.includes('onpress') && !code.includes('input')) {
      detectedRoles.push('content');
    }

    if (code.includes('view') && code.includes('style') && !code.includes('onpress')) {
      detectedRoles.push('container');
    }

    if (code.includes('navigation') || code.includes('navigator')) {
      detectedRoles.push('navigation');
    }

    if (code.includes('alert') || code.includes('toast') || code.includes('modal')) {
      detectedRoles.push('feedback');
    }

    if (code.includes('label') || code.includes('aria-label')) {
      detectedRoles.push('label');
    }

    return detectedRoles;
  }

  /**
   * Assign roles to component
   */
  private assignRoles(
    componentName: string,
    environment: 'legacy' | 'nextgen',
    detectedRoles: string[]
  ): RoleAssignment[] {
    const assignments: RoleAssignment[] = [];

    for (const roleName of detectedRoles) {
      const role = this.roles.get(roleName);
      if (role) {
        const assignment: RoleAssignment = {
          componentName,
          roleName,
          environment,
          timestamp: Date.now(),
          assignedBy: 'auto',
          confidence: 0.8, // Base confidence for auto-assignment
          metadata: {
            filePath: `src/components/${componentName}.tsx`,
            lineNumber: 1,
            context: 'Auto-detected from component code',
          },
        };

        assignments.push(assignment);
        this.assignments.push(assignment);
      }
    }

    return assignments;
  }

  /**
   * Detect role conflicts
   */
  private detectConflicts(
    componentName: string,
    environment: 'legacy' | 'nextgen',
    assignments: RoleAssignment[]
  ): RoleConflict[] {
    const conflicts: RoleConflict[] = [];

    for (let i = 0; i < assignments.length; i++) {
      for (let j = i + 1; j < assignments.length; j++) {
        const role1 = this.roles.get(assignments[i].roleName);
        const role2 = this.roles.get(assignments[j].roleName);

        if (role1 && role2 && role1.conflicts.includes(role2.name)) {
          const conflict: RoleConflict = {
            componentName,
            environment,
            conflictingRoles: [role1.name, role2.name],
            severity: this.determineConflictSeverity(role1, role2),
            description: `Conflicting roles: ${role1.name} and ${role2.name}`,
            resolution: `Choose one role: ${role1.name} or ${role2.name}`,
            timestamp: Date.now(),
          };

          conflicts.push(conflict);
          this.conflicts.push(conflict);
        }
      }
    }

    return conflicts;
  }

  /**
   * Find missing required roles
   */
  private findMissingRoles(
    componentName: string,
    environment: 'legacy' | 'nextgen',
    assignments: RoleAssignment[]
  ): string[] {
    const missingRoles: string[] = [];
    const assignedRoleNames = assignments.map(a => a.roleName);

    for (const [roleName, role] of this.roles) {
      if (role.required && !assignedRoleNames.includes(roleName)) {
        missingRoles.push(roleName);
      }
    }

    return missingRoles;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    componentName: string,
    environment: 'legacy' | 'nextgen',
    assignments: RoleAssignment[],
    conflicts: RoleConflict[],
    missingRoles: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Recommendations for conflicts
    conflicts.forEach(conflict => {
      recommendations.push(`🔴 CONFLICT: ${conflict.description} - ${conflict.resolution}`);
    });

    // Recommendations for missing roles
    missingRoles.forEach(roleName => {
      const role = this.roles.get(roleName);
      if (role) {
        recommendations.push(`⚠️ MISSING: Add ${roleName} role - ${role.description}`);
      }
    });

    // Recommendations for improvements
    if (assignments.length === 0) {
      recommendations.push('💡 SUGGESTION: Consider adding explicit roles to improve accessibility');
    }

    if (assignments.length > 3) {
      recommendations.push('💡 SUGGESTION: Consider simplifying component with fewer roles');
    }

    return recommendations;
  }

  /**
   * Calculate analysis score
   */
  private calculateScore(
    assignments: RoleAssignment[],
    conflicts: RoleConflict[],
    missingRoles: string[]
  ): number {
    let score = 100;

    // Deduct points for conflicts
    conflicts.forEach(conflict => {
      const severityWeight = this.config.priorityWeights[conflict.severity] || 0.5;
      score -= 20 * severityWeight;
    });

    // Deduct points for missing required roles
    missingRoles.forEach(roleName => {
      const role = this.roles.get(roleName);
      if (role) {
        const priorityWeight = this.config.priorityWeights[role.priority] || 0.5;
        score -= 15 * priorityWeight;
      }
    });

    // Bonus points for good role coverage
    if (assignments.length > 0 && conflicts.length === 0) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Determine conflict severity
   */
  private determineConflictSeverity(role1: RoleDefinition, role2: RoleDefinition): 'low' | 'medium' | 'high' | 'critical' {
    if (role1.priority === 'critical' || role2.priority === 'critical') {
      return 'critical';
    }
    if (role1.priority === 'high' || role2.priority === 'high') {
      return 'high';
    }
    if (role1.priority === 'medium' || role2.priority === 'medium') {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Validate role assignments
   */
  validateRoleAssignments(analysis: RoleAnalysis): RoleValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check for conflicts
    if (analysis.conflicts.length > 0) {
      analysis.conflicts.forEach(conflict => {
        if (conflict.severity === 'critical' || conflict.severity === 'high') {
          errors.push(conflict.description);
        } else {
          warnings.push(conflict.description);
        }
      });
    }

    // Check for missing required roles
    if (analysis.missingRoles.length > 0) {
      analysis.missingRoles.forEach(roleName => {
        const role = this.roles.get(roleName);
        if (role && role.priority === 'critical') {
          errors.push(`Missing required role: ${roleName}`);
        } else {
          warnings.push(`Missing role: ${roleName}`);
        }
      });
    }

    // Suggestions for improvement
    if (analysis.score < 70) {
      suggestions.push('Consider reviewing role assignments for better accessibility');
    }

    if (analysis.assignedRoles.length === 0) {
      suggestions.push('Add explicit roles to improve component accessibility');
    }

    const isValid = errors.length === 0;
    const score = analysis.score;

    return {
      isValid,
      errors,
      warnings,
      suggestions,
      score,
    };
  }

  /**
   * Get role definitions
   */
  getRoleDefinitions(): RoleDefinition[] {
    return Array.from(this.roles.values());
  }

  /**
   * Get role assignments
   */
  getRoleAssignments(): RoleAssignment[] {
    return [...this.assignments];
  }

  /**
   * Get role conflicts
   */
  getRoleConflicts(): RoleConflict[] {
    return [...this.conflicts];
  }

  /**
   * Clear analysis data
   */
  clearAnalysisData(): void {
    this.assignments = [];
    this.conflicts = [];
    console.log('🗑️ Role analysis data cleared');
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<RoleAnalysisConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate role analysis report
   */
  generateReport(analyses: RoleAnalysis[]): string {
    const report = {
      timestamp: new Date().toISOString(),
      totalComponents: analyses.length,
      averageScore: analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length,
      totalConflicts: analyses.reduce((sum, a) => sum + a.conflicts.length, 0),
      totalMissingRoles: analyses.reduce((sum, a) => sum + a.missingRoles.length, 0),
      environmentBreakdown: {
        legacy: analyses.filter(a => a.environment === 'legacy').length,
        nextgen: analyses.filter(a => a.environment === 'nextgen').length,
      },
      analyses: analyses.map(analysis => ({
        componentName: analysis.componentName,
        environment: analysis.environment,
        score: analysis.score,
        assignedRoles: analysis.assignedRoles.length,
        conflicts: analysis.conflicts.length,
        missingRoles: analysis.missingRoles.length,
      })),
    };

    return JSON.stringify(report, null, 2);
  }
}

// Export singleton instance
export const roleAnalyzer = new RoleAnalyzer();

// Export utility functions
export function initializeRoleAnalyzer(config?: Partial<RoleAnalysisConfig>): void {
  if (config) {
    // Use public method to update configuration
    roleAnalyzer.updateConfig(config);
  }
}

export function analyzeComponent(
  componentName: string,
  environment: 'legacy' | 'nextgen',
  componentCode: string
): RoleAnalysis {
  return roleAnalyzer.analyzeComponent(componentName, environment, componentCode);
}

export function validateRoleAssignments(analysis: RoleAnalysis): RoleValidationResult {
  return roleAnalyzer.validateRoleAssignments(analysis);
}

export function getRoleDefinitions(): RoleDefinition[] {
  return roleAnalyzer.getRoleDefinitions();
}

export function getRoleAssignments(): RoleAssignment[] {
  return roleAnalyzer.getRoleAssignments();
}

export function getRoleConflicts(): RoleConflict[] {
  return roleAnalyzer.getRoleConflicts();
}

export function clearRoleAnalysisData(): void {
  roleAnalyzer.clearAnalysisData();
}

export function generateRoleAnalysisReport(analyses: RoleAnalysis[]): string {
  return roleAnalyzer.generateReport(analyses);
} 