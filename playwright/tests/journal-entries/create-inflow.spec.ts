import type { IReceiptEntryReq } from '@/shared/lib/api/Api';
import { expect, test } from '@integration/fixtures/test';
import {
  authenticatedUser,
  registerAuthenticatedAppRoutes,
} from '@integration/mocks/authenticated-app';
import type { Page } from '@playwright/test';

const loginEndpoint = '**/api/v1/auth/login-with-email';
const refreshEndpoint = '**/api/v1/auth/refresh-access-token';
const postingAccountsEndpoint = '**/api/v1/ledger/posting-accounts*';
const counterpartiesEndpoint = '**/api/v1/counterparties*';
const createReceiptEndpoint = '**/api/v1/journal-entries/receipt';

const destinationAccounts = [
  {
    id: 'ngn-bank',
    code: '1000',
    name: 'NGN operating account',
    type: 'asset',
    subType: 'cash_and_cash_equivalent',
    behavior: 'bank',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
  {
    id: 'usd-bank',
    code: '1010',
    name: 'USD operating account',
    type: 'asset',
    subType: 'cash_and_cash_equivalent',
    behavior: 'bank',
    balance: { amount: 0, currencyCode: 'USD', isMinorUnit: false },
  },
];

const sourceAccounts = [
  {
    id: 'consulting-revenue',
    code: '4000',
    name: 'Consulting revenue',
    type: 'revenue',
    subType: 'services',
    behavior: 'services',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
];

const counterparties = [
  {
    id: 'payer-1',
    accountingEntityId: 'entity-1',
    name: 'Acme Consulting',
    status: 'active',
    type: 'organization',
    roles: ['customer'],
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
];

interface IPostingAccountQuery {
  limit: string | null;
  side: string | null;
  sourceType: string | null;
}

interface IInflowQueryLog {
  counterpartyLimits: Array<string | null>;
  postingAccounts: IPostingAccountQuery[];
}

interface IInflowRouteOptions {
  postingAccountsGate?: Promise<void>;
}

async function registerInflowPageRoutes(
  page: Page,
  queryLog: IInflowQueryLog,
  options: IInflowRouteOptions = {}
) {
  await registerAuthenticatedAppRoutes(page);

  await page.route(refreshEndpoint, async (route) => {
    await route.fulfill({
      status: 200,
      json: { accessToken: 'integration-test-token' },
    });
  });

  await page.route(loginEndpoint, async (route) => {
    await route.fulfill({
      status: 200,
      json: { accessToken: 'integration-test-token' },
    });
  });

  await page.route(postingAccountsEndpoint, async (route) => {
    const url = new URL(route.request().url());
    const side = url.searchParams.get('side');

    queryLog.postingAccounts.push({
      limit: url.searchParams.get('limit'),
      side,
      sourceType: url.searchParams.get('sourceType'),
    });

    const data = side === 'destination' ? destinationAccounts : sourceAccounts;

    await options.postingAccountsGate;
    await route.fulfill({
      json: {
        data,
        meta: { page: 1, limit: 100, total: data.length, totalPages: 1 },
      },
    });
  });

  await page.route(counterpartiesEndpoint, async (route) => {
    const url = new URL(route.request().url());
    queryLog.counterpartyLimits.push(url.searchParams.get('limit'));

    await route.fulfill({
      json: {
        data: counterparties,
        meta: {
          page: 1,
          limit: 100,
          total: counterparties.length,
          totalPages: 1,
        },
      },
    });
  });
}

async function signInAndNavigateToInflow(page: Page) {
  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill(authenticatedUser.email);
  await page.getByLabel('Password', { exact: true }).fill('Password1!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');

  await page.goto('/transactions/inflow');
  await expect(page).toHaveURL('/transactions/inflow');
}

async function fillForeignCurrencyReceipt(page: Page) {
  await page.getByRole('combobox', { name: 'Account' }).click();
  await page.getByRole('option', { name: 'USD operating account' }).click();

  await expect(
    page.getByRole('combobox', { name: 'Currency: USD' })
  ).toBeDisabled();
  await expect(page.getByLabel('Exchange rate')).toBeEnabled();

  await page.getByLabel('Amount', { exact: true }).fill('1250.50');
  await page.getByLabel('Exchange rate').fill('1500');

  await page.getByRole('combobox', { name: 'Category' }).click();
  await page.getByRole('option', { name: 'Consulting revenue' }).click();

  const payer = page.getByRole('combobox', { name: 'Payer' });
  await payer.click();
  await expect(
    page.getByRole('option', { name: 'Acme Consulting' })
  ).toBeVisible();
  await page.getByRole('option', { name: 'Acme Consulting' }).click();

  await page.getByLabel('Description').fill('August consulting retainer');
}

test.describe('Inflow receipt creation', () => {
  test('renders the form skeleton until required query data is ready', async ({
    page,
  }) => {
    let releasePostingAccounts: () => void = () => undefined;
    const postingAccountsGate = new Promise<void>((resolve) => {
      releasePostingAccounts = resolve;
    });

    await registerInflowPageRoutes(
      page,
      { counterpartyLimits: [], postingAccounts: [] },
      { postingAccountsGate }
    );
    await signInAndNavigateToInflow(page);

    const loadingStatus = page.getByRole('status');
    await expect(loadingStatus).toHaveText('Loading inflow form');
    await expect(
      page.getByRole('combobox', { name: 'Account' })
    ).not.toBeVisible();

    releasePostingAccounts();

    await expect(loadingStatus).not.toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Account' })).toBeVisible();
  });

  test('loads permitted options and creates a foreign-currency receipt DTO once', async ({
    page,
  }) => {
    const queryLog: IInflowQueryLog = {
      counterpartyLimits: [],
      postingAccounts: [],
    };
    await registerInflowPageRoutes(page, queryLog);

    let capturedRequestBody: IReceiptEntryReq | null = null;
    let requestCount = 0;
    let releaseReceiptResponse: () => void = () => undefined;
    const receiptResponseGate = new Promise<void>((resolve) => {
      releaseReceiptResponse = resolve;
    });

    await page.route(createReceiptEndpoint, async (route) => {
      requestCount += 1;
      capturedRequestBody = JSON.parse(route.request().postData() ?? '{}');
      await receiptResponseGate;
      await route.fulfill({ status: 201, json: { id: 'receipt-entry-1' } });
    });

    await signInAndNavigateToInflow(page);

    await expect.poll(() => queryLog.postingAccounts.length).toBe(2);
    expect(queryLog.postingAccounts).toEqual(
      expect.arrayContaining([
        { limit: '100', side: 'destination', sourceType: 'receipt' },
        { limit: '100', side: 'source', sourceType: 'receipt' },
      ])
    );
    await expect.poll(() => queryLog.counterpartyLimits).toEqual(['100']);

    await fillForeignCurrencyReceipt(page);

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'receipt.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('receipt content'),
    });
    await expect(page.getByText('receipt.pdf')).toBeVisible();

    const createButton = page.getByRole('button', { name: 'Create' });
    await createButton.click();

    await expect(createButton).toBeDisabled();
    await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true');
    expect(requestCount).toBe(1);

    releaseReceiptResponse();

    await expect(page.getByText('Receipt created successfully')).toBeVisible();
    expect(requestCount).toBe(1);
    expect(capturedRequestBody).not.toBeNull();

    const body = capturedRequestBody as unknown as IReceiptEntryReq;
    const occurredAt = body.effectiveDate;
    const exchangeRate = {
      baseCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      rate: 1500,
      type: 'market',
      asOf: occurredAt,
      source: 'manual',
    };

    expect(occurredAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(body).toEqual({
      sourceLine: {
        accountId: 'consulting-revenue',
        counterparty: {
          id: 'payer-1',
          name: 'Acme Consulting',
          type: 'organization',
        },
        amount: {
          amount: 1250.5,
          currencyCode: 'USD',
          isMinorUnit: false,
        },
        exchangeRate,
        description: 'August consulting retainer',
        sequenceOrder: 1,
      },
      destinationLines: [
        {
          accountId: 'usd-bank',
          counterparty: {
            id: 'payer-1',
            name: 'Acme Consulting',
            type: 'organization',
          },
          amount: {
            amount: 1250.5,
            currencyCode: 'USD',
            isMinorUnit: false,
          },
          exchangeRate,
          description: 'August consulting retainer',
          sequenceOrder: 2,
        },
      ],
      effectiveDate: occurredAt,
      postedAt: occurredAt,
      memo: 'August consulting retainer',
    });
  });

  test('shows translated API feedback and retains form and upload state on failure', async ({
    page,
  }) => {
    await registerInflowPageRoutes(page, {
      counterpartyLimits: [],
      postingAccounts: [],
    });
    await page.route(createReceiptEndpoint, async (route) => {
      await route.fulfill({
        status: 500,
        json: { message: 'Receipt creation failed' },
      });
    });

    await signInAndNavigateToInflow(page);
    await fillForeignCurrencyReceipt(page);

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'retained-receipt.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('retained receipt content'),
    });

    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByText('An error occurred')).toBeVisible();
    await expect(page.getByText('retained-receipt.pdf')).toBeVisible();
    await expect(page.getByLabel('Amount', { exact: true })).toHaveValue(
      '1,250.50'
    );
    await expect(page.getByLabel('Exchange rate')).toHaveValue('1,500');
    await expect(page.getByRole('combobox', { name: 'Payer' })).toHaveValue(
      'Acme Consulting'
    );
    await expect(page.getByLabel('Description')).toHaveValue(
      'August consulting retainer'
    );
  });
});
