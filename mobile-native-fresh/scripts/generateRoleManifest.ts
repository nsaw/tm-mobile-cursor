import { scanUIRoles } from '../src/utils/roleScanner';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Ensure validations directory exists
const validationsDir = join(__dirname, '..', 'validations');
try {
  mkdirSync(validationsDir, { recursive: true });
} catch (error) {
  // Directory might already exist
}

// Generate manifest
const manifest = scanUIRoles();

// Write manifest to file
const manifestPath = join(validationsDir, 'role-snapshot-manifest.json');
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('[✔] Role snapshot manifest written.');
console.log(`[📊] Manifest contains ${manifest.totalComponents} components with ${manifest.totalRoles} total roles`);
console.log(`[📁] File location: ${manifestPath}`);
console.log(`[📈] Role coverage: ${Object.keys(manifest.roleCoverage).length} unique roles detected`); 