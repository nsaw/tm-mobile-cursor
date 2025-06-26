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
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  iconRight?: boolean;
}

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
}

const ModalButton: React.FC<ModalButtonProps> = ({ onPress, icon, children, style, disabled, iconRight }) => {
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
      accessible={true}
      disabled={disabled}
    >
      {!iconRight && icon && <Feather name={icon} size={18} color={tokens.colors.buttonText} style={{ marginRight: 8 }} />}
      <Text style={{
        ...typography.buttonText,
        fontSize: 12,
        color: tokens.colors.buttonText,
        textAlign: 'center',
        fontWeight: '600',
      }}>{children}</Text>
      {iconRight && icon && <Feather name={icon} size={18} color={tokens.colors.buttonText} style={{ marginLeft: 8 }} />}
    </TouchableOpacity>
  );
};

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { typography, spacing, tokens } = useTheme();

  const iconSize = tokens.spacing.xxxl * 2;

  const steps = [
    {
      title: 'Welcome to Thoughtmarks!',
      description: 'Your personal knowledge management system for capturing thoughts without breaking flow state.',
      icon: <Brain size={iconSize} color={tokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Voice to Thoughtmark',
      description: "Quickly capture ideas using voice input. Perfect for when you're in the zone and don't want to type.",
      icon: <Mic size={iconSize} color={tokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Siri Shortcuts Setup',
      description: "Enable voice commands like 'Hey Siri, capture thoughtmark' or 'Hey Siri, add to thoughtmarks' from anywhere on your device. You can set this up now or later in Settings.",
      icon: <Ionicons name="phone-portrait-outline" size={iconSize} color={tokens.colors.accent} />,
    },
    {
      title: 'Organize with Smart Bins',
      description: 'AI automatically categorizes your thoughts into relevant bins. You can also create custom bins for specific projects.',
      icon: <MaterialCommunityIcons name="crown-outline" size={iconSize} color={tokens.colors.accent} />,
    },
    {
      title: 'Search & Discover',
      description: 'Find any thoughtmark instantly with semantic and keyword search.',
      icon: <Search size={iconSize} color={tokens.colors.accent} strokeWidth={2.5} />,
    },
    {
      title: 'Unlock Premium Features',
      description: 'Access advanced AI, unlimited bins, priority support, and more.',
      icon: <MaterialCommunityIcons name="crown-outline" size={iconSize} color={tokens.colors.accent} />,
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      accessible={true}
      accessibilityLabel={steps[currentStep].title}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000E6',
      }}>
        <View style={{
          width: screenWidth * 0.9,
          paddingHorizontal: spacing.pagePaddingHorizontal,
          paddingTop: tokens.spacing.xxxl,
          paddingBottom: tokens.spacing.xxxl,
          backgroundColor: tokens.colors.backgroundSecondary,
          borderRadius: tokens.radius.lg,
          alignItems: 'center',
        }}>
          {/* Title */}
          <Text style={{
            fontFamily: 'Oswald',
            fontSize: (typography.sectionTitle.fontSize || 24) + 2,
            fontWeight: '700',
            textTransform: 'uppercase',
            opacity: 0.85,
            textAlign: 'center',
            marginBottom: tokens.spacing.lg,
            color: tokens.colors.text,
          }}>{steps[currentStep].title}</Text>
          {/* Pagination Label */}
          <Text style={{
            ...typography.small,
            textAlign: 'center',
            marginBottom: tokens.spacing.sm,
            color: tokens.colors.textSecondary,
          }}>{`${currentStep + 1} of ${steps.length}`}</Text>
          {/* Icon */}
          <View style={{ alignItems: 'center', marginTop: tokens.spacing.xl, marginBottom: tokens.spacing.xl }}>
            {React.cloneElement(steps[currentStep].icon, { size: iconSize })}
          </View>
          {/* Body Text */}
          <Text style={{
            ...typography.body,
            fontSize: (typography.body.fontSize || 16) - 2,
            lineHeight: 24,
            textAlign: 'center',
            color: tokens.colors.textSecondary,
            marginBottom: tokens.spacing.md,
          }}>{steps[currentStep].description}</Text>
          {/* Pagination Dots */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: tokens.spacing.md, marginBottom: tokens.spacing.md }}>
            {steps.map((_, i) => (
              <View key={i} style={{
                width: 6 * 0.6,
                height: 6 * 0.6,
                borderRadius: 3 * 0.6,
                marginHorizontal: 2,
                backgroundColor: i === currentStep ? tokens.colors.accent : tokens.colors.textSecondary,
                opacity: i === currentStep ? 1 : 0.5,
              }} />
            ))}
          </View>
          {/* Buttons */}
          <View style={{ flexDirection: 'row', width: '100%', marginTop: tokens.spacing.xxxl, justifyContent: 'center', alignItems: 'center' }}>
            <ModalButton
              onPress={handlePrevious}
              icon="arrow-left"
              style={{ backgroundColor: tokens.colors.background, borderWidth: 1, borderColor: tokens.colors.accent, marginRight: tokens.spacing.sm }}
              disabled={currentStep === 0}
            >
              Previous
            </ModalButton>
            <ModalButton
              onPress={handleNext}
              style={{ backgroundColor: tokens.colors.accent, flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center', gap: tokens.spacing.sm, minWidth: 120 }}
              icon="arrow-right"
              iconRight
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </ModalButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 