import type { Meta, StoryObj } from '@storybook/react-vite';
import { CounterpartyTypeSelect } from './counterparty-type-select';

const meta = {
  title: 'Counterparty/CounterpartyTypeSelect',
  component: CounterpartyTypeSelect,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[min(32rem,calc(100vw-2rem))]">
        <Story />
      </div>
    ),
  ],
  args: {
    value: '',
    onChange: () => {},
  },
} satisfies Meta<typeof CounterpartyTypeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const PrefilledIndividual: Story = {
  args: {
    value: 'individual',
  },
};

export const PrefilledOrganization: Story = {
  args: {
    value: 'organization',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'individual',
  },
};

export const WithError: Story = {
  args: {
    value: '',
    error: [{ message: 'Type is required' }],
  },
};
