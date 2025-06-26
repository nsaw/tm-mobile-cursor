import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Brain, Mic, Search } from 'lucide-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  isDemo?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { typography, spacing, tokens } = useTheme();

  const steps = [
    {
      title: 'Welcome to Thoughtmarks!',
      description: 'Your personal knowledge management system for capturing thoughts without breaking flow state.',
      icon: <Brain size={90} color="#3B82F6" strokeWidth={2.5} />,
    },
    {
      title: 'Voice to Thoughtmark',
      description: "Quickly capture ideas using voice input. Perfect for when you're in the zone and don't want to type.",
      icon: <Mic size={90} color="#3B82F6" strokeWidth={2.5} />,
    },
    {
      title: 'Siri Shortcuts Setup',
      description: "Enable voice commands like 'Hey Siri, capture thoughtmark' or 'Hey Siri, add to thoughtmarks' from anywhere on your device. You can set this up now or later in Settings.",
      icon: <Ionicons name="phone-portrait-outline" size={90} color="#60A5FA" />,
    },
    {
      title: 'Organize with Smart Bins',
      description: 'AI automatically categorizes your thoughts into relevant bins. You can also create custom bins for specific projects.',
      icon: <MaterialCommunityIcons name="crown-outline" size={90} color="#FFD700" />,
    },
    {
      title: 'Search & Discover',
      description: 'Find any thoughtmark instantly with semantic and keyword search.',
      icon: <Search size={90} color="#3B82F6" strokeWidth={2.5} />,
    },
    {
      title: 'Unlock Premium Features',
      description: 'Access advanced AI, unlimited bins, priority support, and more.',
      icon: <MaterialCommunityIcons name="crown-outline" size={90} color="#FFD700" />,
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
      <View style={[styles.overlay, { backgroundColor: '#000000E6' }]}> {/* 90% opacity */}
        <View style={[styles.card, {
          backgroundColor: '#2D3748',
          borderRadius: 12,
          padding: spacing.modalPaddingHorizontal,
          maxWidth: 500,
          minHeight: 400,
        }]}
        >
          {/* Centered Heading */}
          <View style={styles.centeredHeader}>
            <Text variant="heading" style={{ 
              marginBottom: 4,
              textAlign: 'center',
              color: tokens.colors.text,
              fontSize: tokens.typography.fontSize.heading,
              fontWeight: tokens.typography.fontWeight.bold,
              fontFamily: 'Ubuntu_700Bold',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              {steps[currentStep].title}
            </Text>
            <Text style={{
              ...typography.small,
              color: tokens.colors.textSecondary,
              textAlign: 'center',
              opacity: 0.9,
              fontSize: tokens.typography.fontSize.sm,
            }}>
              {`${currentStep + 1} of ${steps.length}`}
            </Text>
          </View>

          {/* Icon - Enlarged and centered */}
          <View style={[styles.iconContainer, { 
            alignSelf: 'center',
            marginTop: spacing.modalPaddingVertical * 0.5,
            marginBottom: spacing.modalPaddingVertical * 0.5,
          }]}>
            {steps[currentStep].icon}
          </View>

          {/* Description - Increased font size and better contrast */}
          <Text 
            variant="body" 
            style={{ 
              marginBottom: spacing.modalPaddingVertical, 
              textAlign: 'center',
              paddingVertical: spacing.modalPaddingVertical,
              ...typography.body,
              lineHeight: 24,
              color: tokens.colors.text,
              fontSize: tokens.typography.fontSize.body + 2,
            }} 
            numberOfLines={4}
          >
            {steps[currentStep].description}
          </Text>

          {/* Divider/accent below text chunk */}
          <View style={{ alignItems: 'center', marginBottom: spacing.modalPaddingVertical }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: tokens.colors.accent }} />
          </View>

          {/* Progress Dots - Improved visibility */}
          <View style={styles.progressDots}>
            {steps.map((_, idx) => (
              <View key={idx}>
                <View style={[
                  styles.dot,
                  {
                    backgroundColor: idx === currentStep ? tokens.colors.accent : tokens.colors.borderHover,
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
                borderColor: '#FFD700',
                borderWidth: 2,
                backgroundColor: 'transparent',
                borderRadius: 8,
                paddingHorizontal: spacing.modalPaddingHorizontal,
                paddingVertical: spacing.modalPaddingVertical,
                marginBottom: spacing.modalPaddingVertical,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 48,
              }}
              textStyle={{ color: '#FFD700', fontWeight: 'bold', fontSize: tokens.typography.fontSize.body }}
            >
              <Text>Upgrade now</Text>
            </Button>
          )}

          {/* Navigation Buttons */}
          <View style={[styles.buttonRow, { gap: spacing.buttonPadding }]}> 
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
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.accent, borderRadius: 8, paddingHorizontal: spacing.modalPaddingHorizontal }}
                textStyle={{ color: tokens.colors.buttonText, fontWeight: 'bold' }}
                rightIcon={<Ionicons name="checkmark" size={27} color={tokens.colors.buttonText} />}
              >
                <Text>Finish</Text>
              </Button>
            ) : (
              <Button
                onPress={handleNext}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.accent, borderRadius: 8, paddingHorizontal: spacing.modalPaddingHorizontal }}
                textStyle={{ color: tokens.colors.buttonText, fontWeight: 'bold' }}
                rightIcon={<Ionicons name="arrow-forward" size={27} color={tokens.colors.buttonText} />}
              >
                <Text>{currentStep === steps.length - 1 ? 'Get started' : 'Next'}</Text>
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
  centeredHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 21,
    marginBottom: 16,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
}); 