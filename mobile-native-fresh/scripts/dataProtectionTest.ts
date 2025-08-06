import { testDataProtection } from '../utils/data-protection';

(async () => {
  const protectionResults = await testDataProtection();
  console.log('[DATA PROTECTION] Tests completed:', protectionResults.total);
  console.log('[DATA PROTECTION] Vulnerabilities found:', protectionResults.vulnerabilities);
  protectionResults.vulnerabilities.forEach(vuln => console.log(`[DATA PROTECTION] ${vuln.type}: ${vuln.description}`));
})(); 