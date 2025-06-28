import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  premium?: boolean;
}

interface OnboardingModalProps {
  visible: boolean;
  steps: OnboardingStep[];
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ visible, steps, onClose }) => {
  const { tokens, spacing, typography } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      accessible={true}
      accessibilityLabel={steps[currentStep].title}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: tokens.colors.backgroundSecondary }]}> 
          {/* Header */}
          <View style={styles.centeredHeader}>
            <Text style={[styles.title, { color: tokens.colors.text }]}>{steps[currentStep].title}</Text>
            <Text style={[styles.subtitle, { color: tokens.colors.textSecondary }]}>{`${currentStep + 1} of ${steps.length}`}</Text>
          </View>
          {/* Icon */}
          <View style={styles.iconContainer}>{steps[currentStep].icon}</View>
          {/* Description */}
          <Text style={[styles.description, { color: tokens.colors.textSecondary }]}>{steps[currentStep].description}</Text>
          {/* Progress Dots */}
          <View style={styles.progressDots}>
            {steps.map((_, idx) => (
              <View key={idx} style={[styles.dot, { backgroundColor: idx === currentStep ? tokens.colors.accent : tokens.colors.border }]} />
            ))}
          </View>
          {/* Navigation Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handlePrev}
              disabled={currentStep === 0}
              style={[styles.navButton, currentStep === 0 && { opacity: 0.5 }]}
              accessibilityRole="button"
              accessibilityLabel="Previous step"
              accessible={true}
            >
              <Text style={{ color: tokens.colors.accent }}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              style={styles.navButton}
              accessibilityRole="button"
              accessibilityLabel={currentStep === steps.length - 1 ? "Finish onboarding" : "Next step"}
              accessible={true}
            >
              <Text style={{ color: tokens.colors.accent }}>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000E6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 24,
    maxWidth: 500,
    minHeight: 400,
    width: '100%',
    alignItems: 'center',
  },
  centeredHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  navButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
}); 