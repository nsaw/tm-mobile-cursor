import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AutoRoleView } from '../../components/AutoRoleView';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUp = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Sign up logic would go here
    console.log('Sign up:', formData.email);
  };

  return (
    <AutoRoleView componentRole="screen" style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Create Account
      </Text>
      
      <TextInput
        style={[styles.input, { 
          color: theme.colors.text, 
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface 
        }]}
        placeholder="Email"
        placeholderTextColor={theme.colors.textSecondary}
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={[styles.input, { 
          color: theme.colors.text, 
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface 
        }]}
        placeholder="Password"
        placeholderTextColor={theme.colors.textSecondary}
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
      />
      
      <TextInput
        style={[styles.input, { 
          color: theme.colors.text, 
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface 
        }]}
        placeholder="Confirm Password"
        placeholderTextColor={theme.colors.textSecondary}
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleSignUp}
       accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUp; 