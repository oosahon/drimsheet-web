import { AccountingEntityOnboardingForm } from '@/onboarding/ui/accounting-entity-form';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Onboarding/AccountingEntityOnboardingForm',
  component: AccountingEntityOnboardingForm,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="p-4 max-w-sm mx-auto">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onSubmit: () => {} },
} satisfies Meta<typeof AccountingEntityOnboardingForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
