import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertCircleIcon } from 'lucide-react';

const meta = {
  title: 'Shared UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <div className="flex gap-2">
        <AlertCircleIcon className="h-4 w-4" />
        <div>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the cli.
          </AlertDescription>
        </div>
      </div>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
  render: (args) => (
    <Alert {...args}>
      <div className="flex gap-2">
        <AlertCircleIcon className="h-4 w-4" />
        <div>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </div>
      </div>
    </Alert>
  ),
};
