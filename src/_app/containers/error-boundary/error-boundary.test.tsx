import { DefaultErrorBoundary } from '@/_app/containers/error-boundary/error-boundary';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { handleApiError } = vi.hoisted(() => ({
  handleApiError: vi.fn(),
}));

vi.mock('@/shared/hooks/use-api-error-handler', () => ({
  useApiErrorHandler: () => handleApiError,
}));

function ExplodingChild(): never {
  throw new Error('boom');
}

function makeAxiosError() {
  return Object.assign(new Error('Core request failed'), {
    isAxiosError: true,
    response: { status: 500 },
  });
}

describe('DefaultErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders translated fallback copy after the loader delay', async () => {
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
  });

  it('resets the boundary through the localized fallback action', async () => {
    vi.useRealTimers();
    let shouldThrow = true;
    const user = userEvent.setup();

    function RecoverableChild() {
      if (shouldThrow) throw new Error('recoverable');
      return <p>Application recovered</p>;
    }

    render(
      <DefaultErrorBoundary>
        <RecoverableChild />
      </DefaultErrorBoundary>
    );

    await screen.findByRole('button', { name: 'Try Again' });
    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(screen.getByText('Application recovered')).toBeInTheDocument();
  });

  it('preserves Axios UI handling without asking the hook to report again', () => {
    const axiosError = makeAxiosError();

    function AxiosExplodingChild(): never {
      throw axiosError;
    }

    render(
      <DefaultErrorBoundary>
        <AxiosExplodingChild />
      </DefaultErrorBoundary>
    );

    expect(handleApiError).toHaveBeenCalledWith(axiosError, { report: false });
  });

  it('does not manually route a non-Axios render failure a second time', () => {
    render(
      <DefaultErrorBoundary>
        <ExplodingChild />
      </DefaultErrorBoundary>
    );

    expect(handleApiError).not.toHaveBeenCalled();
  });
});
