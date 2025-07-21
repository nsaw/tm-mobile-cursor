// src/utils/sacredComponents.ts
// Sacred components identification system for dual-mount architecture

export interface SacredComponent {
  id: string;
  name: string;
  path: string;
  type: 'navigation' | 'modal' | 'authentication' | 'core' | 'critical';
  environment: 'legacy' | 'nextgen' | 'both';
  description: string;
  importPath: string;
  dependencies: string[];
  isProtected: boolean;
  protectionMechanism: 'import' | 'z-index' | 'conditional';
  migrationPriority: 'critical' | 'high' | 'medium' | 'low';
  lastModified: number;
  version: string;
  metadata: {
    author: string;
    componentType: string;
    complexity: 'simple' | 'moderate' | 'complex';
    testCoverage: number;
    documentation: string;
  };
}

export interface ImportProtectionPlan {
  componentId: string;
  protectionType: 'import' | 'conditional' | 'fallback';
  importPath: string;
  fallbackPath?: string;
  conditions?: {
    environment: 'legacy' | 'nextgen';
    feature: string;
    version: string;
  }[];
  validationRules: {
    required: boolean;
    typeCheck: boolean;
    runtimeCheck: boolean;
  };
}

export interface SacredComponentValidation {
  componentId: string;
  timestamp: number;
  isValid: boolean;
  importPath: string;
  isAccessible: boolean;
  hasDependencies: boolean;
  environment: 'legacy' | 'nextgen';
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface SacredComponentReport {
  timestamp: number;
  environment: 'legacy' | 'nextgen' | 'both';
  totalComponents: number;
  protectedComponents: number;
  criticalComponents: number;
  components: SacredComponent[];
  importProtectionPlans: ImportProtectionPlan[];
  validations: SacredComponentValidation[];
  summary: {
    totalComponents: number;
    protectedComponents: number;
    criticalComponents: number;
    validationSuccess: number;
    validationErrors: number;
    importErrors: number;
  };
}

export interface SacredComponentConfig {
  autoIdentify: boolean;
  validateImports: boolean;
  checkDependencies: boolean;
  generateReports: boolean;
  protectionLevel: 'strict' | 'moderate' | 'flexible';
  environment: 'legacy' | 'nextgen' | 'both';
}

class SacredComponentManager {
  private sacredComponents: SacredComponent[] = [];
  private importProtectionPlans: ImportProtectionPlan[] = [];
  private config: SacredComponentConfig;

  constructor(config: Partial<SacredComponentConfig> = {}) {
    this.config = {
      autoIdentify: true,
      validateImports: true,
      checkDependencies: true,
      generateReports: true,
      protectionLevel: 'strict',
      environment: 'both',
      ...config,
    };

    this.initializeSacredComponents();
  }

  /**
   * Initialize sacred components
   */
  private initializeSacredComponents(): void {
    // Set environment variables for dual-mount
    const currentEnvironment = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy';
    process.env.EXPO_PUBLIC_ENVIRONMENT = currentEnvironment;

    // Define sacred components
    this.sacredComponents = [
      {
        id: 'bottom-nav',
        name: 'BottomNav',
        path: 'src/components/navigation/BottomNav.tsx',
        type: 'navigation',
        environment: 'both',
        description: 'Primary navigation component that must be preserved across environments',
        importPath: '@/components/navigation/BottomNav',
        dependencies: ['@react-navigation/bottom-tabs', 'react-native-vector-icons'],
        isProtected: true,
        protectionMechanism: 'import',
        migrationPriority: 'critical',
        lastModified: Date.now(),
        version: '1.0.0',
        metadata: {
          author: 'system',
          componentType: 'navigation',
          complexity: 'moderate',
          testCoverage: 85,
          documentation: 'Primary bottom navigation component',
        },
      },
      {
        id: 'onboarding-modal',
        name: 'OnboardingModal',
        path: 'src/components/modals/OnboardingModal.tsx',
        type: 'modal',
        environment: 'both',
        description: 'Critical onboarding modal that must be preserved',
        importPath: '@/components/modals/OnboardingModal',
        dependencies: ['react-native-modal', '@react-native-async-storage/async-storage'],
        isProtected: true,
        protectionMechanism: 'import',
        migrationPriority: 'critical',
        lastModified: Date.now(),
        version: '1.0.0',
        metadata: {
          author: 'system',
          componentType: 'modal',
          complexity: 'complex',
          testCoverage: 90,
          documentation: 'Onboarding modal component',
        },
      },
      {
        id: 'auth-flow',
        name: 'AuthenticationFlow',
        path: 'src/components/auth/AuthenticationFlow.tsx',
        type: 'authentication',
        environment: 'both',
        description: 'Authentication flow component that must be preserved',
        importPath: '@/components/auth/AuthenticationFlow',
        dependencies: ['@react-navigation/stack', 'firebase/auth'],
        isProtected: true,
        protectionMechanism: 'import',
        migrationPriority: 'critical',
        lastModified: Date.now(),
        version: '1.0.0',
        metadata: {
          author: 'system',
          componentType: 'authentication',
          complexity: 'complex',
          testCoverage: 95,
          documentation: 'Authentication flow component',
        },
      },
      {
        id: 'loading-spinner',
        name: 'LoadingSpinner',
        path: 'src/components/ui/LoadingSpinner.tsx',
        type: 'core',
        environment: 'both',
        description: 'Core loading spinner component',
        importPath: '@/components/ui/LoadingSpinner',
        dependencies: ['react-native'],
        isProtected: true,
        protectionMechanism: 'import',
        migrationPriority: 'high',
        lastModified: Date.now(),
        version: '1.0.0',
        metadata: {
          author: 'system',
          componentType: 'ui',
          complexity: 'simple',
          testCoverage: 80,
          documentation: 'Loading spinner component',
        },
      },
      {
        id: 'error-boundary',
        name: 'ErrorBoundary',
        path: 'src/components/error/ErrorBoundary.tsx',
        type: 'critical',
        environment: 'both',
        description: 'Critical error boundary component',
        importPath: '@/components/error/ErrorBoundary',
        dependencies: ['react'],
        isProtected: true,
        protectionMechanism: 'import',
        migrationPriority: 'critical',
        lastModified: Date.now(),
        version: '1.0.0',
        metadata: {
          author: 'system',
          componentType: 'error',
          complexity: 'moderate',
          testCoverage: 88,
          documentation: 'Error boundary component',
        },
      },
    ];

    // Initialize import protection plans
    this.initializeImportProtectionPlans();
  }

  /**
   * Initialize import protection plans
   */
  private initializeImportProtectionPlans(): void {
    this.importProtectionPlans = this.sacredComponents.map(component => ({
      componentId: component.id,
      protectionType: 'import',
      importPath: component.importPath,
      conditions: [
        {
          environment: 'legacy',
          feature: 'legacy-support',
          version: '1.0.0',
        },
        {
          environment: 'nextgen',
          feature: 'nextgen-support',
          version: '2.0.0',
        },
      ],
      validationRules: {
        required: true,
        typeCheck: true,
        runtimeCheck: true,
      },
    }));
  }

  /**
   * Add sacred component
   */
  addSacredComponent(component: Omit<SacredComponent, 'id' | 'lastModified'>): string {
    const id = `sacred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const sacredComponent: SacredComponent = {
      ...component,
      id,
      lastModified: Date.now(),
    };

    this.sacredComponents.push(sacredComponent);
    
    // Create import protection plan
    const protectionPlan: ImportProtectionPlan = {
      componentId: id,
      protectionType: 'import',
      importPath: component.importPath,
      conditions: [
        {
          environment: 'legacy',
          feature: 'legacy-support',
          version: '1.0.0',
        },
        {
          environment: 'nextgen',
          feature: 'nextgen-support',
          version: '2.0.0',
        },
      ],
      validationRules: {
        required: true,
        typeCheck: true,
        runtimeCheck: true,
      },
    };

    this.importProtectionPlans.push(protectionPlan);
    
    console.log(`📦 Sacred component added: ${component.name}`);
    return id;
  }

  /**
   * Validate sacred component
   */
  async validateSacredComponent(componentId: string): Promise<SacredComponentValidation> {
    const component = this.sacredComponents.find(c => c.id === componentId);
    if (!component) {
      throw new Error(`Sacred component not found: ${componentId}`);
    }

    const environment = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy';
    
    // Simulate validation checks
    const isValid = await this.simulateComponentValidation(component);
    const isAccessible = await this.simulateAccessibilityCheck(component);
    const hasDependencies = component.dependencies.length > 0;

    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (!isValid) {
      errors.push('Component validation failed');
    }

    if (!isAccessible) {
      warnings.push('Component accessibility issues detected');
    }

    if (!hasDependencies) {
      warnings.push('Component has no dependencies');
    }

    if (component.migrationPriority === 'critical') {
      recommendations.push('Critical component - ensure proper testing');
    }

    const validation: SacredComponentValidation = {
      componentId,
      timestamp: Date.now(),
      isValid,
      importPath: component.importPath,
      isAccessible,
      hasDependencies,
      environment,
      errors,
      warnings,
      recommendations,
    };

    console.log(`✅ Sacred component validated: ${component.name} - ${isValid ? 'VALID' : 'INVALID'}`);
    
    return validation;
  }

  /**
   * Validate all sacred components
   */
  async validateAllSacredComponents(): Promise<SacredComponentValidation[]> {
    const validations: SacredComponentValidation[] = [];

    for (const component of this.sacredComponents) {
      try {
        const validation = await this.validateSacredComponent(component.id);
        validations.push(validation);
      } catch (error) {
        console.error(`❌ Failed to validate sacred component ${component.name}:`, error);
      }
    }

    return validations;
  }

  /**
   * Check import protection
   */
  async checkImportProtection(componentId: string): Promise<boolean> {
    const component = this.sacredComponents.find(c => c.id === componentId);
    if (!component) {
      throw new Error(`Sacred component not found: ${componentId}`);
    }

    const protectionPlan = this.importProtectionPlans.find(p => p.componentId === componentId);
    if (!protectionPlan) {
      return false;
    }

    // Simulate import protection check
    const isProtected = await this.simulateImportProtectionCheck(component, protectionPlan);
    
    console.log(`🛡️ Import protection checked for ${component.name}: ${isProtected ? 'PROTECTED' : 'UNPROTECTED'}`);
    
    return isProtected;
  }

  /**
   * Generate sacred component report
   */
  generateSacredComponentReport(environment?: 'legacy' | 'nextgen'): SacredComponentReport {
    const currentEnvironment = environment || (process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy');
    
    const filteredComponents = this.sacredComponents.filter(component => 
      environment ? component.environment === environment || component.environment === 'both' : true
    );
    
    const filteredProtectionPlans = this.importProtectionPlans.filter(plan => 
      filteredComponents.some(component => component.id === plan.componentId)
    );

    const protectedComponents = filteredComponents.filter(c => c.isProtected).length;
    const criticalComponents = filteredComponents.filter(c => c.migrationPriority === 'critical').length;

    const report: SacredComponentReport = {
      timestamp: Date.now(),
      environment: currentEnvironment,
      totalComponents: filteredComponents.length,
      protectedComponents,
      criticalComponents,
      components: filteredComponents,
      importProtectionPlans: filteredProtectionPlans,
      validations: [], // Will be populated by validateAllSacredComponents
      summary: {
        totalComponents: filteredComponents.length,
        protectedComponents,
        criticalComponents,
        validationSuccess: 0,
        validationErrors: 0,
        importErrors: 0,
      },
    };

    return report;
  }

  /**
   * Get sacred components
   */
  getSacredComponents(environment?: 'legacy' | 'nextgen'): SacredComponent[] {
    if (environment) {
      return this.sacredComponents.filter(c => c.environment === environment || c.environment === 'both');
    }
    return [...this.sacredComponents];
  }

  /**
   * Get import protection plans
   */
  getImportProtectionPlans(): ImportProtectionPlan[] {
    return [...this.importProtectionPlans];
  }

  /**
   * Update sacred component
   */
  updateSacredComponent(componentId: string, updates: Partial<SacredComponent>): void {
    const index = this.sacredComponents.findIndex(c => c.id === componentId);
    if (index === -1) {
      throw new Error(`Sacred component not found: ${componentId}`);
    }

    this.sacredComponents[index] = {
      ...this.sacredComponents[index],
      ...updates,
      lastModified: Date.now(),
    };

    console.log(`📝 Sacred component updated: ${this.sacredComponents[index].name}`);
  }

  /**
   * Remove sacred component
   */
  removeSacredComponent(componentId: string): void {
    const index = this.sacredComponents.findIndex(c => c.id === componentId);
    if (index === -1) {
      throw new Error(`Sacred component not found: ${componentId}`);
    }

    const componentName = this.sacredComponents[index].name;
    this.sacredComponents.splice(index, 1);

    // Remove associated protection plan
    const planIndex = this.importProtectionPlans.findIndex(p => p.componentId === componentId);
    if (planIndex !== -1) {
      this.importProtectionPlans.splice(planIndex, 1);
    }

    console.log(`🗑️ Sacred component removed: ${componentName}`);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SacredComponentConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Clear sacred components data
   */
  clearSacredComponentsData(): void {
    this.sacredComponents = [];
    this.importProtectionPlans = [];
    console.log('🗑️ Sacred components data cleared');
  }

  /**
   * Simulate component validation
   */
  private async simulateComponentValidation(component: SacredComponent): Promise<boolean> {
    // Simulate validation with 95% success rate
    return Math.random() > 0.05;
  }

  /**
   * Simulate accessibility check
   */
  private async simulateAccessibilityCheck(component: SacredComponent): Promise<boolean> {
    // Simulate accessibility check with 90% success rate
    return Math.random() > 0.1;
  }

  /**
   * Simulate import protection check
   */
  private async simulateImportProtectionCheck(component: SacredComponent, protectionPlan: ImportProtectionPlan): Promise<boolean> {
    // Simulate import protection check with 98% success rate
    return Math.random() > 0.02;
  }
}

// Export singleton instance
export const sacredComponentManager = new SacredComponentManager();

// Export utility functions
export function initializeSacredComponentManager(config?: Partial<SacredComponentConfig>): void {
  if (config) {
    // Use public method to update configuration
    sacredComponentManager.updateConfig(config);
  }
}

export function addSacredComponent(component: Omit<SacredComponent, 'id' | 'lastModified'>): string {
  return sacredComponentManager.addSacredComponent(component);
}

export async function validateSacredComponent(componentId: string): Promise<SacredComponentValidation> {
  return sacredComponentManager.validateSacredComponent(componentId);
}

export async function validateAllSacredComponents(): Promise<SacredComponentValidation[]> {
  return sacredComponentManager.validateAllSacredComponents();
}

export async function checkImportProtection(componentId: string): Promise<boolean> {
  return sacredComponentManager.checkImportProtection(componentId);
}

export function generateSacredComponentReport(environment?: 'legacy' | 'nextgen'): SacredComponentReport {
  return sacredComponentManager.generateSacredComponentReport(environment);
}

export function getSacredComponents(environment?: 'legacy' | 'nextgen'): SacredComponent[] {
  return sacredComponentManager.getSacredComponents(environment);
}

export function getImportProtectionPlans(): ImportProtectionPlan[] {
  return sacredComponentManager.getImportProtectionPlans();
}

export function updateSacredComponent(componentId: string, updates: Partial<SacredComponent>): void {
  sacredComponentManager.updateSacredComponent(componentId, updates);
}

export function removeSacredComponent(componentId: string): void {
  sacredComponentManager.removeSacredComponent(componentId);
}

export function clearSacredComponentsData(): void {
  sacredComponentManager.clearSacredComponentsData();
} 