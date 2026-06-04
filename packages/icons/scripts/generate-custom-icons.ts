import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, '..');
const assetsDir = join(pkgRoot, 'assets/custom');
const reactOutDir = join(pkgRoot, 'src/react/custom');
const vueOutDir = join(pkgRoot, 'src/vue/custom');

function toPascalCase(str: string): string {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/\.svg$/, '')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

function extractSvgContent(svg: string): { paths: string; viewBox: string } {
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch?.[1] ?? '0 0 24 24';
  const inner = svg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();
  return { paths: inner, viewBox };
}

function generateReactComponent(name: string, svg: string): string {
  const { paths, viewBox } = extractSvgContent(svg);
  return `import type { SVGProps } from 'react';

export function ${name}(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? 24}
      height={props.height ?? 24}
      viewBox="${viewBox}"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      ${paths}
    </svg>
  );
}
`;
}

function generateVueComponent(name: string, svg: string): string {
  const { paths, viewBox } = extractSvgContent(svg);
  const pathElements =
    paths
      .match(/<(\w+)\s[^>]+\/>/g)
      ?.map((tag) => {
        const tagName = tag.match(/^<(\w+)/)?.[1] ?? 'path';
        const attrs: Record<string, string> = {};
        for (const [, key, val] of tag.matchAll(/(\w[\w-]*)="([^"]+)"/g)) {
          attrs[key!] = val!;
        }
        return `      h('${tagName}', ${JSON.stringify(attrs)})`;
      })
      .join(',\n') ?? '';

  return `import { defineComponent, h } from 'vue';

export const ${name} = defineComponent({
  name: '${name}',
  props: {
    size: { type: [Number, String], default: 24 },
    color: { type: String, default: 'currentColor' },
    strokeWidth: { type: [Number, String], default: 2 },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: props.size,
          height: props.size,
          viewBox: '${viewBox}',
          fill: 'none',
          stroke: props.color,
          'stroke-width': props.strokeWidth,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          ...attrs,
        },
        [
${pathElements}
        ],
      );
  },
});
`;
}

function main() {
  const svgFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.svg'));
  const names: string[] = [];

  for (const file of svgFiles) {
    const svg = readFileSync(join(assetsDir, file), 'utf-8');
    const name = toPascalCase(basename(file, '.svg'));
    names.push(name);

    writeFileSync(join(reactOutDir, `${name}.tsx`), generateReactComponent(name, svg));
    writeFileSync(join(vueOutDir, `${name}.ts`), generateVueComponent(name, svg));
  }

  const reactIndex = names.map((n) => `export { ${n} } from './${n}.js';`).join('\n') + '\n';
  const vueIndex = names.map((n) => `export { ${n} } from './${n}.js';`).join('\n') + '\n';

  writeFileSync(join(reactOutDir, 'index.ts'), reactIndex);
  writeFileSync(join(vueOutDir, 'index.ts'), vueIndex);

  console.log(`Generated ${names.length} custom icon(s): ${names.join(', ')}`);
}

main();
