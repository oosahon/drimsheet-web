import { InflowFormSkeleton } from '@/journal-entries/components/inflow-form';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('InflowFormSkeleton', () => {
  it('announces the translated loading state', () => {
    render(<InflowFormSkeleton />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading inflow form');
  });
});
