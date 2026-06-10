import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import type { ScanResult } from './scanner.js';

export interface WriteOptions {
  outDir: string;
  locales: string[];
  scanResult: ScanResult;
}

export function writeLocaleFiles(options: WriteOptions): void {
  const { outDir, locales, scanResult } = options;

  for (const locale of locales) {
    for (const [ns, keys] of scanResult.keys.entries()) {
      const filePath = join(outDir, locale, `${ns}.json`);
      const dir = dirname(filePath);

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      let existing: Record<string, string> = {};
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf-8');
        existing = JSON.parse(content) as Record<string, string>;
      }

      for (const key of [...keys].sort()) {
        if (!(key in existing)) {
          existing[key] = '';
        }
      }

      const sorted = Object.fromEntries(
        Object.entries(existing).sort(([a], [b]) => a.localeCompare(b)),
      );

      writeFileSync(filePath, JSON.stringify(sorted, null, 2) + '\n');
    }
  }
}
