import { FiscalYearStartSelect } from '@/accounting/ui/fiscal-year-start-select';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

describe('FiscalYearStartSelect', () => {
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

  it('renders correctly with no initial value', () => {
    const onChange = vi.fn();
    render(
      <FiscalYearStartSelect
        value={undefined as unknown as { month: number; day: number }}
        onChange={onChange}
      />
    );

    expect(
      screen.getByText('When does your financial year start?')
    ).toBeInTheDocument();
  });

  it('renders correctly with an initial value', () => {
    const onChange = vi.fn();
    render(
      <FiscalYearStartSelect
        value={{ month: 4, day: 15 }}
        onChange={onChange}
      />
    );

    // formatFiscalDate returns something like "April 15th"
    expect(
      screen.getByRole('button', { name: /April 15/i })
    ).toBeInTheDocument();
  });

  it('opens the calendar and selects a date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FiscalYearStartSelect value={{ month: 1, day: 1 }} onChange={onChange} />
    );

    const trigger = screen.getByRole('button', { name: /January 1/i });
    await user.click(trigger);

    // The calendar should be visible, let's select a different day in the current month (January)
    const day15 = screen.getByText('15');
    await user.click(day15);

    expect(onChange).toHaveBeenCalledWith({ month: 1, day: 15 });
  });

  it('displays an error when error prop is provided', () => {
    const onChange = vi.fn();
    render(
      <FiscalYearStartSelect
        value={{ month: 1, day: 1 }}
        onChange={onChange}
        error="Date is required"
      />
    );

    expect(screen.getByText('Date is required')).toBeInTheDocument();
  });
});
