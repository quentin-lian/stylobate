import { render } from '@testing-library/vue';
import { ArrowRight, Check, Search } from 'lucide-vue-next';
import { describe, expect, it } from 'vitest';

import { BrandLogo } from './custom/BrandLogo.js';

describe('Vue Lucide re-exports', () => {
  it('renders ArrowRight icon as SVG', () => {
    const { container } = render(ArrowRight);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
  });

  it('forwards class attribute', () => {
    const { container } = render(Check, { attrs: { class: 'my-icon' } });
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('my-icon');
  });

  it('forwards size prop', () => {
    const { container } = render(Search, { props: { size: 32 } });
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });
});

describe('Vue custom icons', () => {
  it('renders BrandLogo as SVG', () => {
    const { container } = render(BrandLogo);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.querySelector('polygon')).toBeTruthy();
  });

  it('forwards props to BrandLogo', () => {
    const { container } = render(BrandLogo, { props: { size: 48, color: 'red' } });
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('48');
    expect(svg?.getAttribute('stroke')).toBe('red');
  });
});
