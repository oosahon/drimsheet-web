import type { IBankAccountCreationReq } from '@/shared/lib/api/Api';
import { expect, test } from '@integration/fixtures/test';
import {
  authenticatedUser,
  registerAuthenticatedAppRoutes,
} from '@integration/mocks/authenticated-app';
import type { Page } from '@playwright/test';

const loginEndpoint = '**/api/v1/auth/login-with-email';
const refreshEndpoint = '**/api/v1/auth/refresh-access-token';
const ledgerAccountsEndpoint = '**/api/v1/ledger*';
const createBankAccountEndpoint = '**/api/v1/accounts/asset/bank';
const currenciesEndpoint = '**/api/v1/currencies*';
const banksEndpoint = '**/api/v1/banks*';

async function registerAccountPageRoutes(page: Page) {
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

  await page.route(currenciesEndpoint, async (route) => {
    await route.fulfill({
      json: [
        { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', minorUnit: 2 },
        { code: 'USD', name: 'US Dollar', symbol: '$', minorUnit: 2 },
      ],
    });
  });

  await page.route(banksEndpoint, async (route) => {
    await route.fulfill({
      json: [
        { countryCode: 'NG', bankCode: 'GTB', bankName: 'Guaranty Trust Bank' },
        { countryCode: 'NG', bankCode: 'ACCESS', bankName: 'Access Bank' },
      ],
    });
  });

  await page.route(ledgerAccountsEndpoint, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        json: {
          data: [],
          meta: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      });
    } else {
      await route.fallback();
    }
  });
}

async function signInAndNavigateToAccounts(page: Page) {
  await registerAccountPageRoutes(page);

  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill(authenticatedUser.email);
  await page.getByLabel('Password', { exact: true }).fill('Password1!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');

  await page.goto('/accounts');
  await expect(page).toHaveURL('/accounts');
}

test.describe('Bank Account Creation Flow', () => {
  test('opens bank creation dialog, attaches local statement, submits form and verifies API DTO', async ({
    page,
  }) => {
    await signInAndNavigateToAccounts(page);

    const addAccountButton = page.getByRole('button', { name: 'Add account' });
    await expect(addAccountButton).toBeVisible();
    await addAccountButton.click();

    const selectionDialog = page.getByRole('dialog').filter({
      has: page.getByRole('heading', { name: /select account type/i }),
    });
    await expect(selectionDialog).toBeVisible();

    await selectionDialog.getByRole('radio', { name: /bank account/i }).click();

    const continueButton = selectionDialog.getByRole('button', {
      name: /continue/i,
    });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    await expect(selectionDialog).not.toBeVisible();

    const bankDialog = page.getByRole('dialog').filter({
      has: page.getByRole('heading', { name: /create bank account/i }),
    });
    await expect(bankDialog).toBeVisible();

    // Test dismissal via Escape key
    await page.keyboard.press('Escape');
    await expect(bankDialog).not.toBeVisible();

    // Reopen dialog
    await addAccountButton.click();
    await selectionDialog.getByRole('radio', { name: /bank account/i }).click();
    await continueButton.click();
    await expect(bankDialog).toBeVisible();

    // Attach local statement PDF
    const fileInput = bankDialog.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'bank-statement.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test pdf content'),
    });
    await expect(bankDialog.getByText('bank-statement.pdf')).toBeVisible();

    // Intercept POST request
    let capturedRequestBody: IBankAccountCreationReq | null = null;
    await page.route(createBankAccountEndpoint, async (route) => {
      if (route.request().method() === 'POST') {
        capturedRequestBody = JSON.parse(route.request().postData() ?? '{}');
        await route.fulfill({
          status: 201,
          json: { id: 'new-bank-account-id' },
        });
      } else {
        await route.fallback();
      }
    });

    // Fill form
    await bankDialog
      .getByRole('textbox', { name: 'Account name', exact: true })
      .fill('Main Operating Account');

    // Select bank location
    await bankDialog.getByRole('combobox', { name: 'Bank location' }).click();
    await page.getByRole('option', { name: 'Nigeria' }).click();

    // Select bank name
    await bankDialog.getByRole('combobox', { name: 'Bank name' }).click();
    await page.getByRole('option', { name: 'Access Bank' }).click();

    // Fill account number and account name
    await bankDialog
      .getByRole('textbox', { name: 'Bank account number' })
      .fill('0123456789');
    await bankDialog
      .getByRole('textbox', { name: 'Bank account name' })
      .fill('Acme Corp');

    // Fill opening balance
    await bankDialog
      .getByRole('textbox', { name: 'Opening balance' })
      .fill('5000');

    // Select opening date via DateInput calendar
    await bankDialog.getByRole('button', { name: /opening date/i }).click();
    await page.getByRole('gridcell', { name: '15' }).first().click();

    // Submit form
    const createButton = bankDialog.getByRole('button', {
      name: /create account/i,
    });
    await expect(createButton).toBeEnabled();
    await createButton.click();

    // Assert toast feedback and dialog closure
    await expect(
      page.getByText('Bank account created successfully')
    ).toBeVisible();
    await expect(bankDialog).not.toBeVisible();

    // Assert JSON POST body contains no statement file and correct structure
    expect(capturedRequestBody).toEqual({
      name: 'Main Operating Account',
      currencyCode: 'NGN',
      bankAccount: {
        bankName: 'Access Bank',
        accountName: 'Acme Corp',
        accountNumber: '0123456789',
      },
      openingBalance: {
        amount: {
          amount: 5000,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        date: expect.stringMatching(/^\d{4}-\d{2}-15$/),
        exchangeRate: null,
      },
    });
  });
});
