import { StatusBadge } from '@/shared/ui/components/status-badge';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('StatusBadge', () => {
  it('renders correctly with children text', () => {
    render(<StatusBadge>Active</StatusBadge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders default neutral variant with a dot indicator', () => {
    render(<StatusBadge>Neutral Status</StatusBadge>);
    const badge = screen.getByText('Neutral Status');

    // Default variant is neutral
    expect(badge).toHaveClass(
      'bg-neutral/10',
      'text-neutral',
      'border-neutral/20'
    );

    // By default, showDot is true
    const dot = screen.getByTestId('status-badge-dot');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('h-1.5', 'w-1.5', 'rounded-full', 'bg-current');
  });

  it('renders all variants with correct classes', () => {
    const variants = [
      {
        name: 'success',
        bg: 'bg-success/10',
        text: 'text-success',
        border: 'border-success/20',
      },
      {
        name: 'info',
        bg: 'bg-info/10',
        text: 'text-info',
        border: 'border-info/20',
      },
      {
        name: 'warning',
        bg: 'bg-warning/10',
        text: 'text-warning',
        border: 'border-warning/20',
      },
      {
        name: 'error',
        bg: 'bg-error/10',
        text: 'text-error',
        border: 'border-error/20',
      },
      {
        name: 'neutral',
        bg: 'bg-neutral/10',
        text: 'text-neutral',
        border: 'border-neutral/20',
      },
      {
        name: 'primary',
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/20',
      },
    ] as const;

    for (const variant of variants) {
      const { rerender } = render(
        <StatusBadge variant={variant.name}>{variant.name}</StatusBadge>
      );
      const badge = screen.getByText(variant.name);
      expect(badge).toHaveClass(variant.bg, variant.text, variant.border);
      rerender(<></>); // clean up between iterations
    }
  });

  it('does not render dot when showDot is false', () => {
    render(<StatusBadge showDot={false}>No Dot</StatusBadge>);
    expect(screen.queryByTestId('status-badge-dot')).not.toBeInTheDocument();
  });

  it('merges custom className prop correctly', () => {
    render(
      <StatusBadge className="custom-status-class">Custom Class</StatusBadge>
    );
    const badge = screen.getByText('Custom Class');
    expect(badge).toHaveClass('custom-status-class');
  });
});
