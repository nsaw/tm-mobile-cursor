import { testApiSecurity } from '../utils/api-security';

(async () => {
  const apiSecurityResults = await testApiSecurity();
  console.log('[API SECURITY] Tests completed:', apiSecurityResults.total);
  console.log('[API SECURITY] Vulnerabilities found:', apiSecurityResults.vulnerabilities);
  apiSecurityResults.vulnerabilities.forEach(vuln => console.log(`[API SECURITY] ${vuln.type}: ${vuln.description}`));
})(); 