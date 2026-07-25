import { LoginForm } from '@/auth/components/login-form';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

describe('LoginForm', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <LoginForm onSubmit={vi.fn()} loading={false} />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
  });

  it('shows required validation errors on submit empty', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm onSubmit={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Password is required/i)
    ).toBeInTheDocument();
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm onSubmit={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText(/Enter a valid email/i)).toBeInTheDocument();
  });

  it('accepts valid credentials and calls onSubmit', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <MemoryRouter>
        <LoginForm onSubmit={handleSubmit} loading={false} />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');
    await user.type(screen.getByLabelText(/^Password$/i), 'Valid1Password!');

    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
    });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit.mock.calls[0][0]).toEqual({
      email: 'john.doe@example.com',
      password: 'Valid1Password!',
    });
  });
  it('exposes autocomplete attributes on email and password inputs', () => {
    render(
      <MemoryRouter>
        <LoginForm onSubmit={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toHaveAttribute(
      'autocomplete',
      'email'
    );
    expect(screen.getByLabelText(/^Password$/i)).toHaveAttribute(
      'autocomplete',
      'current-password'
    );
  });

  it('associates validation errors with inputs using aria-invalid and aria-describedby', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm onSubmit={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);

    expect(emailInput).not.toHaveAttribute('aria-invalid');
    expect(emailInput).not.toHaveAttribute('aria-describedby');
    expect(passwordInput).not.toHaveAttribute('aria-invalid');
    expect(passwordInput).not.toHaveAttribute('aria-describedby');

    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    const emailError = await screen.findByText(/Email is required/i);
    const passwordError = await screen.findByText(/Password is required/i);

    expect(emailError).toHaveAttribute('id', 'login-email-error');
    expect(passwordError).toHaveAttribute('id', 'login-password-error');

    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby', 'login-email-error');
    expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    expect(passwordInput).toHaveAttribute(
      'aria-describedby',
      'login-password-error'
    );
  });

  it('clears validation error associations when field becomes valid', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm onSubmit={vi.fn()} loading={false} />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');

    await user.type(emailInput, 'valid.email@example.com');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Email is required/i)).not.toBeInTheDocument();
    });

    expect(emailInput).not.toHaveAttribute('aria-invalid');
    expect(emailInput).not.toHaveAttribute('aria-describedby');
  });

  it('disables controls and prevents submission while loading', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    const { container } = render(
      <MemoryRouter>
        <LoginForm onSubmit={handleSubmit} loading={true} />
      </MemoryRouter>
    );

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('aria-busy', 'true');

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const toggleButton = screen.getByRole('button', { name: /Show password/i });
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(toggleButton).toBeDisabled();
    expect(submitButton).toBeDisabled();

    await user.click(submitButton);
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
