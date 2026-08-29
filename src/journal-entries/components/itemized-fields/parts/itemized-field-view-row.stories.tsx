import { TooltipProvider } from '@/shared/components/tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ItemizedFieldViewRow } from './itemized-field-view-row';

const meta = {
  title: 'Journal Entries/ItemizedFields/ViewRow',
  component: ItemizedFieldViewRow,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    categoryName: 'Sales revenue',
    disabled: false,
    editDisabled: false,
    index: 0,
    item: {
      id: 'story-row',
      amount: { amount: 1250, currencyCode: 'NGN', isMinorUnit: false },
      accountId: 'sales',
      description: 'Consulting work for August',
    },
    onDelete: () => undefined,
    onEdit: () => undefined,
  },
} satisfies Meta<typeof ItemizedFieldViewRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongDescription: Story = {
  args: {
    item: {
      id: 'long-description-row',
      amount: { amount: 1250, currencyCode: 'NGN', isMinorUnit: false },
      accountId: 'sales',
      description:
        'Consulting work for August covering research, implementation, and final delivery.',
    },
  },
};

export const EditLocked: Story = {
  args: { editDisabled: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
