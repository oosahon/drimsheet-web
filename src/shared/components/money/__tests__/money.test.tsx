import { Money } from '@/shared/components/money';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Money', () => {
  it('hides zero minor units by default', () => {
    render(
      <Money
        localCode="US"
        value={{ amount: 123400, currencyCode: 'USD', isMinorUnit: true }}
      />
    );

    expect(screen.getByText('US$1,234')).toBeInTheDocument();
  });

  it('shows zero minor units when explicitly requested', () => {
    render(
      <Money
        localCode="US"
        hideZeroMinorUnit={false}
        value={{ amount: 123400, currencyCode: 'USD', isMinorUnit: true }}
      />
    );

    expect(screen.getByText('US$1,234.00')).toBeInTheDocument();
  });

  it('keeps non-zero minor units with the default formatting', () => {
    render(
      <Money
        localCode="US"
        value={{ amount: 123450, currencyCode: 'USD', isMinorUnit: true }}
      />
    );

    expect(screen.getByText('US$1,234.50')).toBeInTheDocument();
  });
});
