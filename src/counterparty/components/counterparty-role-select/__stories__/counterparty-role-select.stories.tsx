import { CounterpartyRoleSelect } from '@/counterparty/components/counterparty-role-select';
import { ECounterpartyRole } from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Counterparty/CounterpartyRoleSelect',
  component: CounterpartyRoleSelect,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[min(32rem,calc(100vw-2rem))]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
  args: {
    onSubmit: () => {},
  },
} satisfies Meta<typeof CounterpartyRoleSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const PreselectedDefault: Story = {
  args: {
    defaultValue: 'default',
  },
};

export const PreselectedEmployer: Story = {
  args: {
    defaultValue: ECounterpartyRole.Employer,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: ECounterpartyRole.Vendor,
  },
};
