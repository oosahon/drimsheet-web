import { loginFormValidation } from '@/auth/ui/validations/login-form.validations';
import { describe, expect, it } from 'vitest';

describe('loginFormValidation', () => {
  it('validates a correct form', async () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
    };
    await expect(loginFormValidation.validate(validData)).resolves.toEqual(
      validData
    );
  });

  it('fails when email is missing', async () => {
    const invalidData = {
      password: 'password123',
    };
    await expect(loginFormValidation.validate(invalidData)).rejects.toThrow(
      'Email is required'
    );
  });

  it('fails when email is invalid', async () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'password123',
    };
    await expect(loginFormValidation.validate(invalidData)).rejects.toThrow(
      'Enter a valid email'
    );
  });

  it('fails when password is missing', async () => {
    const invalidData = {
      email: 'test@example.com',
    };
    await expect(loginFormValidation.validate(invalidData)).rejects.toThrow(
      'Password is required'
    );
  });
});
