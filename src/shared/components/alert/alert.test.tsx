import * as stories from '@/shared/components/alert/alert.stories';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert, AlertDescription, AlertTitle } from './alert';

const { Default, Destructive, Success, Info, Warning } =
  composeStories(stories);

describe('Alert', () => {
  it('renders default variant correctly', () => {
    render(<Default />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-card', 'text-card-foreground');
    expect(screen.getByText('Heads up!')).toBeInTheDocument();
  });

  it('renders destructive variant correctly', () => {
    render(<Destructive />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-card', 'text-destructive');
  });

  it('renders success variant correctly', () => {
    render(<Success />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-card', 'text-success');
  });

  it('renders info variant correctly', () => {
    render(<Info />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-card', 'text-info');
  });

  it('renders warning variant correctly', () => {
    render(<Warning />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-card', 'text-warning');
  });

  it('renders AlertTitle and AlertDescription', () => {
    render(
      <Alert>
        <AlertTitle>Custom Title</AlertTitle>
        <AlertDescription>Custom Description</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
  });
});
