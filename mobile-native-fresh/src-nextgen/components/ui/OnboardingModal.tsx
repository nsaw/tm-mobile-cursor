import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
  steps?: OnboardingStep[];
}

const defaultSteps: OnboardingStep[] = [
  { id: 'welcome', title: 'Welcome to Thoughtmarks', description: 'Your personal space for capturing thoughts, ideas, and tasks.', icon: '🌟' },
  { id: 'thoughtmarks', title: 'Create Thoughtmarks', description: 'Capture your ideas quickly with voice notes or text.', icon: '💭' },
  { id: 'tasks', title: 'Manage Tasks', description: 'Turn your thoughts into actionable tasks and track progress.', icon: '✅' },
  { id: 'organization', title: 'Stay Organized', description: 'Use tags and bins to keep your content organized.', icon: '📁' },
  { id: 'ready', title: "You're All Set!", description: 'Start capturing your thoughts and ideas now.', icon: '🚀' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onClose,
  onComplete,
  steps = defaultSteps,
}) => {
  const { colors, spacing: _spacing, typography } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const _handleSkip = () => { onComplete(); };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      accessible={false}
      accessibilityLabel="Modal"
    >
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }] }>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={[styles.closeText, { color: colors.textSecondary, fontSize: typography.body.fontSize }]}>Skip</Text>
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: index === currentStep ? colors.primary : colors.border,
                  },
                ]}
              />
            ))}
          </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.stepContainer}>
            {currentStepData.icon && (<Text style={styles.icon}>{currentStepData.icon}</Text>)}
            <Text style={[styles.title, { color: colors.text, fontSize: typography.h1.fontSize, fontWeight: typography.h1.fontWeight }]}>
              {currentStepData.title}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary, fontSize: typography.body.fontSize, fontWeight: typography.body.fontWeight }]}>
              {currentStepData.description}
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.buttonContainer}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
                onPress={handlePrevious}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Previous"
              >
                <Text style={[styles.buttonText, { color: colors.text, fontSize: typography.body.fontSize, fontWeight: typography.body.fontWeight }]}>Previous</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary, flex: 1 }]}
              onPress={handleNext}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Next"
            >
              <Text style={[styles.buttonText, { color: colors.onPrimary, fontSize: typography.body.fontSize, fontWeight: typography.body.fontWeight }]}>
                {isLastStep ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  stepContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: '600',
  },
  progressDotActive: {
    backgroundColor: 'currentColor', // Use currentColor to inherit the color from the parent
  },
});
