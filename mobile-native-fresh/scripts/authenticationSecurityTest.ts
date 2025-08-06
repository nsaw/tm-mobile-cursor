import { testAuthenticationSecurity } from '../utils/auth-security';

(async () => {
  const securityResults = await testAuthenticationSecurity();
  console.log('[AUTH SECURITY] Tests completed:', securityResults.total);
  console.log('[AUTH SECURITY] Vulnerabilities found:', securityResults.vulnerabilities);
  securityResults.vulnerabilities.forEach(vuln => console.log(`[AUTH SECURITY] ${vuln.type}: ${vuln.description}`));
})(); 