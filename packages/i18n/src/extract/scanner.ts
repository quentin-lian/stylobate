import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const T_CALL_REGEX = /\bt\(\s*['"`]([^'"`]+)['"`]/g;

export interface ScanResult {
  keys: Map<string, Set<string>>;
}

export function scanDirectory(dir: string): ScanResult {
  const keys = new Map<string, Set<string>>();
  const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.vue']);

  function walk(currentDir: string) {
    const entries = readdirSync(currentDir);
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue;
        walk(fullPath);
      } else if (extensions.has(extname(entry))) {
        scanFile(fullPath);
      }
    }
  }

  function scanFile(filePath: string) {
    const content = readFileSync(filePath, 'utf-8');
    let match: RegExpExecArray | null;
    const regex = new RegExp(T_CALL_REGEX.source, 'g');

    while ((match = regex.exec(content)) !== null) {
      const raw = match[1]!;
      const colonIdx = raw.indexOf(':');
      let ns: string;
      let key: string;

      if (colonIdx > 0) {
        ns = raw.slice(0, colonIdx);
        key = raw.slice(colonIdx + 1);
      } else {
        ns = 'common';
        key = raw;
      }

      if (!keys.has(ns)) {
        keys.set(ns, new Set());
      }
      keys.get(ns)!.add(key);
    }
  }

  walk(dir);
  return { keys };
}
