// src-nextgen/utils/index.ts
export * from './validation';
export { PerformanceMonitor, establishPerformanceBaseline, detectPerformanceRegression } from './PerformanceMonitor';
export { ValidationSystem, FailSafeValidationLoop } from './ValidationSystem';
export { useEnvironment, Environment, EnvironmentState, EnvironmentToggleResult } from '../hooks/useEnvironment';
export * from './accessibilityUtils';
export * from './errorReporting';

export {
  announceForAccessibility,
  setAccessibilityFocus,
  getRecommendedTimeoutMillis,
  getRecommendedTimeoutMillisSync,
  shouldShowAccessibilityMenu,
  getAccessibilityConfig,
  generateAccessibilityLabel,
  shouldReduceMotion,
  shouldReduceTransparency,
  shouldInvertColors,
  shouldUseBoldText,
  shouldUseGrayscale,
  shouldUseLargeText,
} from './accessibilityUtils';

export {
  reportError,
  reportBoundaryError,
  setErrorReporterUser,
  setErrorReporterVersion,
  setErrorReporterEnvironment,
  errorReporter,
} from './errorReporting'; 