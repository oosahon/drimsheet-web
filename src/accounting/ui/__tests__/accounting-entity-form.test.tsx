import { AccountingEntityCreationForm } from '@/accounting/ui/accounting-entity-creation-form';
import { accountingEntityCreationFormValidation } from '@/accounting/ui/validations/accounting-entity.validations';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
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

describe('AccountingEntityCreationForm', () => {
  const setup = () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<AccountingEntityCreationForm onSubmit={onSubmit} />);
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
      screen.getByText('What currency should your reports use?')
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
      fiscalYearStart: expect.any(Date),
      fiscalYearEnd: expect.any(Date),
      appUsageMode: 'non_power_user',
      accountingStandardCode: 'IFRS',
    });
  });

  it('can navigate back to previous steps', async () => {
    const { user } = setup();

    // Go to step 2
    await user.click(screen.getByRole('button', { name: /Next/i }));
    expect(
      screen.getByText('What currency should your reports use?')
    ).toBeInTheDocument();

    // Go back to step 1
    await user.click(screen.getByRole('button', { name: /Back/i }));

    // Verify Step 1 is shown
    expect(screen.getByText('Where do you reside?')).toBeInTheDocument();
    expect(
      screen.queryByText('What currency should your reports use?')
    ).not.toBeInTheDocument();
  });

  it('renders loading state on the submit button when loading prop is true', async () => {
    render(<AccountingEntityCreationForm onSubmit={vi.fn()} loading={true} />);
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

describe('AccountingEntityCreationForm Validation', () => {
  it('validates that fiscalYearStart is not more than 2 years in the past', async () => {
    const validData = {
      entityType: 'individual',
      countryCode: 'NG',
      functionalCurrency: 'NGN',
      reportingCurrency: 'NGN',
      fiscalYearStart: dayjs().subtract(1, 'year').toDate(),
      fiscalYearEnd: dayjs().toDate(),
    };

    await expect(
      accountingEntityCreationFormValidation.validate(validData)
    ).resolves.toBeTruthy();

    const invalidData = {
      ...validData,
      fiscalYearStart: dayjs().subtract(3, 'years').toDate(),
      fiscalYearEnd: dayjs().subtract(2, 'years').toDate(),
    };

    await expect(
      accountingEntityCreationFormValidation.validate(invalidData)
    ).rejects.toThrow(
      'Start date must not be less than two years from the current date'
    );
  });

  it('validates that the duration between start and end date is not more than 23 months', async () => {
    const invalidData = {
      entityType: 'individual',
      countryCode: 'NG',
      functionalCurrency: 'NGN',
      reportingCurrency: 'NGN',
      fiscalYearStart: dayjs().subtract(1, 'year').toDate(),
      fiscalYearEnd: dayjs().add(2, 'years').toDate(), // Duration > 23 months
    };

    await expect(
      accountingEntityCreationFormValidation.validate(invalidData)
    ).rejects.toThrow(
      'The difference between the start and end dates MUST not be more than 23months or less than one month.'
    );
  });
});
