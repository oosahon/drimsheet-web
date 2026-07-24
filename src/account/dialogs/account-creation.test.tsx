import type {
  AccountCreationFormProps,
  IAccountCreationFormValues,
} from '@/account/components/account-creation-form';
import { AccountCreationDialog } from '@/account/dialogs/account-creation';
import { ELedgerAccountBehavior } from '@/shared/lib/api/Api';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createPettyCashAccount: vi.fn(),
  handleApiError: vi.fn(),
  toastSuccess: vi.fn(),
  useAccountingEntity: vi.fn(),
  useCurrencies: vi.fn(),
}));

vi.mock('@/account/components/account-creation-form', () => ({
  AccountCreationForm: (props: AccountCreationFormProps) => {
    const values: IAccountCreationFormValues = {
      name: 'Office cash',
      accountType: ELedgerAccountBehavior.PettyCash,
      currencyCode: 'USD',
      createWithoutOpeningBalance: false,
      openingBalance: 100,
      openingDate: '2026-07-01',
      exchangeRate: 1500,
      isSubAccount: true,
    };

    return (
      <div data-testid="account-creation-form">
        <span>{props.accountingCurrencyCode}</span>
        <span>
          {props.accountTypes.map((option) => option.label).join(',')}
        </span>
        <button
          disabled={props.disabled}
          onClick={() => void props.onSubmit(values)}
          type="button"
        >
          Submit mocked form
        </button>
      </div>
    );
  },
}));

vi.mock('@/account/hooks/use-create-petty-cash-account', () => ({
  useCreatePettyCashAccount: () => ({
    mutateAsync: mocks.createPettyCashAccount,
    isPending: false,
  }),
}));

vi.mock('@/accounting/hooks/use-accounting-entity', () => ({
  useAccountingEntity: mocks.useAccountingEntity,
}));

vi.mock('@/shared/hooks/use-api-error-handler', () => ({
  useApiErrorHandler: () => mocks.handleApiError,
}));

vi.mock('@/shared/hooks/use-currencies', () => ({
  useCurrencies: mocks.useCurrencies,
}));

vi.mock('sonner', () => ({
  toast: {
    success: mocks.toastSuccess,
  },
}));

describe('AccountCreationDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAccountingEntity.mockReturnValue({
      data: { functionalCurrencyCode: 'NGN' },
      isPending: false,
    });
    mocks.useCurrencies.mockReturnValue({
      data: [
        {
          code: 'NGN',
          name: 'Nigerian Naira',
          symbol: '₦',
          minorUnit: 2,
        },
      ],
      isPending: false,
    });
    mocks.createPettyCashAccount.mockResolvedValue(undefined);
  });

  it('renders the form with the active entity currency and petty-cash type', () => {
    render(<AccountCreationDialog open onOpenChange={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: 'Create petty cash account' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('account-creation-form')).toHaveTextContent(
      'NGN'
    );
    expect(screen.getByTestId('account-creation-form')).toHaveTextContent(
      'Petty cash'
    );
  });

  it('forwards dialog dismissal to its owner', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<AccountCreationDialog open onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('creates a non-control petty-cash account and closes on success', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<AccountCreationDialog open onOpenChange={onOpenChange} />);

    await user.click(
      screen.getByRole('button', { name: 'Submit mocked form' })
    );

    await waitFor(() =>
      expect(mocks.createPettyCashAccount).toHaveBeenCalledWith({
        name: 'Office cash',
        accountType: ELedgerAccountBehavior.PettyCash,
        currencyCode: 'USD',
        createWithoutOpeningBalance: false,
        openingBalance: 100,
        openingDate: '2026-07-01',
        exchangeRate: 1500,
        isSubAccount: true,
      })
    );
    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      'Petty cash account created successfully'
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('keeps the dialog open and delegates submit failures', async () => {
    const user = userEvent.setup();
    const error = new Error('Creation failed');
    const onOpenChange = vi.fn();
    mocks.createPettyCashAccount.mockRejectedValue(error);
    render(<AccountCreationDialog open onOpenChange={onOpenChange} />);

    await user.click(
      screen.getByRole('button', { name: 'Submit mocked form' })
    );

    await waitFor(() =>
      expect(mocks.handleApiError).toHaveBeenCalledWith(error, {
        showToast: true,
      })
    );
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
