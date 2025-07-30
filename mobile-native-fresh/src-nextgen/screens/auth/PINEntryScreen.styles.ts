import { StyleSheet } from 'react-native';

import { ThemeColors } from '../../types/theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  actionsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  biometricButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    maxWidth: 280,
    width: '100%',
  },
  biometricContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
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
    marginTop: 8,
    textAlign: 'center',
  },
  forgotPINButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  forgotPINText: {
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
  lockoutContainer: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error + '30',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
  },
  lockoutText: {
    fontSize: 14,
    textAlign: 'center',
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  securityNotice: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  securityText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  signOutText: {
    fontSize: 14,
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
  warningContainer: {
    backgroundColor: (colors.warning || '#FFA500') + '10',
    borderColor: (colors.warning || '#FFA500') + '30',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
  },
  warningText: {
    fontSize: 14,
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
  warning: '#FFA500',
} as ThemeColors); 