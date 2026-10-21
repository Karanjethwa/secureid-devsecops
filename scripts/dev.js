import { spawn } from 'child_process';
import path from 'path';

console.log('=======================================================');
console.log('  SecureID — Starting Full-Stack DevSecOps Environment');
console.log('=======================================================');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Spawn Backend
const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(process.cwd(), 'backend'),
  stdio: 'inherit',
  shell: true,
});

// 2. Spawn Frontend
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(process.cwd(), 'frontend'),
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n[INFO] Terminating dev servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
