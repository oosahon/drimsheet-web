import {
  createInflowFormValidation,
  InflowForm,
  type IInflowFormValidationMessages,
  type IInflowFormValues,
} from '@/journal-entries/components/inflow-form';
import type { IExchangeRate, ILedgerAccountDto } from '@/shared/lib/api/Api';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

const destinationAccounts = [
  {
    id: 'ngn-bank',
    code: '1000',
    name: 'NGN bank account',
    type: 'asset',
    openingBalanceDate: '2026-08-08',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
  {
    id: 'usd-bank',
    code: '1010',
    name: 'USD bank account',
    type: 'asset',
    openingBalanceDate: '2026-08-01',
    balance: { amount: 0, currencyCode: 'USD', isMinorUnit: false },
  },
] as unknown as ILedgerAccountDto[];

const sourceAccounts = [
  {
    id: 'sales',
    code: '4000',
    name: 'Sales revenue',
    type: 'revenue',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
] as unknown as ILedgerAccountDto[];

const validationMessages: IInflowFormValidationMessages = {
  accountRequired: 'Account is required',
  amountPositive: 'Amount must be greater than zero',
  amountRequired: 'Amount is required',
  categoryRequired: 'Category is required',
  dateBeforeAccountOpening: 'Date cannot be before the account opening date',
  dateFuture: 'Date cannot be in the future',
  dateRequired: 'Date is required',
  exchangeRateNumber: 'Exchange rate must be a number',
  exchangeRatePositive: 'Exchange rate must be greater than zero',
  exchangeRateRequired: 'Exchange rate is required',
  itemAmountPositive: 'Item amount must be greater than zero',
  itemAmountRequired: 'Item amount is required',
  itemCategoryRequired: 'Item category is required',
  itemsRequired: 'Add at least one item',
  payerRequired: 'Payer is required',
  receiptSize: 'Receipt must be no larger than 2 MB',
  receiptType: 'Receipt must be a JPEG, PNG, or PDF',
};

const validValues: IInflowFormValues = {
  destinationAccountId: 'ngn-bank',
  sourceAccountId: 'sales',
  amount: { amount: 250, currencyCode: 'NGN', isMinorUnit: false },
  date: '2026-08-10',
  exchangeRate: '',
  isItemized: false,
  items: [],
  payer: { name: 'Payer' },
  description: '',
  receipt: null,
};

describe('InflowForm validation', () => {
  const schema = createInflowFormValidation(
    destinationAccounts,
    'NGN',
    validationMessages
  );

  it('uses item amounts as authoritative while itemized', async () => {
    await expect(
      schema.validate({
        ...validValues,
        amount: {
          amount: Number.NaN,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        isItemized: true,
        items: [
          {
            id: 'item-1',
            amount: { amount: 100, currencyCode: 'NGN', isMinorUnit: false },
            accountId: 'sales',
            description: '',
          },
        ],
      })
    ).resolves.toBeTruthy();
  });

  it('rejects unsupported and oversized receipt files', async () => {
    await expect(
      schema.validate({
        ...validValues,
        receipt: new File(['text'], 'receipt.txt', { type: 'text/plain' }),
      })
    ).rejects.toThrow('Receipt must be a JPEG, PNG, or PDF');

    await expect(
      schema.validate({
        ...validValues,
        receipt: new File(
          [new Uint8Array(2 * 1024 * 1024 + 1)],
          'receipt.pdf',
          {
            type: 'application/pdf',
          }
        ),
      })
    ).rejects.toThrow('Receipt must be no larger than 2 MB');
  });

  it('rejects a future date', async () => {
    await expect(
      schema.validate({ ...validValues, date: '2999-01-01' })
    ).rejects.toThrow('Date cannot be in the future');
  });

  it('rejects a date before the destination account opening date', async () => {
    await expect(
      schema.validate({ ...validValues, date: '2026-08-07' })
    ).rejects.toThrow('Date cannot be before the account opening date');
  });

  it('accepts the destination account opening date', async () => {
    await expect(
      schema.validate({ ...validValues, date: '2026-08-08' })
    ).resolves.toBeTruthy();
  });
});

describe('InflowForm', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn(
      () => false
    ) as unknown as typeof window.HTMLElement.prototype.hasPointerCapture;
    window.HTMLElement.prototype.releasePointerCapture =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.releasePointerCapture;
    window.HTMLElement.prototype.setPointerCapture =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.setPointerCapture;
    window.HTMLElement.prototype.scrollIntoView =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.scrollIntoView;
  });

  it('renders the single-entry layout and omits same-currency exchange rate', () => {
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={validValues}
        onCurrencyContextChange={() => undefined}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    expect(screen.getByLabelText('Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.queryByLabelText('Exchange rate')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toHaveAttribute(
      'placeholder',
      'Select category'
    );
    expect(
      screen.getByRole('button', { name: 'Itemize this transaction' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Attach Receipt')).toHaveAttribute(
      'accept',
      'image/jpeg,image/png,application/pdf'
    );
  });

  it('uses a matching official foreign exchange rate as the default', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const officialRate = {
      baseCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      rate: 1500,
      asOf: '2026-08-10T00:00:00.000Z',
    } as IExchangeRate;

    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={{
          ...validValues,
          destinationAccountId: 'usd-bank',
          amount: { ...validValues.amount, currencyCode: 'USD' },
        }}
        officialExchangeRate={officialRate}
        onCurrencyContextChange={() => undefined}
        onSubmit={onSubmit}
        sourceAccounts={sourceAccounts}
      />
    );

    expect(screen.getByLabelText('Exchange rate')).toHaveValue('1,500');
    expect(screen.getByRole('alert')).toHaveTextContent('Official rate: 1500');

    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...validValues,
        destinationAccountId: 'usd-bank',
        amount: { ...validValues.amount, currencyCode: 'USD' },
        exchangeRate: '1500',
      })
    );
  });

  it('shows a warning when no official foreign exchange rate is supplied', () => {
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={{
          ...validValues,
          destinationAccountId: 'usd-bank',
          amount: { ...validValues.amount, currencyCode: 'USD' },
        }}
        onCurrencyContextChange={() => undefined}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    expect(screen.getByText('No system official rate')).toBeInTheDocument();
  });

  it('reports a foreign account currency with the current date', async () => {
    const user = userEvent.setup();
    const onCurrencyContextChange = vi.fn();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={validValues}
        onCurrencyContextChange={onCurrencyContextChange}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(screen.getByRole('combobox', { name: 'Account' }));
    await user.click(screen.getByRole('option', { name: 'USD bank account' }));

    expect(onCurrencyContextChange).toHaveBeenLastCalledWith({
      currencyCode: 'USD',
      date: '2026-08-10',
    });
    expect(onCurrencyContextChange).toHaveBeenCalledOnce();
  });

  it('reports a functional-currency account so the parent can clear its query', async () => {
    const user = userEvent.setup();
    const onCurrencyContextChange = vi.fn();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={{ ...validValues, destinationAccountId: '' }}
        onCurrencyContextChange={onCurrencyContextChange}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(screen.getByRole('combobox', { name: 'Account' }));
    await user.click(screen.getByRole('option', { name: 'NGN bank account' }));

    expect(onCurrencyContextChange).toHaveBeenCalledWith({
      currencyCode: 'NGN',
      date: '2026-08-10',
    });
    expect(onCurrencyContextChange).toHaveBeenCalledOnce();
  });

  it('reports the selected date with the current account currency', async () => {
    const user = userEvent.setup();
    const onCurrencyContextChange = vi.fn();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={{
          ...validValues,
          destinationAccountId: 'usd-bank',
          amount: { ...validValues.amount, currencyCode: 'USD' },
        }}
        onCurrencyContextChange={onCurrencyContextChange}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(screen.getByLabelText('Date'));
    await user.click(screen.getByRole('button', { name: /Sunday, August 9/i }));

    expect(onCurrencyContextChange).toHaveBeenCalledOnce();
    expect(onCurrencyContextChange).toHaveBeenCalledWith({
      currencyCode: 'USD',
      date: '2026-08-09',
    });
  });

  it('disables dates before the selected account opening date', async () => {
    const user = userEvent.setup();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={validValues}
        onCurrencyContextChange={() => undefined}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(screen.getByLabelText('Date'));

    expect(
      screen.getByRole('button', { name: /Friday, August 7/i })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: /Saturday, August 8/i })
    ).toBeEnabled();
  });

  it('does not show a required error after selecting an account for the first time', async () => {
    const user = userEvent.setup();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={{ ...validValues, destinationAccountId: '' }}
        onCurrencyContextChange={() => undefined}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(screen.getByRole('combobox', { name: 'Account' }));
    await user.click(
      await screen.findByRole('option', { name: 'NGN bank account' })
    );

    await waitFor(() =>
      expect(screen.queryByText('Account is required')).not.toBeInTheDocument()
    );
  });

  it('disables and derives the top amount while itemized', async () => {
    const user = userEvent.setup();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={validValues}
        onCurrencyContextChange={() => undefined}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Itemize this transaction' })
    );

    expect(document.querySelector('#inflow-category')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Back to single entry' })
    ).toBeInTheDocument();
    const amountInputs = screen.getAllByLabelText('Amount');
    expect(amountInputs[0]).toBeDisabled();
    expect(amountInputs[0]).toHaveValue('250');

    await user.clear(amountInputs[1]);
    await user.type(amountInputs[1], '100');
    expect(amountInputs[0]).toHaveValue('250');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(amountInputs[0]).toHaveValue('100'));
  });

  it('disables submission only while an itemized row editor is open', async () => {
    const user = userEvent.setup();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={validValues}
        onCurrencyContextChange={() => undefined}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    const createButton = screen.getByRole('button', { name: 'Create' });
    expect(createButton).toBeEnabled();

    await user.click(
      screen.getByRole('button', { name: 'Itemize this transaction' })
    );

    expect(createButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(createButton).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Edit item 1' }));

    expect(createButton).toBeDisabled();

    await user.click(
      screen.getByRole('button', { name: 'Open item 1 actions' })
    );
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(createButton).toBeEnabled();
  });

  it('clears edit mode when a currency change discards a child draft', async () => {
    const user = userEvent.setup();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={validValues}
        onCurrencyContextChange={() => undefined}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Itemize this transaction' })
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('button', { name: 'Edit item 1' }));

    const createButton = screen.getByRole('button', { name: 'Create' });
    expect(createButton).toBeDisabled();

    await user.click(screen.getByRole('combobox', { name: 'Account' }));
    await user.click(screen.getByRole('option', { name: 'USD bank account' }));

    expect(createButton).toBeEnabled();
    expect(
      screen.getByRole('button', { name: 'Edit item 1' })
    ).toBeInTheDocument();
  });

  it('keeps edit mode when a currency change recreates the initial draft', async () => {
    const user = userEvent.setup();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={validValues}
        onCurrencyContextChange={() => undefined}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Itemize this transaction' })
    );

    const createButton = screen.getByRole('button', { name: 'Create' });
    expect(createButton).toBeDisabled();

    await user.click(screen.getByRole('combobox', { name: 'Account' }));
    await user.click(screen.getByRole('option', { name: 'USD bank account' }));

    expect(createButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('requires confirmation before discarding additional rows', async () => {
    const user = userEvent.setup();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={validValues}
        onCurrencyContextChange={() => undefined}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Itemize this transaction' })
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('button', { name: 'Add a new item' }));
    await user.type(screen.getAllByLabelText('Amount')[1], '100');
    await user.click(screen.getByRole('combobox', { name: 'Category' }));
    await user.click(screen.getByRole('option', { name: 'Sales revenue' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(
      screen.getByRole('button', { name: 'Back to single entry' })
    );

    expect(
      screen.getByRole('alertdialog', { name: 'Return to single entry?' })
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Keep itemized entry' })
    );
    expect(
      screen.getByRole('button', { name: 'Back to single entry' })
    ).toBeInTheDocument();
  });

  it('submits normalized form-owned values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={{ ...validValues, description: ' Receipt ' }}
        onCurrencyContextChange={() => undefined}
        onSubmit={onSubmit}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...validValues,
        description: 'Receipt',
      })
    );
  });
});
