import { AccountingEntityAvatar } from '@/user/components/accounting-entity-avatar';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('AccountingEntityAvatar', () => {
  it.each([
    ['Drimsheet', 'DR'],
    ['  Drimsheet   Limited  ', 'DL'],
    ['Freelancer', 'FR'],
    ['', '?'],
    ['   ', '?'],
  ])('renders initials for %j', (name, expected) => {
    render(<AccountingEntityAvatar name={name} />);

    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
