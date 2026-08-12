import { InflowFormSkeleton } from '@/journal-entries/components/inflow-form';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Journal Entries/InflowForm/Skeleton',
  component: InflowFormSkeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof InflowFormSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
