import { LoginForm } from '@/auth/ui/login-form';
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
});
