import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, '..');

async function getIconNames(): Promise<string[]> {
  const mod = await import('lucide-react');
  return Object.keys(mod).filter(
    (k) => k !== 'default' && k !== 'createLucideIcon' && k !== 'icons' && /^[A-Z]/.test(k),
  );
}

async function main() {
  const icons = await getIconNames();
  icons.sort();

  const reactLines = [
    '// Auto-generated — do not edit. Run `pnpm generate` to regenerate.',
    '',
    ...icons.map((name) => `export { ${name} } from 'lucide-react';`),
    '',
    '// Custom icons',
    "export { BrandLogo } from './custom/index.js';",
    '',
  ];

  const vueLines = [
    '// Auto-generated — do not edit. Run `pnpm generate` to regenerate.',
    '',
    ...icons.map((name) => `export { ${name} } from 'lucide-vue-next';`),
    '',
    '// Custom icons',
    "export { BrandLogo } from './custom/index.js';",
    '',
  ];

  writeFileSync(join(pkgRoot, 'src/react/index.ts'), reactLines.join('\n'));
  writeFileSync(join(pkgRoot, 'src/vue/index.ts'), vueLines.join('\n'));

  console.log(`Generated ${icons.length} Lucide re-exports for React and Vue.`);
}

main();
