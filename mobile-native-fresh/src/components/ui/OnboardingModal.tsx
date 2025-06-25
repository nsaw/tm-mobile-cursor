import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Brain, Mic, Search } from 'lucide-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../ui/Button';
import { Text, Heading, Caption } from '../ui/Text';

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
      icon: <Brain size={43} color={tokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Voice to Thoughtmark',
      description: "Quickly capture ideas using voice input. Perfect for when you're in the zone and don't want to type.",
      icon: <Mic size={43} color={tokens.colors.accent} strokeWidth={2.5} />,
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
      icon: <Search size={43} color={tokens.colors.accent} strokeWidth={2.5} />,
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
      <View style={[styles.overlay, { backgroundColor: tokens.colors.background + 'E6' }]}> {/* 90% opacity */}
        <View style={[styles.card, {
          backgroundColor: tokens.colors.backgroundSecondary,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.xl,
          maxWidth: 500,
        }]}
        >
          {/* Step Indicator */}
          <View style={styles.stepHeader}>
            <View style={[styles.stepCircle, { backgroundColor: '#C6D600' }]}> {/* Accent color */}
              <Text style={{ fontWeight: 'bold',
                color: tokens.colors.text,
                fontSize: tokens.typography.fontSize.sm * 1.34,
               }}>{currentStep + 1}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: tokens.spacing.md }}>
              <Text variant="heading" style={{ marginBottom: 4 }}>
                {steps[currentStep].title}
              </Text>
              <Caption><Text>{`${currentStep + 1} of ${steps.length}`}</Text></Caption>
            </View>
          </View>

          {/* Icon - Centered with proper spacing */}
          <View style={[styles.iconContainer, { 
            alignSelf: 'center',
            marginTop: tokens.spacing.lg,
            marginBottom: tokens.spacing.lg,
          }]}>
            {steps[currentStep].icon}
          </View>

          {/* Description - Using tagline variant with safe vertical spacing */}
          <Text 
            variant="tagline" 
            style={{ 
              marginBottom: tokens.spacing.lg, 
              textAlign: 'center',
              paddingVertical: tokens.spacing.lg,
            }} 
            numberOfLines={3}
          >
            {steps[currentStep].description}
          </Text>

          {/* Divider/accent below text chunk */}
          <View style={{ alignItems: 'center', marginBottom: tokens.spacing.lg }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: tokens.colors.accent }} />
          </View>

          {/* Progress Dots */}
          <View style={styles.progressDots}>
            {steps.map((_, idx) => (
              <View key={idx}>
                <View style={[
                  styles.dot,
                  {
                    backgroundColor: idx === currentStep ? tokens.colors.accent : tokens.colors.border,
                  }
                ]} />
              </View>
            ))}
          </View>

          {/* Step 6/6: Premium Upsell Button (full width, yellow outline, yellow text, below dots) */}
          {steps[currentStep].premium && !isPremium && (
            <Button
              variant="outline"
              onPress={() => {/* TODO: navigate to premium/upgrade */}}
              style={{
                borderColor: tokens.colors.border,
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
              <Text>Upgrade Now</Text>
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
              leftIcon={<Ionicons name="arrow-back" size={27} color={tokens.colors.textSecondary} />}
            >
              <Text>Previous</Text>
            </Button>
            {/* Next/Finish Button */}
            {steps[currentStep].premium && !isPremium ? (
              <Button
                onPress={onClose}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.accent, borderRadius: tokens.radius.md, paddingHorizontal: tokens.spacing.xl }}
                textStyle={{ color: tokens.colors.text, fontWeight: 'bold' }}
                rightIcon={<Ionicons name="checkmark" size={27} color={tokens.colors.text} />}
              >
                <Text>Finish</Text>
              </Button>
            ) : (
              <Button
                onPress={handleNext}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.accent, borderRadius: tokens.radius.md, paddingHorizontal: tokens.spacing.xl }}
                textStyle={{ color: tokens.colors.text, fontWeight: 'bold' }}
                rightIcon={<Ionicons name="arrow-forward" size={27} color={tokens.colors.text} />}
              >
                <Text>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</Text>
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
    fontSize: 16,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 21, // 16 * 1.34
    marginBottom: 16, // 12 * 1.34
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}); 