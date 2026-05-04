import { RequestPasswordResetSuccess } from '@/auth/ui/components/reset-password-request-success';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('RequestPasswordResetSuccess', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it('renders successfully and shows the countdown initially', () => {
    render(
      <MemoryRouter>
        <RequestPasswordResetSuccess retry={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Didn't receive it\?/i)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /Retry in 30s/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toBeDisabled();
  });

  it('counts down the timer correctly', () => {
    render(
      <MemoryRouter>
        <RequestPasswordResetSuccess retry={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('button', { name: /Retry in 30s/i })
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(
      screen.getByRole('button', { name: /Retry in 29s/i })
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(15000);
    });

    expect(
      screen.getByRole('button', { name: /Retry in 14s/i })
    ).toBeInTheDocument();
  });

  it('enables the retry button when the countdown reaches 0', () => {
    render(
      <MemoryRouter>
        <RequestPasswordResetSuccess retry={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(30000);
    });

    const retryButton = screen.getByRole('button', { name: /^Retry$/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toBeEnabled();
  });

  it('calls the retry function and resets the timer when retry is clicked', () => {
    const handleRetry = vi.fn();

    render(
      <MemoryRouter>
        <RequestPasswordResetSuccess retry={handleRetry} loading={false} />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(30000);
    });

    const retryButton = screen.getByRole('button', { name: /^Retry$/i });
    expect(retryButton).toBeEnabled();

    act(() => {
      fireEvent.click(retryButton);
    });

    expect(handleRetry).toHaveBeenCalledTimes(1);

    // Timer is reset to 30
    const disabledButton = screen.getByRole('button', {
      name: /Retry in 30s/i,
    });
    expect(disabledButton).toBeInTheDocument();
    expect(disabledButton).toBeDisabled();
  });

  it('disables the retry button when loading is true', () => {
    render(
      <MemoryRouter>
        <RequestPasswordResetSuccess retry={vi.fn()} loading={true} />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(30000);
    });

    const retryButton = screen.getByRole('button', { name: /^Retry$/i });
    expect(retryButton).toBeDisabled();
  });
});
