import { AccountCombobox } from '@/ledger-accounts/ui/components/account-combobox';
import useCurrencies from '@/shared/hooks/use-currencies';
import { Button } from '@/shared/ui/components/button';
import { CurrencySelect } from '@/shared/ui/components/currency-select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/components/dialog';
import { Field, FieldGroup } from '@/shared/ui/components/field';
import { Label } from '@/shared/ui/components/label';
import Money from '@/shared/ui/components/money';
import { MoneyInput } from '@/shared/ui/components/money-input';
import type { ICurrencyDto, ILedgerAccountDto } from '@/shared/utils/api/Api';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';

/**
 * ===================================
 *          FORM
 * ===================================
 */
export interface ITransactionLineForm {
  accountId: string;
  amount: number;
  currency: string;
}

export interface TransactionLinesFormProps {
  defaultValue: ITransactionLineForm[];
  onSubmit: (values: ITransactionLineForm[]) => void;
  accounts: ILedgerAccountDto[];
  onCancel?: () => void;
}

interface ITransactionLineFormState extends ITransactionLineForm {
  formId: string;
}

interface TransactionLinesFormContentProps extends Omit<
  TransactionLinesFormProps,
  'defaultValue'
> {
  defaultLines: ITransactionLineFormState[];
}

type ActiveEditor = { mode: 'new' } | { mode: 'edit'; index: number } | null;

const emptyLine: ITransactionLineForm = {
  accountId: '',
  amount: 0,
  currency: '',
};

let transactionLineFormId = 0;

function createEmptyLine() {
  return { ...emptyLine };
}

function createFormLine(
  line: ITransactionLineForm = emptyLine
): ITransactionLineFormState {
  transactionLineFormId += 1;

  return {
    ...line,
    formId: `transaction-line-form-${transactionLineFormId}`,
  };
}

function cloneLines(lines: ITransactionLineForm[]) {
  return lines.map(createFormLine);
}

function getLineCurrency(
  line: ITransactionLineForm,
  account?: ILedgerAccountDto
) {
  return line.currency || account?.balance.currencyCode || '';
}

interface TransactionLineCardProps {
  line: ITransactionLineForm;
  account?: ILedgerAccountDto;
  lineNumber: number;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

function TransactionLineCard({
  line,
  account,
  lineNumber,
  onEdit,
  onDelete,
  disabled,
}: TransactionLineCardProps) {
  const currencyCode = getLineCurrency(line, account);

  return (
    <div className="flex items-center gap-2 rounded-md border border-border/80 bg-card px-3 py-2 shadow-xs">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">
          {account?.name || 'Unknown account'}
        </div>
      </div>

      <div className="shrink-0 text-sm font-medium tabular-nums">
        {currencyCode ? (
          <Money
            value={{
              amount: line.amount,
              currencyCode,
              isMinorUnit: false,
            }}
          />
        ) : (
          line.amount
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit line ${lineNumber}`}
          onClick={onEdit}
          disabled={disabled}
        >
          <Pencil />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete line ${lineNumber}`}
          onClick={onDelete}
          disabled={disabled}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

interface TransactionLineEditorProps {
  line: ITransactionLineForm;
  accounts: ILedgerAccountDto[];
  currencies: ICurrencyDto[];
  onChange: (line: ITransactionLineForm) => void;
  onSave: () => void;
  onCancel: () => void;
}

function TransactionLineEditor({
  line,
  accounts,
  currencies,
  onChange,
  onSave,
  onCancel,
}: TransactionLineEditorProps) {
  const selectedAccount = accounts.find(
    (account) => account.id === line.accountId
  );
  const currencyCode = getLineCurrency(line, selectedAccount);

  const updateLine = (
    field: keyof ITransactionLineForm,
    value: string | number
  ) => {
    onChange({ ...line, [field]: value });
  };

  const updateAccount = (accountId: string) => {
    const accountCurrency = accounts.find((account) => account.id === accountId)
      ?.balance.currencyCode;

    onChange({
      ...line,
      accountId,
      currency: line.currency || accountCurrency || '',
    });
  };

  return (
    <div className="space-y-3 rounded-md border border-border/80 bg-background p-3">
      <AccountCombobox
        id="transaction-line-account-editor"
        label="Account"
        value={line.accountId}
        accounts={accounts}
        onChange={updateAccount}
      />

      <div className="grid grid-cols-[2fr_3fr] gap-x-3">
        <CurrencySelect
          label="Currency"
          value={line.currency}
          currencies={currencies}
          onChange={(value) => updateLine('currency', value)}
          displayCode
        />

        <Field>
          <Label htmlFor="transaction-line-amount-editor">Amount</Label>
          <MoneyInput
            id="transaction-line-amount-editor"
            name="transaction-line-amount-editor"
            currencyCode={currencyCode}
            value={line.amount}
            onChange={(event) => {
              const amount = Number(event.target.value || 0);
              updateLine('amount', amount);
            }}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

function TransactionLinesFormContent({
  defaultLines,
  onSubmit,
  accounts,
  onCancel,
}: TransactionLinesFormContentProps) {
  const { data: currencies = [] } = useCurrencies();

  const [lines, setLines] = useState<ITransactionLineFormState[]>(defaultLines);
  const [activeEditor, setActiveEditor] = useState<ActiveEditor>(
    defaultLines.length ? null : { mode: 'new' }
  );
  const [draftLine, setDraftLine] =
    useState<ITransactionLineForm>(createEmptyLine);

  const hasOpenEditor = activeEditor !== null;

  const showNewLineEditor = () => {
    setDraftLine(createEmptyLine());
    setActiveEditor({ mode: 'new' });
  };

  const showExistingLineEditor = (index: number) => {
    const line = lines[index];
    if (!line) return;

    setDraftLine({
      accountId: line.accountId,
      amount: line.amount,
      currency: line.currency,
    });
    setActiveEditor({ mode: 'edit', index });
  };

  const deleteLine = (index: number) => {
    setLines((currentLines) =>
      currentLines.filter((_, lineIndex) => lineIndex !== index)
    );
  };

  const cancelLineEditor = () => {
    setActiveEditor(null);
    setDraftLine(createEmptyLine());
  };

  const saveLineEditor = () => {
    const selectedAccount = accounts.find(
      (account) => account.id === draftLine.accountId
    );
    const lineToSave = {
      ...draftLine,
      currency: getLineCurrency(draftLine, selectedAccount),
    };

    if (activeEditor?.mode === 'edit') {
      setLines((currentLines) =>
        currentLines.map((line, lineIndex) =>
          lineIndex === activeEditor.index ? { ...line, ...lineToSave } : line
        )
      );
    } else {
      setLines((currentLines) => [...currentLines, createFormLine(lineToSave)]);
    }

    cancelLineEditor();
  };

  const handleCancel = () => {
    setLines(defaultLines);
    setActiveEditor(defaultLines.length ? null : { mode: 'new' });
    setDraftLine(createEmptyLine());
    onCancel?.();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(
      lines.map(({ accountId, amount, currency }) => ({
        accountId,
        amount,
        currency,
      }))
    );
  };

  return (
    <div className="w-sm max-w-full">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="max-h-[500px] space-y-3 overflow-y-auto pr-1">
            {lines.map((line, index) => {
              const account = accounts.find(
                (account) => account.id === line.accountId
              );
              const lineNumber = index + 1;
              const isEditingLine =
                activeEditor?.mode === 'edit' && activeEditor.index === index;

              return (
                <div key={line.formId} className="space-y-3">
                  <TransactionLineCard
                    line={line}
                    account={account}
                    lineNumber={lineNumber}
                    onEdit={() => showExistingLineEditor(index)}
                    onDelete={() => deleteLine(index)}
                    disabled={hasOpenEditor}
                  />

                  {isEditingLine && (
                    <TransactionLineEditor
                      line={draftLine}
                      accounts={accounts}
                      currencies={currencies}
                      onChange={setDraftLine}
                      onSave={saveLineEditor}
                      onCancel={cancelLineEditor}
                    />
                  )}
                </div>
              );
            })}

            {activeEditor?.mode === 'new' && (
              <TransactionLineEditor
                line={draftLine}
                accounts={accounts}
                currencies={currencies}
                onChange={setDraftLine}
                onSave={saveLineEditor}
                onCancel={cancelLineEditor}
              />
            )}
          </div>

          {!hasOpenEditor && (
            <>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={showNewLineEditor}
                >
                  <Plus />
                  Add
                </Button>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </>
          )}
        </FieldGroup>
      </form>
    </div>
  );
}

function TransactionLinesForm({
  defaultValue,
  onSubmit,
  accounts,
  onCancel,
}: TransactionLinesFormProps) {
  const defaultValueKey = JSON.stringify(defaultValue);

  return (
    <TransactionLinesFormContent
      key={defaultValueKey}
      defaultLines={cloneLines(defaultValue)}
      onSubmit={onSubmit}
      accounts={accounts}
      onCancel={onCancel}
    />
  );
}

/**
 * ===================================
 *          DIALOG
 * ===================================
 */
export interface TransactionLinesFormDialogProps extends TransactionLinesFormProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

function TransactionLinesFormDialog({
  open,
  onClose,
  title = 'Transaction lines',
  ...formProps
}: TransactionLinesFormDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="w-sm bg-card border-border/80 shadow-2xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground font-heading">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex justify-center">
          <TransactionLinesForm {...formProps} onCancel={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * ===================================
 *          EXPORTS
 * ===================================
 */
export {
  TransactionLineCard,
  TransactionLinesForm,
  TransactionLinesFormDialog,
};
