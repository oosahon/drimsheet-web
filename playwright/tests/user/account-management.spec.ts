import type { IAccountingEntity } from '@/shared/lib/api/Api';
import { expect, test } from '@integration/fixtures/test';
import {
  alternateAccountingEntity,
  authenticatedAccountingEntity,
  authenticatedUser,
} from '@integration/mocks/authenticated-app';
import type { Page } from '@playwright/test';

const loginEndpoint = '**/api/v1/auth/login-with-email';
const refreshEndpoint = '**/api/v1/auth/refresh-access-token';
const profileEndpoint = '**/api/v1/users/profile';
const entityListEndpoint = '**/api/v1/accounting/accounting-entities';
const activeEntityEndpoint = '**/api/v1/accounting/accounting-entity';

async function registerAccountManagementRoutes(page: Page) {
  await page.route(profileEndpoint, async (route) => {
    await route.fulfill({ json: authenticatedUser });
  });
  await page.route(entityListEndpoint, async (route) => {
    const selectedEntityId = route.request().headers()[
      'x-accounting-entity-id'
    ];
    const entities: IAccountingEntity[] =
      selectedEntityId === alternateAccountingEntity.id
        ? [alternateAccountingEntity, authenticatedAccountingEntity]
        : [authenticatedAccountingEntity, alternateAccountingEntity];

    await route.fulfill({ json: entities });
  });
  await page.route(activeEntityEndpoint, async (route) => {
    const selectedEntityId = route.request().headers()[
      'x-accounting-entity-id'
    ];
    const entity =
      selectedEntityId === alternateAccountingEntity.id
        ? alternateAccountingEntity
        : authenticatedAccountingEntity;

    await route.fulfill({ json: entity });
  });
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

async function signIn(page: Page) {
  await registerAccountManagementRoutes(page);
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

  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill(authenticatedUser.email);
  await page.getByLabel('Password', { exact: true }).fill('Password1!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');
}

test('opens account management with active and alternate account details', async ({
  page,
}) => {
  await signIn(page);

  const trigger = page.getByRole('button', {
    name: 'Open account management for Integration Entity',
  });
  await expect(trigger).toContainText('IE');
  await expect(
    page.getByRole('button', { name: 'Notifications' })
  ).toBeDisabled();

  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Account management' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Integration Entity');
  await expect(dialog).toContainText(authenticatedUser.email);
  await expect(dialog).toContainText('Individual');
  await expect(
    dialog.getByRole('button', { name: 'Switch to Purple Ledger Limited' })
  ).toBeVisible();
  await expect(
    dialog.getByRole('button', { name: 'Drop a feedback' })
  ).toBeDisabled();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('persists another accounting entity and reloads under its request header', async ({
  page,
}) => {
  await signIn(page);

  await page
    .getByRole('button', {
      name: 'Open account management for Integration Entity',
    })
    .click();

  const selectedEntityRequest = page.waitForRequest((request) => {
    return (
      request.url().includes('/api/v1/accounting/accounting-entities') &&
      request.headers()['x-accounting-entity-id'] ===
        alternateAccountingEntity.id
    );
  });

  await page
    .getByRole('button', { name: 'Switch to Purple Ledger Limited' })
    .click();
  await selectedEntityRequest;

  await expect(
    page.getByRole('button', {
      name: 'Open account management for Purple Ledger Limited',
    })
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem('accounting-entity-id'))
  ).toBe(alternateAccountingEntity.id);
});

test('opens the existing accounting entity creation dialog', async ({
  page,
}) => {
  await registerConfigurationRoutes(page);
  await signIn(page);

  await page
    .getByRole('button', {
      name: 'Open account management for Integration Entity',
    })
    .click();
  await page.getByRole('button', { name: 'Add a new account' }).click();

  const creationDialog = page.getByRole('dialog', { name: 'Account setup' });
  await expect(creationDialog).toBeVisible();

  await creationDialog.getByRole('button', { name: 'Close' }).click();

  await expect(creationDialog).not.toBeVisible();
  await expect(
    page.getByRole('button', {
      name: 'Open account management for Integration Entity',
    })
  ).toBeVisible();
});
