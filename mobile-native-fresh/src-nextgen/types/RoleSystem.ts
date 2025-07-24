// src-nextgen/types/RoleSystem.ts
// Comprehensive role system for Phase 3 migration

export type RoleType = 
  | 'layout' 
  | 'interactive' 
  | 'content' 
  | 'navigation' 
  | 'modal' 
  | 'debug' 
  | 'system';

export type LayoutRole = 
  | 'container'
  | 'section'
  | 'header'
  | 'footer'
  | 'sidebar'
  | 'main'
  | 'aside'
  | 'article'
  | 'nav'
  | 'form'
  | 'list'
  | 'grid'
  | 'stack'
  | 'overlay'
  | 'safe-area';

export type InteractiveRole = 
  | 'button'
  | 'button-action'
  | 'button-secondary'
  | 'button-danger'
  | 'link'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'slider'
  | 'chip'
  | 'tab'
  | 'accordion'
  | 'dropdown'
  | 'search'
  | 'voice-record'
  | 'drag-handle'
  | 'swipe-target';

export type ContentRole = 
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label'
  | 'description'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'placeholder'
  | 'loading'
  | 'empty'
  | 'avatar'
  | 'icon'
  | 'image'
  | 'video'
  | 'audio'
  | 'code'
  | 'quote'
  | 'list-item'
  | 'card'
  | 'badge'
  | 'tag'
  | 'progress'
  | 'meter';

export type NavigationRole = 
  | 'nav-primary'
  | 'nav-secondary'
  | 'nav-breadcrumb'
  | 'nav-tab'
  | 'nav-menu'
  | 'nav-item'
  | 'nav-link'
  | 'nav-toggle'
  | 'nav-back'
  | 'nav-forward'
  | 'nav-home'
  | 'nav-settings'
  | 'nav-search'
  | 'nav-profile'
  | 'nav-notifications';

export type ModalRole = 
  | 'modal'
  | 'modal-overlay'
  | 'modal-content'
  | 'modal-header'
  | 'modal-body'
  | 'modal-footer'
  | 'modal-close'
  | 'modal-backdrop'
  | 'sheet'
  | 'sheet-overlay'
  | 'sheet-content'
  | 'sheet-handle'
  | 'popover'
  | 'tooltip'
  | 'alert'
  | 'alert-dialog'
  | 'dialog'
  | 'drawer'
  | 'drawer-overlay'
  | 'drawer-content';

export type DebugRole = 
  | 'debug-panel'
  | 'debug-info'
  | 'debug-control'
  | 'debug-toggle'
  | 'debug-log'
  | 'debug-error'
  | 'debug-warning'
  | 'debug-performance'
  | 'debug-state'
  | 'debug-props'
  | 'debug-environment'
  | 'debug-metrics';

export type SystemRole = 
  | 'root'
  | 'app'
  | 'screen'
  | 'page'
  | 'view'
  | 'wrapper'
  | 'provider'
  | 'boundary'
  | 'portal'
  | 'fragment'
  | 'suspense'
  | 'error-boundary'
  | 'loading-boundary'
  | 'auth-guard'
  | 'permission-guard'
  | 'feature-flag'
  | 'analytics'
  | 'telemetry'
  | 'monitoring'
  | 'logging';

export interface RoleContract {
  type: RoleType;
  name: string;
  description: string;
  required: boolean;
  props: RoleProp[];
  behaviors: RoleBehavior[];
  accessibility: RoleAccessibility;
  performance: RolePerformance;
  validation: RoleValidation;
  examples: string[];
  migration: RoleMigration;
}

export interface RoleProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: any;
  validation?: (value: any) => boolean;
}

export interface RoleBehavior {
  name: string;
  description: string;
  triggers: string[];
  actions: string[];
  sideEffects: string[];
}

export interface RoleAccessibility {
  ariaRole?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaHidden?: boolean;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  ariaChecked?: boolean;
  ariaSelected?: boolean;
  ariaDisabled?: boolean;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  ariaLive?: 'off' | 'polite' | 'assertive';
  ariaAtomic?: boolean;
  ariaRelevant?: string;
  ariaBusy?: boolean;
  ariaControls?: string;
  ariaOwns?: string;
  ariaLabelledBy?: string;
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  colorContrast: boolean;
  focusManagement: boolean;
  gestureSupport: boolean;
}

export interface RolePerformance {
  renderTime: number; // milliseconds
  memoryUsage: number; // bytes
  reRenderFrequency: number; // times per second
  bundleSize: number; // bytes
  lazyLoad: boolean;
  memoization: boolean;
  virtualization: boolean;
  debouncing: boolean;
  throttling: boolean;
}

export interface RoleValidation {
  required: boolean;
  props: Record<string, (value: any) => boolean>;
  state: Record<string, (value: any) => boolean>;
  children: (children: React.ReactNode) => boolean;
  context: (context: any) => boolean;
  lifecycle: (phase: string) => boolean;
}

export interface RoleMigration {
  fromLegacy: string;
  toNextgen: string;
  breakingChanges: string[];
  deprecationWarnings: string[];
  migrationSteps: string[];
  rollbackPlan: string[];
  testingStrategy: string[];
}

export interface RoleRegistry {
  [key: string]: RoleContract;
}

export class RoleSystem {
  private static instance: RoleSystem;
  private registry: RoleRegistry = {};
  private validators: Map<string, (props: any) => boolean> = new Map();

  constructor() {
    this.initializeRoleRegistry();
  }

  static getInstance(): RoleSystem {
    if (!RoleSystem.instance) {
      RoleSystem.instance = new RoleSystem();
    }
    return RoleSystem.instance;
  }

  /**
   * Initialize the role registry with all predefined roles
   */
  private initializeRoleRegistry(): void {
    // Layout roles
    this.registerRole({
      type: 'layout',
      name: 'container',
      description: 'Primary container for layout organization',
      required: true,
      props: [
        {
          name: 'direction',
          type: 'row | column',
          required: false,
          description: 'Layout direction',
          defaultValue: 'column',
        },
        {
          name: 'spacing',
          type: 'number',
          required: false,
          description: 'Space between children',
          defaultValue: 0,
        },
      ],
      behaviors: [
        {
          name: 'flex-layout',
          description: 'Uses flexbox for layout',
          triggers: ['mount', 'resize'],
          actions: ['calculate-layout', 'apply-flex'],
          sideEffects: ['reflow'],
        },
      ],
      accessibility: {
        keyboardNavigation: false,
        screenReaderSupport: true,
        colorContrast: false,
        focusManagement: false,
        gestureSupport: false,
      },
      performance: {
        renderTime: 1,
        memoryUsage: 64,
        reRenderFrequency: 0.1,
        bundleSize: 128,
        lazyLoad: false,
        memoization: true,
        virtualization: false,
        debouncing: false,
        throttling: false,
      },
      validation: {
        required: true,
        props: {},
        state: {},
        children: () => true,
        context: () => true,
        lifecycle: () => true,
      },
      examples: [
        '<Container direction="row" spacing={16}>',
        '<Container direction="column" spacing={8}>',
      ],
      migration: {
        fromLegacy: 'View',
        toNextgen: 'Container',
        breakingChanges: ['direction prop renamed from flexDirection'],
        deprecationWarnings: ['style prop will be deprecated'],
        migrationSteps: [
          'Replace View with Container',
          'Update direction prop',
          'Remove style prop',
        ],
        rollbackPlan: ['Revert to View component'],
        testingStrategy: ['Test layout rendering', 'Test spacing behavior'],
      },
    });

    // Interactive roles
    this.registerRole({
      type: 'interactive',
      name: 'button-action',
      description: 'Primary action button with consistent styling',
      required: true,
      props: [
        {
          name: 'onPress',
          type: 'function',
          required: true,
          description: 'Press handler',
        },
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          description: 'Disabled state',
          defaultValue: false,
        },
        {
          name: 'loading',
          type: 'boolean',
          required: false,
          description: 'Loading state',
          defaultValue: false,
        },
      ],
      behaviors: [
        {
          name: 'press-handling',
          description: 'Handles press events with feedback',
          triggers: ['press', 'pressIn', 'pressOut'],
          actions: ['trigger-onPress', 'show-feedback'],
          sideEffects: ['state-change'],
        },
      ],
      accessibility: {
        ariaRole: 'button',
        ariaPressed: false,
        ariaDisabled: false,
        keyboardNavigation: true,
        screenReaderSupport: true,
        colorContrast: true,
        focusManagement: true,
        gestureSupport: true,
      },
      performance: {
        renderTime: 2,
        memoryUsage: 128,
        reRenderFrequency: 0.5,
        bundleSize: 256,
        lazyLoad: false,
        memoization: true,
        virtualization: false,
        debouncing: true,
        throttling: false,
      },
      validation: {
        required: true,
        props: {
          onPress: (value) => typeof value === 'function',
          disabled: (value) => typeof value === 'boolean',
          loading: (value) => typeof value === 'boolean',
        },
        state: {},
        children: () => true,
        context: () => true,
        lifecycle: () => true,
      },
      examples: [
        '<Button onPress={handlePress}>Save</Button>',
        '<Button onPress={handlePress} disabled={true}>Loading...</Button>',
      ],
      migration: {
        fromLegacy: 'TouchableOpacity',
        toNextgen: 'Button',
        breakingChanges: ['onPress prop required', 'style prop deprecated'],
        deprecationWarnings: ['TouchableOpacity will be removed'],
        migrationSteps: [
          'Replace TouchableOpacity with Button',
          'Add onPress prop',
          'Remove style prop',
        ],
        rollbackPlan: ['Revert to TouchableOpacity'],
        testingStrategy: ['Test press handling', 'Test accessibility', 'Test disabled state'],
      },
    });

    // Content roles
    this.registerRole({
      type: 'content',
      name: 'body',
      description: 'Primary text content with consistent typography',
      required: true,
      props: [
        {
          name: 'variant',
          type: 'body | body-small | body-large',
          required: false,
          description: 'Text variant',
          defaultValue: 'body',
        },
        {
          name: 'color',
          type: 'string',
          required: false,
          description: 'Text color',
          defaultValue: 'text',
        },
      ],
      behaviors: [
        {
          name: 'text-rendering',
          description: 'Renders text with proper typography',
          triggers: ['mount', 'text-change'],
          actions: ['apply-typography', 'measure-text'],
          sideEffects: ['reflow'],
        },
      ],
      accessibility: {
        ariaRole: 'text',
        keyboardNavigation: false,
        screenReaderSupport: true,
        colorContrast: true,
        focusManagement: false,
        gestureSupport: false,
      },
      performance: {
        renderTime: 1,
        memoryUsage: 32,
        reRenderFrequency: 0.1,
        bundleSize: 64,
        lazyLoad: false,
        memoization: true,
        virtualization: false,
        debouncing: false,
        throttling: false,
      },
      validation: {
        required: true,
        props: {
          variant: (value) => ['body', 'body-small', 'body-large'].includes(value),
          color: (value) => typeof value === 'string',
        },
        state: {},
        children: (children) => typeof children === 'string' || typeof children === 'number',
        context: () => true,
        lifecycle: () => true,
      },
      examples: [
        '<Text variant="body">Hello world</Text>',
        '<Text variant="body-large" color="accent">Important text</Text>',
      ],
      migration: {
        fromLegacy: 'Text',
        toNextgen: 'Text',
        breakingChanges: ['variant prop required'],
        deprecationWarnings: ['style prop will be deprecated'],
        migrationSteps: [
          'Add variant prop',
          'Remove style prop',
        ],
        rollbackPlan: ['Revert to legacy Text'],
        testingStrategy: ['Test typography rendering', 'Test color variants'],
      },
    });

    // Navigation roles
    this.registerRole({
      type: 'navigation',
      name: 'nav-primary',
      description: 'Primary navigation component',
      required: true,
      props: [
        {
          name: 'currentRoute',
          type: 'string',
          required: true,
          description: 'Current active route',
        },
        {
          name: 'onNavigate',
          type: 'function',
          required: true,
          description: 'Navigation handler',
        },
      ],
      behaviors: [
        {
          name: 'route-navigation',
          description: 'Handles route navigation',
          triggers: ['press', 'route-change'],
          actions: ['navigate', 'update-active'],
          sideEffects: ['route-change', 'state-update'],
        },
      ],
      accessibility: {
        ariaRole: 'navigation',
        keyboardNavigation: true,
        screenReaderSupport: true,
        colorContrast: true,
        focusManagement: true,
        gestureSupport: true,
      },
      performance: {
        renderTime: 5,
        memoryUsage: 256,
        reRenderFrequency: 0.2,
        bundleSize: 512,
        lazyLoad: false,
        memoization: true,
        virtualization: false,
        debouncing: false,
        throttling: false,
      },
      validation: {
        required: true,
        props: {
          currentRoute: (value) => typeof value === 'string',
          onNavigate: (value) => typeof value === 'function',
        },
        state: {},
        children: () => true,
        context: () => true,
        lifecycle: () => true,
      },
      examples: [
        '<BottomNav currentRoute="home" onNavigate={handleNavigate} />',
      ],
      migration: {
        fromLegacy: 'BottomNav',
        toNextgen: 'BottomNav',
        breakingChanges: ['onNavigate prop required'],
        deprecationWarnings: ['Legacy navigation pro{ { { { { { { { ps deprecated'], & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
        migrationSteps: [
          'Add onNavigate prop',
          'Update currentRoute prop',
        ],
        rollbackPlan: ['Revert to legacy BottomNav'],
        testingStrategy: ['Test navigation', 'Test active states', 'Test accessibility'],
      },
    });

    // Modal roles
    this.registerRole({
      type: 'modal',
      name: 'modal',
      description: 'Modal overlay with content',
      required: true,
      props: [
        {
          name: 'visible',
          type: 'boolean',
          required: true,
          description: 'Modal visibility',
        },
        {
          name: 'onClose',
          type: 'function',
          required: true,
          description: 'Close handler',
        },
      ],
      behaviors: [
        {
          name: 'modal-behavior',
          description: 'Handles modal display and interaction',
          triggers: ['mount', 'visible-change', 'backdrop-press'],
          actions: ['show-modal', 'hide-modal', 'handle-close'],
          sideEffects: ['focus-trap', 'scroll-lock'],
        },
      ],
      accessibility: {
        ariaRole: 'dialog',
        ariaModal: true,
        keyboardNavigation: true,
        screenReaderSupport: true,
        colorContrast: true,
        focusManagement: true,
        gestureSupport: true,
      },
      performance: {
        renderTime: 10,
        memoryUsage: 512,
        reRenderFrequency: 0.1,
        bundleSize: 1024,
        lazyLoad: true,
        memoization: true,
        virtualization: false,
        debouncing: false,
        throttling: false,
      },
      validation: {
        required: true,
        props: {
          visible: (value) => typeof value === 'boolean',
          onClose: (value) => typeof value === 'function',
        },
        state: {},
        children: () => true,
        context: () => true,
        lifecycle: () => true,
      },
      examples: [
        '<Modal visible={showModal} onClose={handleClose}>Content</Modal>',
      ],
      migration: {
        fromLegacy: 'Modal',
        toNextgen: 'Modal',
        breakingChanges: ['onClose prop required'],
        deprecationWarnings: ['Legacy modal props deprecated'],
        migrationSteps: [
          'Add onClose prop',
          'Update visible prop',
        ],
        rollbackPlan: ['Revert to legacy Modal'],
        testingStrategy: ['Test modal display', 'Test close behavior', 'Test accessibility'],
      },
    });

    // Debug roles
    this.registerRole({
      type: 'debug',
      name: 'debug-panel',
      description: 'Debug information panel',
      required: false,
      props: [
        {
          name: 'visible',
          type: 'boolean',
          required: false,
          description: 'Panel visibility',
          defaultValue: false,
        },
        {
          name: 'position',
          type: 'top | bottom | left | right',
          required: false,
          description: 'Panel position',
          defaultValue: 'bottom',
        },
      ],
      behaviors: [
        {
          name: 'debug-display',
          description: 'Displays debug information',
          triggers: ['mount', 'state-change'],
          actions: ['collect-info', 'display-info'],
          sideEffects: ['performance-impact'],
        },
      ],
      accessibility: {
        ariaRole: 'complementary',
        ariaHidden: true,
        keyboardNavigation: false,
        screenReaderSupport: false,
        colorContrast: false,
        focusManagement: false,
        gestureSupport: false,
      },
      performance: {
        renderTime: 3,
        memoryUsage: 128,
        reRenderFrequency: 1.0,
        bundleSize: 256,
        lazyLoad: true,
        memoization: false,
        virtualization: false,
        debouncing: false,
        throttling: false,
      },
      validation: {
        required: false,
        props: {
          visible: (value) => typeof value === 'boolean',
          position: (value) => ['top', 'bottom', 'left', 'right'].includes(value),
        },
        state: {},
        children: () => true,
        context: () => true,
        lifecycle: () => true,
      },
      examples: [
        '<DebugPanel visible={__DEV__} position="bottom" />',
      ],
      migration: {
        fromLegacy: 'DebugPanel',
        toNextgen: 'DebugPanel',
        breakingChanges: [],
        deprecationWarnings: [],
        migrationSteps: [
          'No changes required',
        ],
        rollbackPlan: ['Remove debug components'],
        testingStrategy: ['Test debug display', 'Test performance impact'],
      },
    });

    // System roles
    this.registerRole({
      type: 'system',
      name: 'app',
      description: 'Root application component',
      required: true,
      props: [
        {
          name: 'environment',
          type: 'legacy | nextgen',
          required: true,
          description: 'Application environment',
        },
      ],
      behaviors: [
        {
          name: 'app-initialization',
          description: 'Initializes application',
          triggers: ['mount'],
          actions: ['setup-providers', 'load-config', 'initialize-state'],
          sideEffects: ['global-state', 'providers-setup'],
        },
      ],
      accessibility: {
        keyboardNavigation: true,
        screenReaderSupport: true,
        colorContrast: true,
        focusManagement: true,
        gestureSupport: true,
      },
      performance: {
        renderTime: 50,
        memoryUsage: 2048,
        reRenderFrequency: 0.01,
        bundleSize: 4096,
        lazyLoad: false,
        memoization: true,
        virtualization: false,
        debouncing: false,
        throttling: false,
      },
      validation: {
        required: true,
        props: {
          environment: (value) => ['legacy', 'nextgen'].includes(value),
        },
        state: {},
        children: () => true,
        context: () => true,
        lifecycle: () => true,
      },
      examples: [
        '<App environment="nextgen">Content</App>',
      ],
      migration: {
        fromLegacy: 'App',
        toNextgen: 'App',
        breakingChanges: ['environment prop required'],
        deprecationWarnings: [],
        migrationSteps: [
          'Add environment prop',
        ],
        rollbackPlan: ['Revert to legacy App'],
        testingStrategy: ['Test app initialization', 'Test environment switching'],
      },
    });
  }

  /**
   * Register a new role
   */
  registerRole(role: RoleContract): void {
    this.registry[role.name] = role;
    this.validators.set(role.name, this.createValidator(role));
    console.log(`🔍 RoleSystem: Registered role: ${role.name}`);
  }

  /**
   * Get a role by name
   */
  getRole(roleName: string): RoleContract | undefined {
    return this.registry[roleName];
  }

  /**
   * Get all roles
   */
  getAllRoles(): RoleContract[] {
    return Object.values(this.registry);
  }

  /**
   * Get roles by type
   */
  getRolesByType(type: RoleType): RoleContract[] {
    return Object.values(this.registry).filter(role => role.type === type);
  }

  /**
   * Validate pro{ { { { ps against a role & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
   */
  validateRoleProps(roleName: string, props: any): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const role = this.getRole(roleName);
    if (!role) {
      return {
        valid: false,
        errors: [`Role '${roleName}' not found`],
        warnings: [],
      };
    }

    const validator = this.validators.get(roleName);
    if (!validator) {
      return {
        valid: false,
        errors: [`Validator for role '${roleName}' not found`],
        warnings: [],
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required pro{ { { { ps
    for (const prop of role.props) { & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
      if (prop.required && !(prop.name in props)) {
        errors.push(`Required prop '${prop.name}' missing for role '${roleName}'`);
      }
    }

    // Validate prop types and values
    for (const [propName, propValue] of Object.entries(props)) {
      const propDef = role.props.find(p => p.name === propName);
      if (propDef) {
        if (propDef.validation && !propDef.validation(propValue)) {
          errors.push(`Invalid value for prop '${propName}' in role '${roleName}'`);
        }
      } else {
        warnings.push(`Unknown prop '${propName}' for role '${roleName}'`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Create a validator function for a role
   */
  private createValidator(role: RoleContract): (props: any) => boolean {
    return (props: any) => {
      const validation = this.validateRoleProps(role.name, props);
      return validation.valid;
    };
  }

  /**
   * Get role migration information
   */
  getRoleMigration(roleName: string): RoleMigration | undefined {
    const role = this.getRole(roleName);
    return role?.migration;
  }

  /**
   * Export role registry to JSON
   */
  exportRoleRegistry(): string {
    return JSON.stringify(this.registry, null, 2);
  }

  /**
   * Import role registry from JSON
   */
  importRoleRegistry(json: string): void {
    try {
      const registry = JSON.parse(json);
      this.registry = { ...this.registry, ...registry };
      
      // Recreate validators for imported roles
      for (const [roleName, role] of Object.entries(registry)) {
        this.validators.set(roleName, this.createValidator(role as RoleContract));
      }
      
      console.log(`🔍 RoleSystem: Imported ${Object.keys(registry).length} roles`);
    } catch (error) {
      console.error('🔍 RoleSystem: Failed to import role registry:', error);
    }
  }
}

// Role system hooks for React components

export const useRoleSystem = () => {
  const roleSystem = RoleSystem.getInstance();

  const getRole = (roleName: string) => roleSystem.getRole(roleName);
  const validatePro{ { { { ps = (roleName: string, props: any) => roleSystem.validateRoleProps(roleName, props) & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
  const getMigration = (roleName: string) => roleSystem.getRoleMigration(roleName);

  return {
    getRole,
    validateProps,
    getMigration,
    roleSystem,
  };
};

export default RoleSystem; 