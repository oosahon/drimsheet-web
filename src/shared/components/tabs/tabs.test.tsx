import { Tabs } from '@/shared/components/tabs';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const items = [
  { value: 'inflow', label: 'Inflow' },
  { value: 'outflow', label: 'Outflow' },
  { value: 'transfer', label: 'Transfer' },
];

describe('Tabs', () => {
  it('emits the selected tab value on click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs
        ariaLabel="Transaction type"
        items={items}
        value="inflow"
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('tab', { name: 'Transfer' }));

    expect(onValueChange).toHaveBeenCalledWith('transfer');
  });

  it('moves selection with arrow keys', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs
        ariaLabel="Transaction type"
        items={items}
        value="inflow"
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('tab', { name: 'Inflow' }));
    await user.keyboard('{ArrowRight}');

    expect(onValueChange).toHaveBeenCalledWith('outflow');
  });

  it('moves to the first and last enabled tabs with Home and End', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs
        ariaLabel="Transaction type"
        items={items}
        value="inflow"
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('tab', { name: 'Transfer' }));
    onValueChange.mockClear();
    await user.keyboard('{Home}');
    expect(onValueChange).toHaveBeenLastCalledWith('inflow');

    await user.click(screen.getByRole('tab', { name: 'Inflow' }));
    onValueChange.mockClear();
    await user.keyboard('{End}');
    expect(onValueChange).toHaveBeenLastCalledWith('transfer');
  });
});
