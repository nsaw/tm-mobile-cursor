export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  isRequired: boolean;
  order: number;
}

export interface OnboardingState {
  currentStep: number;
  steps: OnboardingStep[];
  isVisible: boolean;
  isCompleted: boolean;
  hasBeenShown: boolean;
}

export interface OnboardingConfig {
  autoStart: boolean;
  skipEnabled: boolean;
  showProgress: boolean;
  animationDuration: number;
}
