import { DefaultErrorBoundary } from '@/_app/containers/error-boundary/error-boundary';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

function ExplodingChild() {
  throw new Error('boom');
}

describe('DefaultErrorBoundary', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders translated fallback copy after the loader delay', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(
      <DefaultErrorBoundary>
        <ExplodingChild />
      </DefaultErrorBoundary>
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(250);
    });

    expect(
      screen.getByRole('heading', { name: 'Something went wrong' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'An unexpected error occurred. Our technical team has been notified.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Try Again' })
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
    vi.useRealTimers();
  });
});
