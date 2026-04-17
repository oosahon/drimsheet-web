import { expect, test } from '@playwright/test';
import { userAccounts } from '../../config/accounts.config';

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/login');
});

const { email, password } = userAccounts.existing;

test('page contains important links', async ({ page }) => {
  const signupLink = page.locator('a[href="/auth/signup"]');
  await expect(signupLink).toBeVisible();
  await expect(signupLink).toHaveText('Sign up');

  const termsOfServiceLink = page.locator('a[href="/terms-of-service"]');
  await expect(termsOfServiceLink).toBeVisible();
  await expect(termsOfServiceLink).toHaveText('Terms of Service');

  const privacyPolicyLink = page.locator('a[href="/privacy-policy"]');
  await expect(privacyPolicyLink).toBeVisible();
  await expect(privacyPolicyLink).toHaveText('Privacy Policy');

  const consentText = page.getByText(
    'By logging in, you agree to our Terms of Service and Privacy Policy.'
  );
  await expect(consentText).toBeVisible();
});

test('invalid login password attempt', async ({ page }) => {
  await page.getByLabel('Email').fill(email);
  await page
    .getByLabel('Password', { exact: true })
    .fill('Definitely Not Pass@0d');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Invalid email or password')).toBeVisible();
});

test('invalid email attempt', async ({ page }) => {
  await page.getByLabel('Email').fill('definitely-not-an-email@email.com');
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Invalid email or password')).toBeVisible();
});

test('different strategy attempt', async ({ page }) => {
  await page.getByLabel('Email').fill(userAccounts.googleStrategy.email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(
    page.getByText('You signed up with a different method.')
  ).toBeVisible();
});

test('successful login', async ({ page }) => {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/dashboard');
});
