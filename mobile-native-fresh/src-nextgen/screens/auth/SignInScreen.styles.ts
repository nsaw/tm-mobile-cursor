import { StyleSheet } from 'react-native';

import { ThemeColors } from '../../types/theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 400,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
    marginTop: 4,
  },
  eyeButton: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
  },
  eyeButtonText: {
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  form: {
    marginBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    height: 48,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  lockoutContainer: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error + '30',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 12,
  },
  lockoutText: {
    fontSize: 14,
    textAlign: 'center',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  signInButton: {
    borderRadius: 8,
    height: 48,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export const styles = createStyles({
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#6C757D',
  primary: '#007AFF',
  error: '#DC3545',
  border: '#DEE2E6',
} as ThemeColors); 