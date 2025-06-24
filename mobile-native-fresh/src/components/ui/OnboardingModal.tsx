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
      icon: <Brain size={tokens.iconSize.xl} color={tokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Voice to Thoughtmark',
      description: "Quickly capture ideas using voice input. Perfect for when you're in the zone and don't want to type.",
      icon: <Mic size={tokens.iconSize.xl} color={tokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Siri Shortcuts Setup',
      description: "Enable voice commands like 'Hey Siri, capture thoughtmark' or 'Hey Siri, add to thoughtmarks' from anywhere on your device. You can set this up now or later in Settings.",
      icon: <Ionicons name="phone-portrait-outline" size={tokens.iconSize.xl} color="#60A5FA" />,
    },
    {
      title: 'Organize with Smart Bins',
      description: 'AI automatically categorizes your thoughts into relevant bins. You can also create custom bins for specific projects.',
      icon: <MaterialCommunityIcons name="crown-outline" size={tokens.iconSize.xl} color="#FFD700" />,
    },
    {
      title: 'Search & Discover',
      description: 'Find any thoughtmark instantly with semantic and keyword search.',
      icon: <Search size={tokens.iconSize.xl} color={tokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Unlock Premium Features',
      description: 'Access advanced AI, unlimited bins, priority support, and more.',
      icon: <MaterialCommunityIcons name="crown-outline" size={tokens.iconSize.xl} color="#FFD700" />,
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
      animationType="fade"
      transparent
      onRequestClose={() => {}}
    >
      <View style={[styles.overlay, { backgroundColor: tokens.colors.background + 'E6' }]}> {/* 90% opacity */}
        <View style={[styles.card, {
          backgroundColor: tokens.colors.backgroundSecondary,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.xl,
          maxWidth: 400,
        }]}
        >
          {/* Step Indicator */}
          <View style={styles.stepHeader}>
            <View style={[styles.stepCircle, { backgroundColor: '#C6D600' }]}> {/* Accent color */}
              <Text style={{
                fontWeight: 'bold',
                color: '#222',
                fontSize: tokens.typography.fontSize.sm,
              }}>{currentStep + 1}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: tokens.spacing.md }}>
              <Heading level={1} style={{ color: tokens.colors.text }}>{steps[currentStep].title}</Heading>
              <Caption style={{ color: tokens.colors.textSecondary }}>{`${currentStep + 1} of ${steps.length}`}</Caption>
            </View>
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>{steps[currentStep].icon}</View>

          {/* Description */}
          <Text align="center" style={{ color: tokens.colors.text, marginBottom: tokens.spacing.lg }}>{steps[currentStep].description}</Text>

          {/* Divider/accent below text chunk */}
          <View style={{ alignItems: 'center', marginBottom: tokens.spacing.lg }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: tokens.colors.accent }} />
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
                    : { backgroundColor: tokens.colors.textMuted },
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
                borderRadius: tokens.radius.md,
                paddingHorizontal: tokens.spacing.xl,
                marginBottom: tokens.spacing.lg,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              textStyle={{ color: '#FFD700', fontWeight: 'bold' }}
            >
              <Text style={{ color: '#FFD700', fontWeight: 'bold', marginRight: 4 }}>Upgrade Now</Text>
              <MaterialCommunityIcons name="crown-outline" size={tokens.iconSize.md} color="#FFD700" />
            </Button>
          )}

          {/* Navigation Buttons */}
          <View style={[styles.buttonRow, { gap: tokens.spacing.md }]}> 
            {/* Previous Button */}
            <Button
              variant="ghost"
              onPress={handlePrevious}
              disabled={currentStep === 0}
              style={{ flexDirection: 'row', alignItems: 'center', opacity: currentStep === 0 ? 0.5 : 1 }}
              textStyle={{ color: tokens.colors.textSecondary, fontWeight: 'bold' }}
            >
              <Ionicons name="arrow-back" size={tokens.iconSize.md} color={tokens.colors.textSecondary} />
              <Text style={{ color: tokens.colors.textSecondary, marginLeft: 4, fontWeight: 'bold' }}>Previous</Text>
            </Button>
            {/* Step 6/6: Finish Button */}
            {steps[currentStep].premium && !isPremium ? (
              <Button
                onPress={onClose}
                style={{
                  backgroundColor: tokens.colors.accent,
                  borderRadius: tokens.radius.md,
                  paddingHorizontal: tokens.spacing.xl,
                }}
                textStyle={{ color: tokens.colors.text, fontWeight: 'bold' }}
              >
                <Text style={{ color: tokens.colors.text, fontWeight: 'bold' }}>Finish</Text>
              </Button>
            ) : (
              <Button
                onPress={handleNext}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.accent, borderRadius: tokens.radius.md, paddingHorizontal: tokens.spacing.xl }}
                textStyle={{ color: tokens.colors.text, fontWeight: 'bold' }}
              >
                <Text style={{ color: tokens.colors.text, fontWeight: 'bold', marginRight: 4 }}>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</Text>
                <Ionicons name="arrow-forward" size={tokens.iconSize.md} color={tokens.colors.text} />
              </Button>
            )}
          </View>
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
    marginBottom: 16,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleText: {
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
}); 