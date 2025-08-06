import { testInputValidation } from '../utils/input-validation';

(async () => {
  const validationResults = await testInputValidation();
  console.log('[INPUT VALIDATION] Tests completed:', validationResults.total);
  console.log('[INPUT VALIDATION] Vulnerabilities found:', validationResults.vulnerabilities);
  validationResults.vulnerabilities.forEach(vuln => console.log(`[INPUT VALIDATION] ${vuln.type}: ${vuln.description}`));
})(); 