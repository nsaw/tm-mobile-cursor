import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingState, OnboardingStep, OnboardingConfig } from '../types/onboarding';

const ONBOARDING_STORAGE_KEY = '@thoughtmarks_onboarding';

const defaultSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Thoughtmarks',
    description: 'Your personal space for capturing and organizing thoughts, ideas, and insights.',
    icon: '🌟',
    isCompleted: false,
    isRequired: true,
    order: 1,
  },
  {
    id: 'create-thoughtmark',
    title: 'Create Your First Thoughtmark',
    description: 'Tap the + button to create your first thoughtmark. Add text, voice notes, or images.',
    icon: '📝',
    isCompleted: false,
    isRequired: true,
    order: 2,
  },
  {
    id: 'organize',
    title: 'Organize with Bins',
    description: 'Create bins to organize your thoughtmarks by project, topic, or any way you prefer.',
    icon: '📁',
    isCompleted: false,
    isRequired: false,
    order: 3,
  },
  {
    id: 'tags',
    title: 'Use Tags for Easy Search',
    description: 'Add tags to your thoughtmarks to find them quickly later.',
    icon: '🏷️',
    isCompleted: false,
    isRequired: false,
    order: 4,
  },
  {
    id: 'ai-features',
    title: 'Discover AI Features',
    description: 'Explore AI-powered insights and recommendations to enhance your productivity.',
    icon: '🤖',
    isCompleted: false,
    isRequired: false,
    order: 5,
  },
];

const defaultConfig: OnboardingConfig = {
  autoStart: true,
  skipEnabled: true,
  showProgress: true,
  animationDuration: 300,
};

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 0,
    steps: defaultSteps,
    isVisible: false,
    isCompleted: false,
    hasBeenShown: false,
  });

  const [config, setConfig] = useState<OnboardingConfig>(defaultConfig);

  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    try {
      const stored = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(parsed.state);
        setConfig(parsed.config || defaultConfig);
      }
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
    }
  };

  const saveOnboardingState = async (newState: OnboardingState, newConfig?: OnboardingConfig) => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({
        state: newState,
        config: newConfig || config,
      }));
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  };

  const startOnboarding = () => {
    const newState = {
      ...state,
      isVisible: true,
      currentStep: 0,
      hasBeenShown: true,
    };
    setState(newState);
    saveOnboardingState(newState);
  };

  const nextStep = () => {
    if (state.currentStep < state.steps.length - 1) {
      const newState = {
        ...state,
        currentStep: state.currentStep + 1,
      };
      setState(newState);
      saveOnboardingState(newState);
    } else {
      completeOnboarding();
    }
  };

  const previousStep = () => {
    if (state.currentStep > 0) {
      const newState = {
        ...state,
        currentStep: state.currentStep - 1,
      };
      setState(newState);
      saveOnboardingState(newState);
    }
  };

  const completeStep = (stepId: string) => {
    const updatedSteps = state.steps.map(step =>
      step.id === stepId ? { ...step, isCompleted: true } : step
    );
    const newState = {
      ...state,
      steps: updatedSteps,
    };
    setState(newState);
    saveOnboardingState(newState);
  };

  const completeOnboarding = () => {
    const newState = {
      ...state,
      isVisible: false,
      isCompleted: true,
      steps: state.steps.map(step => ({ ...step, isCompleted: true })),
    };
    setState(newState);
    saveOnboardingState(newState);
  };

  const skipOnboarding = () => {
    const newState = {
      ...state,
      isVisible: false,
      isCompleted: true,
      hasBeenShown: true,
    };
    setState(newState);
    saveOnboardingState(newState);
  };

  const resetOnboarding = () => {
    const newState = {
      currentStep: 0,
      steps: defaultSteps.map(step => ({ ...step, isCompleted: false })),
      isVisible: false,
      isCompleted: false,
      hasBeenShown: false,
    };
    setState(newState);
    saveOnboardingState(newState);
  };

  const updateConfig = (newConfig: Partial<OnboardingConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    saveOnboardingState(state, updatedConfig);
  };

  const getCurrentStep = (): OnboardingStep | null => {
    return state.steps[state.currentStep] || null;
  };

  const getProgress = (): number => {
    return ((state.currentStep + 1) / state.steps.length) * 100;
  };

  const getCompletedSteps = (): number => {
    return state.steps.filter(step => step.isCompleted).length;
  };

  const isFirstTime = (): boolean => {
    return !state.hasBeenShown;
  };

  return {
    state,
    config,
    startOnboarding,
    nextStep,
    previousStep,
    completeStep,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    updateConfig,
    getCurrentStep,
    getProgress,
    getCompletedSteps,
    isFirstTime,
  };
};
