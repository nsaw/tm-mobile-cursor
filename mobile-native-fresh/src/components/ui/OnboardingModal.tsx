import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  isDemo?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ visible, onClose, isDemo }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to Thoughtmarks!</Text>
          <Text style={styles.subtitle}>
            {isDemo
              ? 'You are using a demo account. Data may be reset at any time.'
              : 'Your personal knowledge management system for capturing thoughts without breaking flow state.'}
          </Text>
          <View style={styles.highlights}>
            <Text style={styles.highlight}>• Voice capture with auto-transcription</Text>
            <Text style={styles.highlight}>• AI-powered smart categorization</Text>
            <Text style={styles.highlight}>• Semantic search and discovery</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.md,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  highlights: {
    marginBottom: spacing.lg,
    alignSelf: 'stretch',
  },
  highlight: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: typography.body.fontSize,
  },
}); 