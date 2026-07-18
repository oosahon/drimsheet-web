import {
  TransferTransactionForm,
  type ITransferTransactionFormProps,
} from '@/bookkeeping/ui/components/transfer-transaction-form';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerAccountSubType,
  ELedgerType,
  ENormalBalance,
  type ILedgerAccountDto,
  type TEntityId,
} from '@/shared/lib/api/Api';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

const createAccount = (
  overrides: Pick<ILedgerAccountDto, 'id' | 'code' | 'name'> &
    Partial<ILedgerAccountDto>
): ILedgerAccountDto => {
  const { id, code, name, ...rest } = overrides;

  return {
    id,
    code,
    name,
    type: ELedgerType.Asset,
    normalBalance: ENormalBalance.Debit,
    subType: ELedgerAccountSubType.CashAndCashEquivalent,
    behavior: 'bank',
    isControlAccount: false,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraNotApplicable,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctNotApplicable,
    balance: { amount: 150000, currencyCode: 'NGN', isMinorUnit: false },
    functionalBalance: {
      amount: 150000,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-01T08:00:00Z',
    createdBy: 'user-1' as TEntityId,
    materializedPath: '',
    accountingEntityId: 'entity-1' as TEntityId,
    ...rest,
  };
};

const mockAccounts: ILedgerAccountDto[] = [
  createAccount({
    id: 'source-account' as TEntityId,
    code: '1000',
    name: 'Main Bank Account',
  }),
  createAccount({
    id: 'destination-account' as TEntityId,
    code: '1010',
    name: 'Petty Cash Vault',
    behavior: 'petty_cash',
  }),
  createAccount({
    id: 'usd-account' as TEntityId,
    code: '1100',
    name: 'USD Operating Account',
    balance: { amount: 12000, currencyCode: 'USD', isMinorUnit: false },
  }),
];

const renderForm = (props?: Partial<ITransferTransactionFormProps>) => {
  const onSubmit = vi.fn<ITransferTransactionFormProps['onSubmit']>();

  render(
    <TransferTransactionForm
      accounts={mockAccounts}
      onSubmit={onSubmit}
      loading={false}
      {...props}
    />
  );

  return { onSubmit };
};

const selectAccount = async (label: string, accountName: string) => {
  const user = userEvent.setup();
  const input = screen.getByRole('combobox', { name: label });

  await user.click(input);
  await user.click(await screen.findByRole('option', { name: accountName }));

  return input;
};

describe('TransferTransactionForm', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn(
      () => false
    ) as typeof window.HTMLElement.prototype.hasPointerCapture;
    window.HTMLElement.prototype.releasePointerCapture =
      vi.fn() as typeof window.HTMLElement.prototype.releasePointerCapture;
    window.HTMLElement.prototype.setPointerCapture =
      vi.fn() as typeof window.HTMLElement.prototype.setPointerCapture;
    window.HTMLElement.prototype.scrollIntoView =
      vi.fn() as typeof window.HTMLElement.prototype.scrollIntoView;
  });

  it('renders the transfer form fields and submit button', () => {
    renderForm();

    expect(
      screen.getByRole('combobox', { name: 'Source account' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Destination account' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Amount sent')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount received')).toBeInTheDocument();
    expect(screen.queryByLabelText('Exchange rate')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Switch conversion' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Add bank charges' })
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toHaveRole('button');
    expect(screen.getByRole('switch', { name: 'Pending' }));
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('disables submit while loading', () => {
    renderForm({ loading: true });

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('shows required validation errors when submitted empty', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Source account is required')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Destination account is required')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Amount must be greater than zero')
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('filters the selected source account from destination options', async () => {
    const user = userEvent.setup();

    renderForm();
    await selectAccount('Source account', 'Main Bank Account');
    await user.click(
      screen.getByRole('combobox', { name: 'Destination account' })
    );

    expect(
      screen.queryByRole('option', { name: 'Main Bank Account' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Petty Cash Vault' })
    ).toBeInTheDocument();
  });

  it('updates an account combobox after one selection', async () => {
    renderForm();

    const sourceAccountInput = await selectAccount(
      'Source account',
      'Main Bank Account'
    );

    expect(sourceAccountInput).toHaveValue('Main Bank Account');
  });

  it('filters the selected destination account from source options', async () => {
    const user = userEvent.setup();

    renderForm();
    await selectAccount('Destination account', 'Petty Cash Vault');
    await user.click(screen.getByRole('combobox', { name: 'Source account' }));

    expect(
      screen.queryByRole('option', { name: 'Petty Cash Vault' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Main Bank Account' })
    ).toBeInTheDocument();
  });

  it('copies amount sent into amount received while amount received is untouched', async () => {
    const user = userEvent.setup();

    renderForm();

    await user.type(screen.getByLabelText('Amount sent'), '500');

    expect(screen.getByLabelText('Amount received')).toHaveValue('500');
  });

  it('copies amount received into amount sent while amount sent is untouched', async () => {
    const user = userEvent.setup();

    renderForm();

    await user.type(screen.getByLabelText('Amount received'), '750');

    expect(screen.getByLabelText('Amount sent')).toHaveValue('750');
  });

  it('shows an error when amount received differs from amount sent', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await selectAccount('Source account', 'Main Bank Account');
    await selectAccount('Destination account', 'Petty Cash Vault');
    await user.type(screen.getByLabelText('Amount sent'), '500');
    await user.clear(screen.getByLabelText('Amount received'));
    await user.type(screen.getByLabelText('Amount received'), '400');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Amount received must equal amount sent')
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('updates the date from the calendar picker', async () => {
    const user = userEvent.setup();
    const today = new Date();
    const todayText = String(today.getDate());

    renderForm();

    await user.click(screen.getByLabelText('Date'));

    const todayButton = screen
      .getAllByText(todayText)
      .map((day) => day.closest('button'))
      .find((button) => button && !button.hasAttribute('disabled'));

    expect(todayButton).toBeDefined();

    await user.click(todayButton as HTMLButtonElement);

    expect(screen.getByLabelText('Date')).toHaveTextContent(
      new RegExp(`\\b${todayText}\\b`)
    );
  });

  it('disables future dates in the calendar picker', async () => {
    const user = userEvent.setup();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    renderForm();

    await user.click(screen.getByLabelText('Date'));

    const futureDayButtons = screen
      .getAllByText(String(tomorrow.getDate()))
      .map((day) => day.closest('button'))
      .filter(Boolean);

    expect(
      futureDayButtons.some((button) => button?.hasAttribute('disabled'))
    ).toBe(true);
  });

  it('submits selected accounts and amount for a valid transfer', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await selectAccount('Source account', 'Main Bank Account');
    await selectAccount('Destination account', 'Petty Cash Vault');
    await user.type(screen.getByLabelText('Amount sent'), '500');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceAccountId: 'source-account',
        destinationAccountId: 'destination-account',
        amount: {
          amount: 500,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        amountReceived: {
          amount: 500,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        pending: false,
        description: '',
      }),
      expect.objectContaining({})
    );
  });

  it('hides and presets the source account from an account context', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm({ sourceAccountId: 'source-account' });

    expect(
      screen.queryByRole('combobox', { name: 'Source account' })
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('combobox', { name: 'Destination account' })
    );
    expect(
      screen.queryByRole('option', { name: 'Main Bank Account' })
    ).not.toBeInTheDocument();
    await user.click(
      await screen.findByRole('option', { name: 'Petty Cash Vault' })
    );
    await user.type(screen.getByLabelText('Amount sent'), '500');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceAccountId: 'source-account',
        destinationAccountId: 'destination-account',
      }),
      expect.objectContaining({})
    );
  });
});
