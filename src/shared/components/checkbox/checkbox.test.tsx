import { Checkbox } from '@/shared/components/checkbox';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('Checkbox', () => {
  it('reports and displays its checked state when selected', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <>
        <Checkbox id="terms" onCheckedChange={onCheckedChange} />
        <label htmlFor="terms">Accept terms and conditions</label>
      </>
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'Accept terms and conditions',
    });

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
