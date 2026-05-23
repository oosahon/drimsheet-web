import { TableFilter } from '@/shared/ui/components/table-filter';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

const meta = {
  title: 'Shared UI/TableFilter',
  component: TableFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[300px] h-[350px] flex items-start justify-center p-8 bg-background border border-border rounded-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

const MOCK_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Archived', value: 'archived' },
  { label: 'Draft', value: 'draft' },
];

export const Interactive: Story = {
  render: (args) => {
    const [selectedValues, setSelectedValues] = React.useState<
      (string | number)[]
    >([]);

    const handleSelect = (val: string | number) => {
      setSelectedValues((prev) =>
        prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
      );
    };

    const handleClear = () => {
      setSelectedValues([]);
    };

    const handleSelectAll = (vals: (string | number)[]) => {
      setSelectedValues(vals);
    };

    return (
      <TableFilter
        {...args}
        selectedValues={selectedValues}
        onSelect={handleSelect}
        onClear={handleClear}
        onSelectAll={handleSelectAll}
      />
    );
  },
  args: {
    title: 'Status',
    options: MOCK_OPTIONS,
    selectedValues: [],
    onSelect: () => {},
    onClear: () => {},
  },
};

export const Default: Story = {
  args: {
    title: 'Status',
    options: MOCK_OPTIONS.slice(0, 3),
    selectedValues: [],
    onSelect: () => {},
    onClear: () => {},
  },
};

export const WithSelected: Story = {
  args: {
    title: 'Status',
    options: MOCK_OPTIONS,
    selectedValues: ['active', 'completed'],
    onSelect: () => {},
    onClear: () => {},
  },
};
