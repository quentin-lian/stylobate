import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { scanDirectory } from './scanner.js';
import { writeLocaleFiles } from './writer.js';

const tmpDir = join(import.meta.dirname, '__test_tmp__');
const srcDir = join(tmpDir, 'src');
const outDir = join(tmpDir, 'locales');

beforeEach(() => {
  mkdirSync(srcDir, { recursive: true });
});

afterEach(() => {
  if (existsSync(tmpDir)) {
    rmSync(tmpDir, { recursive: true });
  }
});

describe('scanner', () => {
  it('extracts t() calls from source files', () => {
    writeFileSync(
      join(srcDir, 'app.tsx'),
      `
        const { t } = useTranslation();
        t('hello');
        t('welcome');
        t('auth:login');
      `,
    );

    const result = scanDirectory(srcDir);

    expect(result.keys.get('common')).toEqual(new Set(['hello', 'welcome']));
    expect(result.keys.get('auth')).toEqual(new Set(['login']));
  });

  it('handles double and backtick quotes', () => {
    writeFileSync(
      join(srcDir, 'comp.ts'),
      `
        t("double_quoted");
        t(\`backtick_quoted\`);
      `,
    );

    const result = scanDirectory(srcDir);

    expect(result.keys.get('common')).toEqual(new Set(['double_quoted', 'backtick_quoted']));
  });

  it('skips node_modules and dist', () => {
    mkdirSync(join(srcDir, 'node_modules'), { recursive: true });
    writeFileSync(join(srcDir, 'node_modules', 'lib.ts'), `t('should_skip');`);
    writeFileSync(join(srcDir, 'real.ts'), `t('found');`);

    const result = scanDirectory(srcDir);

    expect(result.keys.get('common')).toEqual(new Set(['found']));
  });

  it('deduplicates keys', () => {
    writeFileSync(join(srcDir, 'a.ts'), `t('dup'); t('dup'); t('dup');`);

    const result = scanDirectory(srcDir);

    expect(result.keys.get('common')!.size).toBe(1);
  });
});

describe('writer', () => {
  it('writes locale JSON files for each namespace and locale', () => {
    const scanResult = {
      keys: new Map([
        ['common', new Set(['hello', 'welcome'])],
        ['auth', new Set(['login'])],
      ]),
    };

    writeLocaleFiles({ outDir, locales: ['zh-CN', 'en'], scanResult });

    const zhCommon = JSON.parse(readFileSync(join(outDir, 'zh-CN', 'common.json'), 'utf-8'));
    const enAuth = JSON.parse(readFileSync(join(outDir, 'en', 'auth.json'), 'utf-8'));

    expect(zhCommon).toEqual({ hello: '', welcome: '' });
    expect(enAuth).toEqual({ login: '' });
  });

  it('preserves existing translations', () => {
    mkdirSync(join(outDir, 'en'), { recursive: true });
    writeFileSync(
      join(outDir, 'en', 'common.json'),
      JSON.stringify({ hello: 'Hello', old_key: 'Old' }),
    );

    const scanResult = {
      keys: new Map([['common', new Set(['hello', 'new_key'])]]),
    };

    writeLocaleFiles({ outDir, locales: ['en'], scanResult });

    const result = JSON.parse(readFileSync(join(outDir, 'en', 'common.json'), 'utf-8'));

    expect(result.hello).toBe('Hello');
    expect(result.new_key).toBe('');
    expect(result.old_key).toBe('Old');
  });

  it('sorts keys alphabetically', () => {
    const scanResult = {
      keys: new Map([['common', new Set(['zebra', 'alpha', 'middle'])]]),
    };

    writeLocaleFiles({ outDir, locales: ['en'], scanResult });

    const content = readFileSync(join(outDir, 'en', 'common.json'), 'utf-8');
    const keys = Object.keys(JSON.parse(content));

    expect(keys).toEqual(['alpha', 'middle', 'zebra']);
  });
});
