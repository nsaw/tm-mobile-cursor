import { Text ,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
// src/features/auth/components/LoginForm.tsx
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { colors, spacing, typography } from '../../../theme/theme'
import { useTheme } from '../../../theme/ThemeProvider'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void
  loading?: boolean
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {;
  const { tokens } = useTheme();
;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const styles = StyleSheet.create({
    container: {
      width: '100%'
    },
    inputContainer: {
      marginBottom: spacing.md
    },
    label: {
      ...typography.body,
      color: colors.text,
      marginBottom: spacing.xs
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: tokens.radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.body.fontSize,
      color: colors.text,
      backgroundColor: colors.card
    },
    inputError: {
      borderColor: '#ff4444'
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: tokens.radius.md,
      backgroundColor: colors.card
    },
    passwordInput: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.body.fontSize,
      color: colors.text
    },
    eyeButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm
    },
    errorText: {
      color: '#ff4444',
      fontSize: 14,
      marginTop: spacing.xs
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: tokens.radius.md,
      paddingVertical: spacing.sm * 1.5,
      alignItems: 'center',
      marginTop: spacing.sm
    },
    submitButtonDisabled: {
      backgroundColor: '#555555'
    },
    submitButtonText: {
      ...typography.body,
      color: '#ffffff',
      fontWeight: '600'
    }
  });
;
  const validateForm = () => {;
  const newErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  };
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(email.trim(), password)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor={colors.subtext}
          selectionColor={colors.primary}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={colors.subtext}
            selectionColor={colors.primary}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)} accessibilityRole="button"  
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color={colors.subtext} 
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
       accessibilityRole="button"  >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}
