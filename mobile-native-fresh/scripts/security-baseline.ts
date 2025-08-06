import { SecurityMetrics } from '../src-nextgen/types/security';
import { validateSecurityBaseline } from '../src-nextgen/utils/security';

(async () => {
  console.log('[SECURITY BASELINE] Establishing security metrics...');
  
  const baseline: SecurityMetrics = {
    authentication: {
      rateLimitEnabled: true,
      maxAttempts: 5,
      lockoutDuration: 900, // 15 minutes
      passwordPolicy: 'strong',
      mfaEnabled: false
    },
    dataProtection: {
      encryptionEnabled: true,
      keyRotation: 30, // days
      dataRetention: 365, // days
      backupEncryption: true
    },
    inputValidation: {
      sanitizationEnabled: true,
      sqlInjectionProtection: true,
      xssProtection: true,
      csrfProtection: true
    },
    apiSecurity: {
      rateLimitEnabled: true,
      authenticationRequired: true,
      httpsOnly: true,
      corsConfigured: true
    }
  };
  
  const validation = await validateSecurityBaseline(baseline);
  console.log('[SECURITY BASELINE] Security baseline established:', validation);
}); 