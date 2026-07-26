import { useAccountingEntities } from '@/accounting/hooks/use-accounting-entities';
import { OnboardingManagerContainer } from '@/onboarding/components/onboarding-manager';
import type { IAccountingEntity } from '@/shared/lib/api/Api';
import type { UseQueryResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/accounting/dialogs/accounting-entity-creation', () => {
  return {
    __esModule: true,
    AccountingEntityCreationDialog: ({
      open,
    }: {
      open: boolean;
      done: () => void;
    }) => <div data-testid="accounting-onboarding-form" data-open={open} />,
  };
});

vi.mock('@/accounting/hooks/use-accounting-entities', () => {
  return {
    __esModule: true,
    useAccountingEntities: vi.fn(),
  };
});

describe('OnboardingManagerContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when entities are loading', () => {
    vi.mocked(useAccountingEntities).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as UseQueryResult<IAccountingEntity[], Error>);

    const { container } = render(<OnboardingManagerContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('opens AccountingEntityCreationDialog when loading completes and entities are empty', () => {
    vi.mocked(useAccountingEntities).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as UseQueryResult<IAccountingEntity[], Error>);

    render(<OnboardingManagerContainer />);

    const form = screen.getByTestId('accounting-onboarding-form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('data-open', 'true');
  });

  it('does not open AccountingEntityCreationDialog when loading completes and entities exist', () => {
    vi.mocked(useAccountingEntities).mockReturnValue({
      data: [{ id: 'entity-1', name: 'My Entity' }],
      isLoading: false,
    } as unknown as UseQueryResult<IAccountingEntity[], Error>);

    render(<OnboardingManagerContainer />);

    const form = screen.getByTestId('accounting-onboarding-form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('data-open', 'false');
  });
});
