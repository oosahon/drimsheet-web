import * as stories from '@/shared/components/status-badge/status-badge.stories';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const { Success, Info, Warning, Error, Neutral, Primary, WithoutDot } =
  composeStories(stories);

describe('StatusBadge', () => {
  it('renders correctly with label text', () => {
    render(<Success />);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders default neutral variant with a dot indicator', () => {
    render(<Neutral />);
    const badge = screen.getByText('Neutral');

    expect(badge).toHaveClass(
      'bg-neutral/10',
      'text-neutral',
      'border-neutral/20'
    );

    const dot = screen.getByTestId('status-badge-dot');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('h-1.5', 'w-1.5', 'rounded-full', 'bg-current');
  });

  it('renders all variants with correct classes', () => {
    const variants = [
      {
        Component: Success,
        name: 'Success',
        bg: 'bg-success/10',
        text: 'text-success',
        border: 'border-success/20',
      },
      {
        Component: Info,
        name: 'Info',
        bg: 'bg-info/10',
        text: 'text-info',
        border: 'border-info/20',
      },
      {
        Component: Warning,
        name: 'Warning',
        bg: 'bg-warning/10',
        text: 'text-warning',
        border: 'border-warning/20',
      },
      {
        Component: Error,
        name: 'Error',
        bg: 'bg-error/10',
        text: 'text-error',
        border: 'border-error/20',
      },
      {
        Component: Neutral,
        name: 'Neutral',
        bg: 'bg-neutral/10',
        text: 'text-neutral',
        border: 'border-neutral/20',
      },
      {
        Component: Primary,
        name: 'Primary',
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/20',
      },
    ] as const;

    for (const { Component, name, bg, text, border } of variants) {
      const { rerender } = render(<Component />);
      const badge = screen.getByText(name);
      expect(badge).toHaveClass(bg, text, border);
      rerender(<></>); // clean up between iterations
    }
  });

  it('does not render dot when showDot is false', () => {
    render(<WithoutDot />);
    expect(screen.queryByTestId('status-badge-dot')).not.toBeInTheDocument();
  });

  it('merges custom className prop correctly', () => {
    render(<Neutral className="custom-status-class" />);
    const badge = screen.getByText('Neutral');
    expect(badge).toHaveClass('custom-status-class');
  });
});
