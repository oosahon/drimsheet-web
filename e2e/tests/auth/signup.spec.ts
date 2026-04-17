import { expect, test } from '@playwright/test';
import { userAccounts } from '../../config/accounts.config';
import emailBodyParser from '../../helpers/email-body-parser.helper';

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/signup');
});

test('page contains important links', async ({ page }) => {
  const loginLink = page.locator('a[href="/auth/login"]');
  await expect(loginLink).toBeVisible();
  await expect(loginLink).toHaveText('Log in');

  const termsOfServiceLink = page.locator('a[href="/terms-of-service"]');
  await expect(termsOfServiceLink).toBeVisible();
  await expect(termsOfServiceLink).toHaveText('Terms of Service');

  const privacyPolicyLink = page.locator('a[href="/privacy-policy"]');
  await expect(privacyPolicyLink).toBeVisible();
  await expect(privacyPolicyLink).toHaveText('Privacy Policy');

  const consentText = page.getByText(
    'By creating an account, you agree to our Terms of Service and Privacy Policy.'
  );
  await expect(consentText).toBeVisible();
});

test('existing email signup attempt', async ({ page }) => {
  await page.getByLabel('First name').fill(userAccounts.existing.firstName);
  await page.getByLabel('Last name').fill(userAccounts.existing.lastName);
  await page.getByLabel('Email').fill(userAccounts.existing.email);
  await page
    .getByLabel('Password', { exact: true })
    .fill(userAccounts.existing.password);

  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(
    page.getByText('An account with this email already exists')
  ).toBeVisible();
});

test('successful signup for a first timer', async ({ page }) => {
  await page.getByLabel('First name').fill(userAccounts.firstTimer.firstName);
  await page.getByLabel('Last name').fill(userAccounts.firstTimer.lastName);
  await page.getByLabel('Email').fill(userAccounts.firstTimer.email);
  await page
    .getByLabel('Password', { exact: true })
    .fill(userAccounts.existing.password);

  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page).toHaveURL(/signup\?success=true/);

  await expect(
    page.getByText(/Account created successfully/i).first()
  ).toBeVisible();
  await expect(
    page.getByText(/Please check your email for a verification link/i)
  ).toBeVisible();

  const emailSubject = 'Action Required: Verify Your Email Address';

  const emailBody = await emailBodyParser.fetch({
    email: userAccounts.firstTimer.email,
    subject: emailSubject,
  });

  const [verificationLink] = await emailBodyParser.getLinks(
    emailBody,
    'Verify Email'
  );

  expect(verificationLink).not.toBeUndefined();
  expect(verificationLink).not.toBeNull();

  await page.goto(verificationLink!.url);
  await page.waitForLoadState('domcontentloaded');

  await expect(page).toHaveURL(/dashboard/);
});
