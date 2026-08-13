import { expect, test } from '@integration/fixtures/test';
import {
  authenticatedUser,
  registerAuthenticatedAppRoutes,
} from '@integration/mocks/authenticated-app';
import type { Page } from '@playwright/test';

const loginEndpoint = '**/api/v1/auth/login-with-email';
const entityListEndpoint = '**/api/v1/accounting/accounting-entities';
const entityCreationEndpoint = '**/api/v1/accounting/accounting-entity';

async function signIn(page: Page) {
  await page.route(loginEndpoint, async (route) => {
    await route.fulfill({
      status: 200,
      json: { accessToken: 'integration-test-token' },
    });
  });
  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill(authenticatedUser.email);
  await page.getByLabel('Password', { exact: true }).fill('Password1!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');
}

async function registerConfigurationRoutes(page: Page) {
  await page.route('**/api/v1/currencies', async (route) => {
    await route.fulfill({
      json: [
        { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', minorUnit: 2 },
      ],
    });
  });
  await page.route('**/api/v1/accounting/jurisdictions', async (route) => {
    await route.fulfill({
      json: [
        {
          code: 'NG',
          name: 'Nigeria',
          currencyCode: 'NGN',
          accountingStandards: {
            individual: ['IFRS'],
            sole_trader: ['IFRS'],
            private_company: ['IFRS'],
          },
        },
      ],
    });
  });
}

async function completeAccountingEntityForm(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'Account setup' });
  await dialog
    .getByRole('combobox', { name: 'Who is this account for?' })
    .click();
  await page.getByRole('option', { name: 'A Company' }).click();
  await dialog.getByRole('textbox', { name: 'Name' }).fill('Purple Limited');
  await dialog.getByRole('button', { name: 'Next' }).click();
  await expect(
    dialog.getByText('What currency should your reports use?')
  ).toBeVisible();
  await dialog.getByRole('button', { name: 'Next' }).click();
  await dialog.getByRole('button', { name: 'Complete setup' }).click();
}

test('does not show onboarding when the entity query returns an entity', async ({
  page,
}) => {
  await registerAuthenticatedAppRoutes(page);
  await signIn(page);

  await expect(
    page.getByRole('dialog', { name: 'Account setup' })
  ).not.toBeVisible();
  await expect(
    page.getByRole('button', {
      name: 'Open account management for Integration Entity',
    })
  ).toBeVisible();
});

test('shows a non-dismissible onboarding dialog for an empty entity result', async ({
  page,
}) => {
  await registerAuthenticatedAppRoutes(page);
  await page.route(entityListEndpoint, async (route) => {
    await route.fulfill({ json: [] });
  });
  await registerConfigurationRoutes(page);

  await signIn(page);

  const dialog = page.getByRole('dialog', { name: 'Account setup' });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('combobox', { name: 'Who is this account for?' })
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: /close/i })).toHaveCount(0);
});

test('creates an entity, refetches eligibility, and closes onboarding', async ({
  page,
}) => {
  let entityCreated = false;
  let entityListRequestCount = 0;
  let submittedPayload: unknown;
  const createdEntity = {
    id: '00000000-0000-4000-8000-000000000003',
    name: 'Purple Limited',
    type: 'private_company',
    ownerId: authenticatedUser.id,
    functionalCurrencyCode: 'NGN',
    jurisdictionCode: 'NG',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  await registerAuthenticatedAppRoutes(page);
  await page.route(entityListEndpoint, async (route) => {
    entityListRequestCount += 1;
    await route.fulfill({ json: entityCreated ? [createdEntity] : [] });
  });
  await page.route(entityCreationEndpoint, async (route) => {
    submittedPayload = route.request().postDataJSON();
    entityCreated = true;
    await route.fulfill({ status: 201, json: createdEntity });
  });
  await registerConfigurationRoutes(page);
  await signIn(page);

  const dialog = page.getByRole('dialog', { name: 'Account setup' });
  await completeAccountingEntityForm(page);

  await expect(dialog).not.toBeVisible();
  expect(entityListRequestCount).toBeGreaterThanOrEqual(2);
  expect(submittedPayload).toEqual(
    expect.objectContaining({
      name: 'Purple Limited',
      entityType: 'private_company',
      jurisdictionCode: 'NG',
      functionalCurrencyCode: 'NGN',
      reportingCurrencyCode: 'NGN',
      accountingStandardCode: 'IFRS',
      appUsageMode: 'non_power_user',
    })
  );
});

test('handles an entity creation API error without crashing onboarding', async ({
  page,
}) => {
  await registerAuthenticatedAppRoutes(page);
  await page.route(entityListEndpoint, async (route) => {
    await route.fulfill({ json: [] });
  });
  await page.route(entityCreationEndpoint, async (route) => {
    await route.fulfill({
      status: 400,
      json: {
        name: 'AccountingError',
        errorKey: 'accounting_error_accounting_entity_invalid_type',
        validationErrors: [],
      },
    });
  });
  await registerConfigurationRoutes(page);
  await signIn(page);

  await completeAccountingEntityForm(page);

  await expect(page.getByText('Invalid accounting entity type')).toBeVisible();
  await expect(
    page.getByRole('dialog', { name: 'Account setup' })
  ).toBeVisible();
  await expect(page).toHaveURL('/dashboard');
});
