import { expect, test } from '@playwright/test';
import { userAccounts } from '../../config/accounts.config';
import emailBodyParser from '../../helpers/email-body-parser.helper';

test.describe.serial('password reset flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password');
  });

  test('link from sign in stage', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await expect(page).toHaveURL('/auth/forgot-password');
  });

  test('non-existing account receives no email', async ({ page }) => {
    const fakeEmail = `definitely.not.there@mailinator.com`;
    await page.getByLabel('Email').fill(fakeEmail);
    await page.getByRole('button', { name: 'Get password reset link' }).click();
    await expect(
      page.getByText('A password reset link was sent to your email.')
    ).toBeVisible();

    const emailBody = await emailBodyParser.fetch({
      email: fakeEmail,
      subject: 'Reset your password',
    });

    expect(emailBody).toBeNull();
  });

  test('existing account receives email', async ({ page }) => {
    const { email } = userAccounts.existing;
    await page.getByLabel('Email').fill(email);
    await page.getByRole('button', { name: 'Get password reset link' }).click();
    await expect(
      page.getByText('A password reset link was sent to your email.')
    ).toBeVisible();
  });

  test('reset password with valid token', async ({ page }) => {
    const { email } = userAccounts.existing;
    const emailBody = await emailBodyParser.fetch({
      email,
      subject: 'Reset your password',
    });
    const [link] = await emailBodyParser.getLinks(emailBody, 'Reset password');
    await page.goto(link!.url);
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/auth\/reset-password/);

    await page
      .locator('input[name="password"]')
      .fill(userAccounts.existing.password);
    await page
      .locator('input[name="confirmPassword"]')
      .fill(userAccounts.existing.password);

    await page.getByRole('button', { name: 'Reset password' }).click();

    await expect(page).toHaveURL(/dashboard/);
  });

  test('reset password link expires after use', async ({ page }) => {
    const { email } = userAccounts.existing;
    const emailBody = await emailBodyParser.fetch({
      email,
      subject: 'Reset your password',
    });
    const [link] = await emailBodyParser.getLinks(emailBody, 'Reset password');
    await page.goto(link!.url);
    await page.waitForLoadState('domcontentloaded');

    await page.locator('input[name="password"]').fill('NewPassword123!');
    await page.locator('input[name="confirmPassword"]').fill('NewPassword123!');

    await page.getByRole('button', { name: 'Reset password' }).click();

    await expect(
      page.getByText('Invalid or expired password reset token')
    ).toBeVisible();
  });
});
