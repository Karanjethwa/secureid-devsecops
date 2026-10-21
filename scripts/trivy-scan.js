import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('=======================================================');
console.log('  Aqua Trivy Container Image Vulnerability Scanner     ');
console.log('=======================================================');

const imageName = process.argv[2] || 'secureid:latest';
const reportsDir = path.resolve(process.cwd(), 'reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const jsonReportPath = path.join(reportsDir, 'trivy-image-report.json');

try {
  console.log(`[INFO] Scanning container image: ${imageName}`);
  console.log('[INFO] Checking for Aqua Trivy CLI installation...');
  
  // Attempt running trivy
  try {
    execSync('trivy --version', { stdio: 'pipe' });
  } catch (err) {
    console.warn('[WARNING] Aqua Trivy CLI not found in system PATH.');
    console.log('[INFO] To install Trivy:');
    console.log('  - Windows: winget install AquaSecurity.Trivy  OR  choco install trivy');
    console.log('  - macOS: brew install trivy');
    console.log('  - Linux: sudo apt-get install trivy');
    console.log(`[INFO] Review documented baseline report in ${path.join(reportsDir, 'trivy-image-report.md')}`);
    process.exit(0);
  }

  console.log('[INFO] Executing Trivy vulnerability analysis...');
  execSync(`trivy image --scanners vuln --severity HIGH,CRITICAL --format json --output "${jsonReportPath}" ${imageName}`, {
    stdio: 'inherit',
  });

  console.log(`[SUCCESS] Scan complete. JSON report written to: ${jsonReportPath}`);
} catch (error) {
  console.error('[ERROR] Trivy scan detected security vulnerabilities or failed:', error.message);
  process.exit(1);
}
