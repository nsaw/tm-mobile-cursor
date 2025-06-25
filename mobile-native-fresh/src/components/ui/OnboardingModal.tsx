import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../ui/Button';
import { Text, Heading, Caption } from '../ui/Text';
import { Brain, Mic, Lightbulb, Search } from 'lucide-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  isDemo?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { tokens } = useTheme();

  const steps = [
    {
      title: 'Welcome to Thoughtmarks!',
      description: 'Your personal knowledge management system for capturing thoughts without breaking flow state.',
      icon: <Brain size={43} color={designTokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Voice to Thoughtmark',
      description: "Quickly capture ideas using voice input. Perfect for when you're in the zone and don't want to type.",
      icon: <Mic size={43} color={designTokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Siri Shortcuts Setup',
      description: "Enable voice commands like 'Hey Siri, capture thoughtmark' or 'Hey Siri, add to thoughtmarks' from anywhere on your device. You can set this up now or later in Settings.",
      icon: <Ionicons name="phone-portrait-outline" size={43} color="#60A5FA" />,
    },
    {
      title: 'Organize with Smart Bins',
      description: 'AI automatically categorizes your thoughts into relevant bins. You can also create custom bins for specific projects.',
      icon: <MaterialCommunityIcons name="crown-outline" size={43} color="#FFD700" />,
    },
    {
      title: 'Search & Discover',
      description: 'Find any thoughtmark instantly with semantic and keyword search.',
      icon: <Search size={43} color={designTokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Unlock Premium Features',
      description: 'Access advanced AI, unlimited bins, priority support, and more.',
      icon: <MaterialCommunityIcons name="crown-outline" size={43} color="#FFD700" />,
      premium: true,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Example: check if user is premium (replace with real logic)
  const isPremium = false; // TODO: wire up to real user state

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      accessible={true}
      accessibilityLabel={steps[currentStep].title}
    >
      <View style={[styles.overlay, { backgroundColor: designTokens.colors.background + 'E6' }]}> {/* 90% opacity */}
        <View style={[styles.card, {
          backgroundColor: designTokens.colors.backgroundSecondary,
          borderRadius: designTokens.radius.lg,
          padding: designTokens.spacing.xl,
          maxWidth: 500,
        }]}
        >
          {/* Step Indicator */}
          <View style={styles.stepHeader}>
            <View style={[styles.stepCircle, { backgroundColor: '#C6D600' }]}> {/* Accent color */}
              <Text style={{
                fontWeight: 'bold',
                color: '#222',
                fontSize: 16, // designTokens.typography.fontSize.sm * 1.34
              }}>{currentStep + 1}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: designTokens.spacing.md }}>
              <Heading level={1} style={{ color: designTokens.colors.text }}>{steps[currentStep].title}</Heading>
              <Caption style={{ color: designTokens.colors.textSecondary }}>{`${currentStep + 1} of ${steps.length}`}</Caption>
            </View>
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>{steps[currentStep].icon}</View>

          {/* Description */}
          <Text align="center" style={{ color: designTokens.colors.text, marginBottom: designTokens.spacing.lg }}>{steps[currentStep].description}</Text>

          {/* Divider/accent below text chunk */}
          <View style={{ alignItems: 'center', marginBottom: designTokens.spacing.lg }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: designTokens.colors.accent }} />
          </View>

          {/* Progress Dots */}
          <View style={styles.progressDots}>
            {steps.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === currentStep
                    ? { backgroundColor: '#C6D600' }
                    : { backgroundColor: designTokens.colors.textMuted },
                ]}
              />
            ))}
          </View>

          {/* Step 6/6: Premium Upsell Button (full width, yellow outline, yellow text, below dots) */}
          {steps[currentStep].premium && !isPremium && (
            <Button
              variant="outline"
              onPress={() => {/* TODO: navigate to premium/upgrade */}}
              style={{
                borderColor: '#FFD700',
                borderWidth: 2,
                backgroundColor: 'transparent',
                borderRadius: designTokens.radius.md,
                paddingHorizontal: designTokens.spacing.xl,
                marginBottom: designTokens.spacing.lg,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              textStyle={{ color: '#FFD700', fontWeight: 'bold' }}
            >
              Upgrade Now
            </Button>
          )}

          {/* Navigation Buttons */}
          <View style={[styles.buttonRow, { gap: designTokens.spacing.md }]}> 
            {/* Previous Button */}
            <Button
              variant="ghost"
              onPress={handlePrevious}
              disabled={currentStep === 0}
              style={{ flexDirection: 'row', alignItems: 'center', opacity: currentStep === 0 ? 0.5 : 1 }}
              textStyle={{ color: designTokens.colors.textSecondary, fontWeight: 'bold' }}
              leftIcon={<Ionicons name="arrow-back" size={27} color={designTokens.colors.textSecondary} />}
            >
              Previous
            </Button>
            {/* Step 6/6: Finish Button */}
            {steps[currentStep].premium && !isPremium ? (
              <Button
                onPress={onClose}
                style={{
                  backgroundColor: designTokens.colors.accent,
                  borderRadius: designTokens.radius.md,
                  paddingHorizontal: designTokens.spacing.xl,
                }}
                textStyle={{ color: designTokens.colors.text, fontWeight: 'bold' }}
              >
                Finish
              </Button>
            ) : (
              <Button
                onPress={handleNext}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: designTokens.colors.accent, borderRadius: designTokens.radius.md, paddingHorizontal: designTokens.spacing.xl }}
                textStyle={{ color: designTokens.colors.text, fontWeight: 'bold' }}
                rightIcon={<Ionicons name="arrow-forward" size={27} color={designTokens.colors.text} />}
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </Button>
            )}
          </View>

          <Button
            variant="ghost"
            onPress={onClose}
          >
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    alignItems: 'stretch',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 21, // 16 * 1.34
  },
  stepCircle: {
    width: 48, // 36 * 1.34
    height: 48, // 36 * 1.34
    borderRadius: 24, // 18 * 1.34
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleText: {
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 21, // 16 * 1.34
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 21, // 16 * 1.34
  },
  dot: {
    width: 13, // 10 * 1.34
    height: 13, // 10 * 1.34
    borderRadius: 7, // 5 * 1.34
    marginHorizontal: 4, // 3 * 1.34
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 11, // 8 * 1.34
  },
}); 