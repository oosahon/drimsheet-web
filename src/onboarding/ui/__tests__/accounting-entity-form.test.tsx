import { AccountingEntityOnboardingForm } from '@/onboarding/ui/accounting-entity-form';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

describe('AccountingEntityOnboardingForm', () => {
  const setup = () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<AccountingEntityOnboardingForm onSubmit={onSubmit} />);
    return { onSubmit, user };
  };

  it('renders step 1 by default', () => {
    setup();
    expect(screen.getByText('Where do you reside?')).toBeInTheDocument();
  });

  it('can navigate through the steps and submit default values', async () => {
    const { onSubmit, user } = setup();

    // Step 1
    const nextBtn1 = screen.getByRole('button', { name: /Next/i });
    expect(nextBtn1).toBeEnabled();
    await user.click(nextBtn1);

    // Step 2
    expect(
      screen.getByText('What currency do you primarily transact in?')
    ).toBeInTheDocument();
    const nextBtn2 = screen.getByRole('button', { name: /Next/i });
    await user.click(nextBtn2);

    // Step 3
    const submitBtn = screen.getByRole('button', { name: /Complete setup/i });
    expect(submitBtn).toBeInTheDocument();

    // Submit
    await user.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      name: '',
      entityType: 'individual',
      countryCode: 'NG',
      functionalCurrency: 'NGN',
      reportingCurrency: 'NGN',
      fiscalYearStart: { month: 1, day: 1 },
      appUsageMode: 'non_power_user',
    });
  });

  it('can navigate back to previous steps', async () => {
    const { user } = setup();

    // Go to step 2
    await user.click(screen.getByRole('button', { name: /Next/i }));
    expect(
      screen.getByText('What currency do you primarily transact in?')
    ).toBeInTheDocument();

    // Go back to step 1
    await user.click(screen.getByRole('button', { name: /Back/i }));

    // Verify Step 1 is shown
    expect(screen.getByText('Where do you reside?')).toBeInTheDocument();
    expect(
      screen.queryByText('What currency do you primarily transact in?')
    ).not.toBeInTheDocument();
  });

  it('renders loading state on the submit button when loading prop is true', async () => {
    render(
      <AccountingEntityOnboardingForm onSubmit={vi.fn()} loading={true} />
    );
    const user = userEvent.setup();

    // Navigate to step 3
    await user.click(screen.getByRole('button', { name: /Next/i }));
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Usually "loading" on Button adds a spinner or something, or disables it.
    // The button might still have the text or might be disabled. Let's just check if it's there.
    const submitBtn = screen.getByRole('button', { name: /Complete setup/i });
    // Assuming loading button is disabled
    expect(submitBtn).toBeDisabled();
  });
});
