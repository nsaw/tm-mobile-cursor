import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../hooks/useOnboarding';
import { OnboardingStep } from '../types/onboarding';

const { width, height } = Dimensions.get('window');

interface OnboardingModalProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onComplete,
  onSkip,
}) => {
  const {
    state,
    config,
    nextStep,
    previousStep,
    completeOnboarding,
    skipOnboarding,
    getCurrentStep,
    getProgress,
  } = useOnboarding();

  const currentStep = getCurrentStep();
  const progress = getProgress();
  const isLastStep = state.currentStep === state.steps.length - 1;
  const isFirstStep = state.currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
      onComplete?.();
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    skipOnboarding();
    onSkip?.();
  };

  if (!state.isVisible || !currentStep) {
    return null;
  }

  return (
    <Modal
      visible={state.isVisible}
      transparent
      animationType='fade'
      statusBarTranslucent
     accessible={false} accessibilityLabel="Modal">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.icon}>{currentStep.icon}</Text>
            <Text style={styles.title}>{currentStep.title}</Text>
            <Text style={styles.description}>{currentStep.description}</Text>
          </View>

          {config.showProgress && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {state.currentStep + 1} of {state.steps.length}
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            {!isFirstStep && (
              <TouchableOpacity style={styles.secondaryButton} onPress={previousStep} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
                <Ionicons name='chevron-back' size={20} color='#666' />
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <View style={styles.primaryActions}>
              {config.skipEnabled && !isLastStep && (
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.primaryButton} onPress={handleNext} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
                <Text style={styles.primaryButtonText}>
                  {isLastStep ? 'Get Started' : 'Next'}
                </Text>
                <Ionicons
                  name={isLastStep ? 'checkmark' : 'chevron-forward'}
                  size={20}
                  color='#fff'
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxWidth: width - 40,
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e1e5e9',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  primaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
});
