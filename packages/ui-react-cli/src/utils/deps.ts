import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) return 'bun';
  return 'npm';
}

export function installDeps(deps: string[], cwd: string): void {
  if (deps.length === 0) return;
  const pm = detectPackageManager(cwd);
  const args = pm === 'npm' ? ['install', ...deps] : ['add', ...deps];
  execFileSync(pm, args, { cwd, stdio: 'inherit' });
}

export function installDevDeps(deps: string[], cwd: string): void {
  if (deps.length === 0) return;
  const pm = detectPackageManager(cwd);
  const flag = pm === 'npm' ? '--save-dev' : '-D';
  const args = pm === 'npm' ? ['install', flag, ...deps] : ['add', flag, ...deps];
  execFileSync(pm, args, { cwd, stdio: 'inherit' });
}
