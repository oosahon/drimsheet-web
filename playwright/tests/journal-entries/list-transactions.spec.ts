import { expect, test } from '@integration/fixtures/test';
import {
  authenticatedUser,
  registerAuthenticatedAppRoutes,
} from '@integration/mocks/authenticated-app';
import type { Page } from '@playwright/test';

const timestamp = '2026-09-16T10:00:00.000Z';
const money = (amount: number, currencyCode = 'NGN') => ({
  amount,
  currencyCode,
  isMinorUnit: false,
});
const accountNamesById: Record<string, string> = {
  'cash-main': 'Main checking',
  'cash-usd': 'USD account',
  'bank-fees': 'Bank fees',
  gift: 'Gift',
  services: 'Professional services',
};
const counterpartyNamesById: Record<string, string> = {
  osahon: 'Osahon Oboite',
  acme: 'Acme Consulting',
};
const line = (
  id: string,
  entryId: string,
  accountId: string,
  counterpartyId: string,
  sequenceOrder: number,
  amount: ReturnType<typeof money>,
  {
    description = null,
    exchangeRate = null,
    functionalAmount = amount,
  }: {
    description?: string | null;
    exchangeRate?: Record<string, unknown> | null;
    functionalAmount?: ReturnType<typeof money>;
  } = {}
) => ({
  id,
  entryId,
  account: { id: accountId, name: accountNamesById[accountId] },
  counterparty: {
    id: counterpartyId,
    name: counterpartyNamesById[counterpartyId],
  },
  sequenceOrder,
  amount,
  exchangeRate,
  functionalAmount,
  side: 'debit',
  description,
  version: 1,
  createdAt: timestamp,
  updatedAt: timestamp,
});
const entry = (
  id: string,
  sourceType: string,
  lines: ReturnType<typeof line>[]
) => ({
  id,
  accountingEntityId: 'entity-1',
  sourceType,
  memo: null,
  status: 'posted',
  effectiveDate: timestamp,
  postedAt: timestamp,
  voidedAt: null,
  voidingEntryId: null,
  version: 1,
  createdBy: authenticatedUser.id,
  createdAt: timestamp,
  updatedAt: timestamp,
  attachments: [],
  lines,
});

const journalEntries = [
  entry('payment-1', 'payment', [
    line('p-1', 'payment-1', 'cash-main', 'osahon', 1, money(125_000)),
    line('p-2', 'payment-1', 'gift', 'osahon', 2, money(125_000)),
  ]),
  entry('receipt-1', 'receipt', [
    line('r-1', 'receipt-1', 'services', 'acme', 1, money(85_000)),
    line('r-2', 'receipt-1', 'cash-main', 'acme', 2, money(85_000)),
  ]),
  entry('transfer-1', 'transfer', [
    line('t-1', 'transfer-1', 'cash-usd', 'osahon', 1, money(1_000, 'USD'), {
      exchangeRate: {
        asOf: timestamp,
        baseCurrencyCode: 'USD',
        createdAt: timestamp,
        currencyPair: 'USD/NGN',
        rate: 1590,
        source: 'User supplied',
        targetCurrencyCode: 'NGN',
        type: 'negotiated',
      },
      functionalAmount: money(1_590_000),
    }),
    line('t-2', 'transfer-1', 'cash-main', 'osahon', 2, money(1_590_000)),
    line('t-3', 'transfer-1', 'bank-fees', 'osahon', 3, money(10, 'USD'), {
      description: 'International transfer charge',
    }),
  ]),
];

const accounts = [
  { id: 'cash-main', name: 'Main checking' },
  { id: 'cash-usd', name: 'USD account' },
  { id: 'bank-fees', name: 'Bank fees' },
  { id: 'gift', name: 'Gift' },
  { id: 'services', name: 'Professional services' },
];
const counterparties = [
  { id: 'osahon', name: 'Osahon Oboite' },
  { id: 'acme', name: 'Acme Consulting' },
];

async function registerRoutes(
  page: Page,
  journalQueries: URLSearchParams[],
  journalEntryDetailRequests: string[]
) {
  await registerAuthenticatedAppRoutes(page);
  await page.route('**/api/v1/auth/login-with-email', async (route) => {
    await route.fulfill({ json: { accessToken: 'integration-test-token' } });
  });
  await page.route('**/api/v1/auth/refresh-access-token', async (route) => {
    await route.fulfill({ json: { accessToken: 'integration-test-token' } });
  });
  await page.route('**/api/v1/journal-entries?*', async (route) => {
    journalQueries.push(new URL(route.request().url()).searchParams);
    await route.fulfill({
      json: {
        data: journalEntries,
        meta: { page: 1, limit: 10, total: 3, totalPages: 1 },
      },
    });
  });
  await page.route('**/api/v1/journal-entries/*', async (route) => {
    journalEntryDetailRequests.push(route.request().url());
    await route.fulfill({ status: 404, json: { message: 'Not expected' } });
  });
  await page.route('**/api/v1/ledger/posting-accounts*', async (route) => {
    await route.fulfill({
      json: {
        data: accounts,
        meta: { page: 1, limit: 100, total: accounts.length, totalPages: 1 },
      },
    });
  });
  await page.route('**/api/v1/counterparties*', async (route) => {
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

async function signIn(page: Page) {
  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill(authenticatedUser.email);
  await page.getByLabel('Password', { exact: true }).fill('Password1!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');
}

test('lists transactions at the index route and preserves creation routes', async ({
  page,
}) => {
  const journalQueries: URLSearchParams[] = [];
  const journalEntryDetailRequests: string[] = [];
  await registerRoutes(page, journalQueries, journalEntryDetailRequests);
  await signIn(page);

  await page.goto('/transactions');
  await expect(page).toHaveURL('/transactions');
  await expect(page.getByTestId('transactions-table')).toBeVisible();
  await expect(page.getByText('Payment to Osahon Oboite')).toBeVisible();
  await expect(page.getByText('Receipt from Acme Consulting')).toBeVisible();
  await expect(page.getByText('USD account → Main checking')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Open transaction' })
  ).toHaveCount(3);

  await page.getByRole('button', { name: 'Open transaction' }).nth(0).click();
  let drawer = page.getByRole('dialog', { name: 'Transaction details' });
  await expect(drawer.getByText('Outflow')).toBeVisible();
  await expect(drawer.getByText('Main checking')).toBeVisible();
  await expect(drawer.getByText('Gift')).toBeVisible();
  await drawer
    .getByRole('button', { name: 'Close transaction details' })
    .click();
  await expect(drawer).not.toBeVisible();

  await page.getByRole('button', { name: 'Open transaction' }).nth(1).click();
  drawer = page.getByRole('dialog', { name: 'Transaction details' });
  await expect(drawer.getByText('Inflow')).toBeVisible();
  await expect(drawer.getByText('Professional services')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).not.toBeVisible();

  await page.getByRole('button', { name: 'Open transaction' }).nth(2).click();
  drawer = page.getByRole('dialog', { name: 'Transaction details' });
  await expect(drawer.getByText('Transfer', { exact: true })).toBeVisible();
  await expect(drawer.getByText('USD account')).toBeVisible();
  await expect(drawer.getByText('Main checking')).toBeVisible();
  await expect(drawer.getByText('1 USD = 1,590 NGN')).toBeVisible();
  await expect(drawer.getByText('Bank fees')).toBeVisible();
  await expect(drawer.getByText('International transfer charge')).toBeVisible();
  await page
    .locator('[data-slot="sheet-overlay"]')
    .click({ position: { x: 10, y: 10 } });
  await expect(drawer).not.toBeVisible();
  expect(journalEntryDetailRequests).toEqual([]);

  await expect.poll(() => journalQueries.length).toBeGreaterThan(0);
  expect(journalQueries[0].get('page')).toBe('1');
  expect(journalQueries[0].get('limit')).toBe('10');
  expect(journalQueries[0].get('orderBy')).toBe('effectiveDate');
  expect(journalQueries[0].get('sortDirection')).toBe('desc');

  await page.getByPlaceholder('Search transactions...').fill('gift');
  await page.getByRole('columnheader', { name: 'Date' }).click();
  await expect(page).toHaveURL(/q=gift/);
  await expect(page).toHaveURL(/order=asc/);
  await expect
    .poll(() => journalQueries.some((query) => query.get('search') === 'gift'))
    .toBe(true);

  await page.getByRole('link', { name: 'New transaction' }).click();
  await expect(page).toHaveURL('/transactions/inflow');
  await expect(page.getByRole('tab', { name: 'Inflow' })).toBeVisible();
});
