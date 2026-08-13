import { useAccountingEntities } from '@/accounting/hooks/use-accounting-entities';
import { useAccountingEntity } from '@/accounting/hooks/use-accounting-entity';
import type {
  IAccountingEntity,
  IUserProfileDto,
  TEntityId,
} from '@/shared/lib/api/Api';
import { AccountingEntityAvatarContainer } from '@/user/components/accounting-entity-avatar';
import { useProfile } from '@/user/hooks/use-profile';
import type { UseQueryResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/accounting/dialogs/accounting-entity-creation', () => ({
  AccountingEntityCreationDialog: ({ open }: { open: boolean }) => (
    <div data-testid="accounting-entity-creation-dialog" data-open={open} />
  ),
}));

vi.mock('@/accounting/hooks/use-accounting-entities', () => ({
  useAccountingEntities: vi.fn(),
}));

vi.mock('@/accounting/hooks/use-accounting-entity', () => ({
  useAccountingEntity: vi.fn(),
}));

vi.mock('@/accounting/hooks/use-switch-accounting-entity', () => ({
  useSwitchAccountingEntity: () => ({ mutateAsync: vi.fn() }),
}));

vi.mock('@/user/hooks/use-profile', () => ({
  useProfile: vi.fn(),
}));

const timestamp = '2026-01-01T00:00:00.000Z';

const firstEntity = {
  id: '00000000-0000-4000-8000-000000000001' as TEntityId,
  name: 'First Account',
  type: 'individual',
  ownerId: '00000000-0000-4000-8000-000000000100' as TEntityId,
  functionalCurrencyCode: 'NGN',
  jurisdictionCode: 'NG',
  createdAt: timestamp,
  updatedAt: timestamp,
} satisfies IAccountingEntity;

const activeEntity = {
  ...firstEntity,
  id: '00000000-0000-4000-8000-000000000002' as TEntityId,
  name: 'Purple Ledger',
  type: 'private_company',
} satisfies IAccountingEntity;

const profile = {
  id: firstEntity.ownerId,
  email: 'member@example.com',
  emailVerified: true,
  firstName: 'Purple',
  lastName: 'Member',
  createdAt: timestamp,
  updatedAt: timestamp,
} satisfies IUserProfileDto;

function mockEntities(
  data: IAccountingEntity[] | undefined,
  isLoading = false
) {
  vi.mocked(useAccountingEntities).mockReturnValue({
    data,
    isLoading,
  } as unknown as UseQueryResult<IAccountingEntity[], Error>);
}

function mockProfile(isLoading = false) {
  vi.mocked(useProfile).mockReturnValue({
    data: profile,
    isLoading,
  } as unknown as UseQueryResult<IUserProfileDto, Error>);
}

function mockActiveEntity(
  data: IAccountingEntity | undefined,
  isLoading = false
) {
  vi.mocked(useAccountingEntity).mockReturnValue({
    data,
    isLoading,
  } as unknown as UseQueryResult<IAccountingEntity, Error>);
}

describe('AccountingEntityAvatarContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProfile();
    mockActiveEntity(undefined);
  });

  it('renders the active accounting entity returned by the API', async () => {
    const user = userEvent.setup();
    mockEntities([firstEntity, activeEntity]);
    mockActiveEntity(activeEntity);

    render(<AccountingEntityAvatarContainer onLogoutClick={() => {}} />);

    const trigger = screen.getByRole('button', {
      name: 'Open account management for Purple Ledger',
    });
    expect(trigger).toHaveTextContent('PL');

    await user.click(trigger);

    const dialog = await screen.findByRole('dialog', {
      name: 'Account management',
    });
    expect(dialog).toHaveTextContent('Purple Ledger');
    expect(dialog).toHaveTextContent('member@example.com');
    expect(dialog).toHaveTextContent('Private company');
    expect(dialog).toHaveTextContent('First Account');
  });

  it('renders the active entity independently of list order', () => {
    mockEntities([firstEntity, activeEntity]);
    mockActiveEntity(firstEntity);

    render(<AccountingEntityAvatarContainer onLogoutClick={() => {}} />);

    expect(
      screen.getByRole('button', {
        name: 'Open account management for First Account',
      })
    ).toHaveTextContent('FA');
  });

  it('renders an accessible loading state while account data loads', () => {
    mockEntities([firstEntity, activeEntity]);
    mockActiveEntity(undefined, true);

    render(<AccountingEntityAvatarContainer onLogoutClick={() => {}} />);

    expect(
      screen.getByRole('status', { name: 'Loading account management' })
    ).toBeInTheDocument();
  });

  it('disables account management when the user has no accounting entity', () => {
    mockEntities([]);

    render(<AccountingEntityAvatarContainer onLogoutClick={() => {}} />);

    expect(
      screen.getByRole('button', { name: 'Account management unavailable' })
    ).toBeDisabled();
  });
});
