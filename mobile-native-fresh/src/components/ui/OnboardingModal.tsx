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
        <View style={{
          paddingVertical: spacing.modalPaddingVertical * 2, // 2x vertical padding
          marginHorizontal: spacing.modalPaddingHorizontal, // horizontal margin
          width: '90%', // 90% width
          alignSelf: 'center',
          backgroundColor: tokens.colors.backgroundSecondary,
          borderRadius: tokens.radius.lg,
        }}>
          {/* Icon - larger */}
          <View style={{ alignItems: 'center', marginBottom: spacing.modalPaddingVertical }}>
            {steps[currentStep].icon}
          </View>
          {/* Title */}
          <Text variant="heading" style={{
            ...typography.sectionTitle,
            fontSize: tokens.typography.fontSize.heading,
            textAlign: 'center',
            color: tokens.colors.text,
            marginBottom: spacing.textMarginBottom,
          }}>{steps[currentStep].title}</Text>
          {/* Body/Content */}
          <Text variant="body" style={{
            ...typography.body,
            fontSize: tokens.typography.fontSize.body + 2,
            lineHeight: 24,
            textAlign: 'center',
            color: tokens.colors.textSecondary,
            marginBottom: spacing.modalPaddingVertical,
          }}>{steps[currentStep].description}</Text>
          {/* Pagination Dots - smaller */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: spacing.modalPaddingVertical }}>
            {steps.map((_, i) => (
              <View key={i} style={{
                width: 6, height: 6, borderRadius: 3, marginHorizontal: 2,
                backgroundColor: i === currentStep ? tokens.colors.accent : tokens.colors.border,
                opacity: i === currentStep ? 1 : 0.5,
              }} />
            ))}
          </View>
          {/* Buttons - 3x horizontal margin, 12pt text */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: spacing.modalPaddingHorizontal * 3 }}>
            <Button style={{ flex: 1, marginRight: spacing.modalPaddingHorizontal / 2 }} textStyle={{ fontSize: 12 }} onPress={handlePrevious}>Previous</Button>
            <Button style={{ flex: 1, marginLeft: spacing.modalPaddingHorizontal / 2 }} textStyle={{ fontSize: 12 }} onPress={handleNext}>Next</Button>
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