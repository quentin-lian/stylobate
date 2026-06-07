import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

interface ComponentEntry {
  name: string;
  files: string[];
  dependencies: string[];
  registryDependencies: string[];
  utilities: string[];
  styles: string[];
}

interface Registry {
  components: Record<string, ComponentEntry>;
}

let cachedRegistryPath: string | undefined;

function findRegistryPath(): string {
  if (cachedRegistryPath) return cachedRegistryPath;
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(__dirname, '../../ui-react/registry.json'),
    join(__dirname, '../../../packages/ui-react/registry.json'),
  ];
  for (const c of candidates) {
    try {
      readFileSync(c, 'utf-8');
      cachedRegistryPath = c;
      return c;
    } catch {
      continue;
    }
  }
  throw new Error(
    'Cannot find @stylobate/ui-react registry.json. Make sure @stylobate/ui-react is installed.',
  );
}

export function getRegistryPath(): string {
  return findRegistryPath();
}

export function loadRegistry(): Registry {
  const content = readFileSync(getRegistryPath(), 'utf-8');
  return JSON.parse(content) as Registry;
}

export function getComponent(name: string): ComponentEntry | undefined {
  const registry = loadRegistry();
  return registry.components[name];
}

export function listComponents(): string[] {
  const registry = loadRegistry();
  return Object.keys(registry.components);
}

export function getSourceDir(): string {
  const registryPath = getRegistryPath();
  return join(dirname(registryPath), 'src');
}
