import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AccountingEntityTypeSelect } from './accounting-entity-type-select';

describe('AccountingEntityTypeSelect', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn(
      () => false
    ) as unknown as typeof window.HTMLElement.prototype.hasPointerCapture;
    window.HTMLElement.prototype.releasePointerCapture =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.releasePointerCapture;
    window.HTMLElement.prototype.setPointerCapture =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.setPointerCapture;
    window.HTMLElement.prototype.scrollIntoView =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.scrollIntoView;
  });

  it('renders correctly with default state', () => {
    const onChange = vi.fn();
    render(<AccountingEntityTypeSelect value="" onChange={onChange} />);

    expect(screen.getByText('Who is this account for?')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Who is this account for?' })
    ).toBeInTheDocument();
  });

  it('opens the select and chooses an entity', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AccountingEntityTypeSelect value="" onChange={onChange} />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Option should be visible
    const option = await screen.findByRole('option', {
      name: /An Individual/i,
    });
    expect(option).toBeInTheDocument();

    await user.click(option);

    expect(onChange).toHaveBeenCalledWith('individual');
  });

  it('displays an error when error prop is provided', () => {
    const onChange = vi.fn();
    render(
      <AccountingEntityTypeSelect
        value=""
        onChange={onChange}
        error={[{ message: 'Entity is required' }]}
      />
    );

    expect(screen.getByText('Entity is required')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
      'Entity is required'
    );
  });

  it('marks unsupported entity types as unavailable', async () => {
    const user = userEvent.setup();
    render(<AccountingEntityTypeSelect value="" onChange={vi.fn()} />);

    await user.click(screen.getByRole('combobox'));

    expect(
      screen.getByRole('option', { name: /Sole Proprietorship/ })
    ).toHaveAttribute('data-disabled');
    expect(screen.getByRole('option', { name: /Company/ })).toHaveAttribute(
      'data-disabled'
    );
  });
});
