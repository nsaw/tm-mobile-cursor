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
  ariaModal?: boolean;
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  colorContrast: boolean;
  focusManagement: boolean;
  gestureSupport: boolean;
  // Enhanced validation
  validationLevel: 'basic' | 'strict' | 'comprehensive';
  errorReporting: boolean;
  performanceMonitoring: boolean;
  accessibilityAudit: boolean;
}

export interface RoleSystem {
  id: string;
  name: string;
  type: string;
  accessibility: RoleAccessibility;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

export const DEFAULT_ROLE_ACCESSIBILITY: RoleAccessibility = {
  ariaModal: true,
  validationLevel: 'comprehensive',
  errorReporting: true,
  performanceMonitoring: true,
  accessibilityAudit: true,
  keyboardNavigation: true,
  screenReaderSupport: true,
  colorContrast: true,
  focusManagement: true,
  gestureSupport: true,
};
