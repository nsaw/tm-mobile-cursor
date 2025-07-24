import React, { useState } from 'react';
import { Modal, View, Dimensions, TouchableOpacity, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { Brain, Mic, Search } from 'lucide-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';

const { width: screenWidth } = Dimensions.get('window');

interface ModalButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  icon?: string;
  children: React.ReactNode;
  style?: StyleProp<View role="Wrapper"Style>;
  disabled?: boolean;
  iconRight?: boolean;
  textStyle?: any;
}

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
}

const ModalButton: React.FC<ModalButtonProps> = ({ onPress, icon, children, style, disabled, iconRight, textStyle }) => {
  const { tokens, typography } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 44,
          marginHorizontal: tokens.spacing.sm,
          backgroundColor: tokens.colors.accent,
          borderRadius: tokens.radius.md,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      activeOpacity={0.85}
      accessibilityRole="button"
      disabled={disabled}
    >
      {!iconRight && icon && <Feather name={icon} size={18} color={tokens.colors.buttonText} style={{ marginRight: 8 }} />}
      <Text style={{
        ...typography.buttonText,
        fontSize: 12,
        color: tokens.colors.buttonText,
        textAlign: 'center',
        fontWeight: '600',
        ...textStyle,
      }}>{children}</Text>
      {iconRight && icon && <Feather name={icon} size={18} color={tokens.colors.buttonText} style={{ marginLeft: 8 }} />}
    </TouchableOpacity>
  );
};

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ visible, onClose }) => {
  const { designTokens, typography, spacing } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const iconSize = designTokens.spacing.xxxl * 2;

  const steps = [
    {
      title: 'Welcome to Thoughtmarks!',
      description: 'Your personal knowledge management system for capturing thoughts without breaking flow state.',
      icon: <Brain size={iconSize} color={designTokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Voice to Thoughtmark',
      description: "Quickly capture ideas using voice input. Perfect for when you're in the zone and don't want to type.",
      icon: <Mic size={iconSize} color={designTokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Siri Shortcuts Setup',
      description: "Enable voice commands like 'Hey Siri, capture thoughtmark' or 'Hey Siri, add to thoughtmarks' from anywhere on your device. You can set this up now or later in Settings.",
      icon: <Ionicons name="phone-portrait-outline" size={iconSize} color={designTokens.colors.accent} />,
    },
    {
      title: 'Organize with Smart Bins',
      description: 'AI automatically categorizes your thoughts into relevant bins. You can also create custom bins for specific projects.',
      icon: <MaterialCommunityIcons name="crown-outline" size={iconSize} color={designTokens.colors.accent} />,
    },
    {
      title: 'Search & Discover',
      description: 'Find any thoughtmark instantly with semantic and keyword search.',
      icon: <Search size={iconSize} color={designTokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Unlock Premium Features',
      description: 'Access advanced AI, unlimited bins, priority support, and more.',
      icon: <MaterialCommunityIcons name="crown-outline" size={iconSize} color={designTokens.colors.accent} />,
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

  // Button text size for onboarding
  const onboardingButtonText = {
    ...typography.buttonText,
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'center',
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View role="Wrapper" style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000E6',
      }}>
        <View role="Wrapper" style={{
          width: '90%',
          marginHorizontal: 'auto',
          paddingHorizontal: spacing.pagePaddingHorizontal,
          paddingTop: designTokens.spacing.xl,
          paddingBottom: designTokens.spacing.xl,
          backgroundColor: designTokens.colors.backgroundSecondary,
          borderRadius: designTokens.radius.lg,
          alignItems: 'center',
        }}>
          {/* Title */}
          <Text style={{
            fontFamily: 'Oswald',
            fontSize: ((typography.sectionTitle?.fontSize || 16) + 2),
            fontWeight: '700',
            textTransform: 'uppercase',
            opacity: 0.85,
            textAlign: 'center',
            marginBottom: designTokens.spacing.lg,
            color: designTokens.colors.text,
            paddingVertical: designTokens.spacing.sm,
            lineHeight: ((typography.sectionTitle?.fontSize || 16) + 8),
          }}>{steps[currentStep].title}</Text>
          {/* Pagination Label */}
          <Text style={{
            ...typography.small,
            textAlign: 'center',
            marginBottom: designTokens.spacing.sm,
            color: designTokens.colors.textSecondary,
          }}>{`${currentStep + 1} of ${steps.length}`}</Text>
          {/* Icon */}
          <View role="Wrapper">{steps[currentStep].icon}</View>
          {/* Body Text */}
          <Text style={{
            ...typography.body,
            fontSize: (typography.body.fontSize || 16) - 2,
            lineHeight: 24,
            textAlign: 'center',
            color: designTokens.colors.textSecondary,
            marginBottom: designTokens.spacing.md,
          }}>{steps[currentStep].description}</Text>
          {/* Pagination Dots */}
          <View role="Wrapper" style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: designTokens.spacing.md, marginBottom: designTokens.spacing.md }}>
            {steps.map((_, i) => (
              <View role="Wrapper" key={i} style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === currentStep ? designTokens.colors.accent : designTokens.colors.border,
                marginHorizontal: 4
              }} />
            ))}
          </View>
          {/* Buttons */}
          <View role="Wrapper" style={{ flexDirection: 'row', width: '100%', marginTop: designTokens.spacing.xxxl, justifyContent: 'center', alignItems: 'center' }}>
            <ModalButton
              onPress={handlePrevious}
              disabled={currentStep === 0}
            ><Text>Previous</Text></ModalButton>
            <ModalButton
              onPress={handleNext}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </ModalButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 