import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../types/theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  form: {
    marginBottom: 32,
  },
  pinContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  biometricContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  biometricButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
  },
  lockoutContainer: {
    marginBottom: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.error + '10',
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  lockoutText: {
    fontSize: 14,
    textAlign: 'center',
  },
  warningContainer: {
    marginBottom: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.warning + '10',
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPINButton: {
    flex: 1,
    alignItems: 'flex-start',
  },
  forgotPINText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  signOutButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  signOutText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  securityNotice: {
    alignItems: 'center',
  },
  securityText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export const styles = createStyles({
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#6C757D',
  primary: '#007AFF',
  error: '#DC3545',
  warning: '#FFC107',
  border: '#DEE2E6',
} as ThemeColors); 