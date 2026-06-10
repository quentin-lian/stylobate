#!/usr/bin/env node
import { resolve } from 'node:path';

import { scanDirectory } from './scanner.js';
import { writeLocaleFiles } from './writer.js';

function parseArgs(args: string[]): { src: string; out: string; locales: string[] } {
  let src = './src';
  let out = './locales';
  let locales = ['en'];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--src' && args[i + 1]) {
      src = args[++i]!;
    } else if (arg === '--out' && args[i + 1]) {
      out = args[++i]!;
    } else if (arg === '--locales' && args[i + 1]) {
      locales = args[++i]!.split(',');
    }
  }

  return { src: resolve(src), out: resolve(out), locales };
}

const { src, out, locales } = parseArgs(process.argv.slice(2));

const result = scanDirectory(src);
writeLocaleFiles({ outDir: out, locales, scanResult: result });

const totalKeys = [...result.keys.values()].reduce((sum, s) => sum + s.size, 0);
console.log(`Extracted ${totalKeys} keys from ${result.keys.size} namespace(s) → ${out}`);
