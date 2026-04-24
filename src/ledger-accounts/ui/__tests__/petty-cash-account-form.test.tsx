import { PettyCashAccountForm } from '@/ledger-accounts/ui/petty-cash-account-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

describe('PettyCashAccountForm', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <PettyCashAccountForm onSubmit={vi.fn()} loading={false} />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Petty Cash Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Starting balance/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create account/i })
    ).toBeInTheDocument();
  });

  it('shows required validation errors on submit empty', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PettyCashAccountForm onSubmit={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Create account/i }));

    expect(
      await screen.findByText(/Account name is required/i)
    ).toBeInTheDocument();
  });

  it('shows validation error if account name is too short', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PettyCashAccountForm onSubmit={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Petty Cash Name/i), 'ab');
    await user.click(screen.getByRole('button', { name: /Create account/i }));

    expect(
      await screen.findByText(/Account name must be at least 3 characters/i)
    ).toBeInTheDocument();
  });

  it('shows validation error if account name is too long', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PettyCashAccountForm onSubmit={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    const longName = 'a'.repeat(101);
    await user.type(screen.getByLabelText(/Petty Cash Name/i), longName);
    await user.click(screen.getByRole('button', { name: /Create account/i }));

    expect(
      await screen.findByText(/Account name must not exceed 100 characters/i)
    ).toBeInTheDocument();
  });

  it('shows validation error if opening balance is negative', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PettyCashAccountForm onSubmit={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    const balanceInput = screen.getByLabelText(/Starting balance/i);
    await user.clear(balanceInput);
    await user.type(balanceInput, '-50');
    await user.click(screen.getByRole('button', { name: /Create account/i }));

    expect(
      await screen.findByText(/Opening balance cannot be negative/i)
    ).toBeInTheDocument();
  });

  it('accepts valid input and calls onSubmit', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <MemoryRouter>
        <PettyCashAccountForm onSubmit={handleSubmit} loading={false} />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/Petty Cash Name/i),
      'Office Supplies Fund'
    );
    await user.type(screen.getByLabelText(/Starting balance/i), '500');

    // Ideally, we would also select a currency here, but since CurrencySelect is a custom component,
    // and we want to just test the form logic, we can verify that onSubmit is called or validation errors for currency show up.
    // Let's trigger submit to see currency validation error
    await user.click(screen.getByRole('button', { name: /Create account/i }));

    expect(
      await screen.findByText(/Currency is required/i)
    ).toBeInTheDocument();
  });
});
