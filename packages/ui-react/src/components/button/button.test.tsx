import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Button, ButtonGroup, IconButton } from './button.js';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeTruthy();
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const btn = container.querySelector('button')!;
    expect(btn.className).toContain('bg-destructive');
  });

  it('applies size classes', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const btn = container.querySelector('button')!;
    expect(btn.className).toContain('h-11');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Press</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders as child element with asChild', () => {
    const { container } = render(
      <Button asChild>
        <a href="/link">Link</a>
      </Button>,
    );
    const anchor = container.querySelector('a');
    expect(anchor).toBeTruthy();
    expect(anchor?.getAttribute('href')).toBe('/link');
    expect(container.querySelector('button')).toBeNull();
  });

  it('merges custom className', () => {
    const { container } = render(<Button className="custom-class">Styled</Button>);
    expect(container.querySelector('button')!.className).toContain('custom-class');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('IconButton', () => {
  it('renders with aria-label', () => {
    render(<IconButton icon={<span>X</span>} label="Close" />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<IconButton icon={<span>+</span>} label="Add item" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('ButtonGroup', () => {
  it('renders children in a group', () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'A' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'B' })).toBeTruthy();
  });
});
