import React, { useState } from 'react';
import { 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';

import { useTheme } from '../../../theme/ThemeProvider';
import { signInWithEmail, isValidEmail, isValidPassword } from '../../../lib/firebaseAuth';
import { Text } from '../../../components/ui/Text';
import AutoRoleView from '../../../components/wrappers/AutoRoleView';

interface SignInScreenProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSuccess: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  visible,
  onClose,
  onSwitchToSignUp,
  onSuccess,
}) => {
  const { tokens, typography, spacing } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = isValidPassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      onSuccess();
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    Alert.alert('Forgot Password', 'Password reset functionality coming soon');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      
      
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <AutoRoleView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000000E6',
          }} forceRole="modal">
            <AutoRoleView style={{
              width: '90%',
              maxWidth: 400,
              marginHorizontal: 'auto',
              paddingHorizontal: spacing.modalPaddingHorizontal || tokens.spacing.xl,
              paddingTop: tokens.spacing.xl,
              paddingBottom: tokens.spacing.xl,
              backgroundColor: tokens.colors.backgroundSecondary,
              borderRadius: tokens.radius.lg,
              alignItems: 'center',
            }} forceRole="card">
              {/* Title */}
              <Text style={{
                fontFamily: 'Oswald',
                fontSize: ((typography.sectionTitle?.fontSize || 16) + 2),
                fontWeight: '700',
                textTransform: 'uppercase',
                opacity: 0.85,
                textAlign: 'center',
                marginBottom: tokens.spacing.lg,
                color: tokens.colors.text,
                paddingVertical: tokens.spacing.sm,
                lineHeight: ((typography.sectionTitle?.fontSize || 16) + 8),
              }}>
                Sign In
              </Text>

              {/* Email Input */}
              <AutoRoleView style={{
                width: '100%',
                marginBottom: tokens.spacing.md,
              }} forceRole="input">
                <AutoRoleView style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: errors.email ? tokens.colors.danger : tokens.colors.border,
                  borderRadius: tokens.radius.md,
                  paddingHorizontal: tokens.spacing.md,
                  backgroundColor: tokens.colors.background,
                }} forceRole="input">
                  <Mail size={20} color={tokens.colors.textSecondary} style={{ marginRight: tokens.spacing.sm }} />
                  <TextInput
                    style={{
                      flex: 1,
                      color: tokens.colors.text,
                      fontSize: typography.body.fontSize,
                      paddingVertical: tokens.spacing.md,
                    }}
                    placeholder="Email"
                    placeholderTextColor={tokens.colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    
                  />
                </AutoRoleView>
                {errors.email && (
                  <Text style={{
                    color: tokens.colors.danger,
                    fontSize: typography.small.fontSize,
                    marginTop: tokens.spacing.xs,
                  }}>
                    {errors.email}
                  </Text>
                )}
              </AutoRoleView>

              {/* Password Input */}
              <AutoRoleView style={{
                width: '100%',
                marginBottom: tokens.spacing.lg,
              }} forceRole="input">
                <AutoRoleView style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: errors.password ? tokens.colors.danger : tokens.colors.border,
                  borderRadius: tokens.radius.md,
                  paddingHorizontal: tokens.spacing.md,
                  backgroundColor: tokens.colors.background,
                }} forceRole="input">
                  <Lock size={20} color={tokens.colors.textSecondary} style={{ marginRight: tokens.spacing.sm }} />
                  <TextInput
                    style={{
                      flex: 1,
                      color: tokens.colors.text,
                      fontSize: typography.body.fontSize,
                      paddingVertical: tokens.spacing.md,
                    }}
                    placeholder="Password"
                    placeholderTextColor={tokens.colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    accessibilityRole="button"
                    
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={tokens.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={tokens.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </AutoRoleView>
                {errors.password && (
                  <Text style={{
                    color: tokens.colors.danger,
                    fontSize: typography.small.fontSize,
                    marginTop: tokens.spacing.xs,
                  }}>
                    {errors.password}
                  </Text>
                )}
              </AutoRoleView>

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={{
                  alignSelf: 'flex-end',
                  marginBottom: tokens.spacing.lg,
                }}
                accessibilityRole="button"
                
              >
                <Text style={{
                  color: tokens.colors.accent,
                  fontSize: typography.small.fontSize,
                  textDecorationLine: 'underline',
                }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: tokens.colors.accent,
                  borderRadius: tokens.radius.md,
                  paddingVertical: tokens.spacing.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: loading ? 0.5 : 1,
                  marginBottom: tokens.spacing.md,
                }}
                accessibilityRole="button"
                
              >
                <Text style={{
                  color: tokens.colors.buttonText || tokens.colors.background,
                  fontSize: typography.buttonText.fontSize,
                  fontWeight: '600',
                }}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Switch to Sign Up */}
              <AutoRoleView style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }} forceRole="section">
                <Text style={{
                  color: tokens.colors.textSecondary,
                  fontSize: typography.body.fontSize,
                }}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={onSwitchToSignUp}
                  accessibilityRole="button"
                  
                >
                  <Text style={{
                    color: tokens.colors.accent,
                    fontSize: typography.body.fontSize,
                    fontWeight: '600',
                  }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </AutoRoleView>
            </AutoRoleView>
          </AutoRoleView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}; 