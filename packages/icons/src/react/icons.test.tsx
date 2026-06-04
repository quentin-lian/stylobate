import { render } from '@testing-library/react';
import { ArrowRight, Check, Search } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { BrandLogo } from './custom/BrandLogo.js';

describe('React Lucide re-exports', () => {
  it('renders ArrowRight icon as SVG', () => {
    const { container } = render(<ArrowRight />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
  });

  it('forwards className prop', () => {
    const { container } = render(<Check className="my-icon" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('my-icon');
  });

  it('forwards size prop', () => {
    const { container } = render(<Search size={32} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });
});

describe('React custom icons', () => {
  it('renders BrandLogo as SVG', () => {
    const { container } = render(<BrandLogo />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.querySelector('polygon')).toBeTruthy();
  });

  it('forwards props to BrandLogo', () => {
    const { container } = render(<BrandLogo width={48} height={48} className="brand" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('48');
    expect(svg?.getAttribute('class')).toBe('brand');
  });
});
