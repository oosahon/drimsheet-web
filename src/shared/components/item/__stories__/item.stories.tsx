import { Button } from '@/shared/components/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/shared/components/item';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Mail, Settings, User } from 'lucide-react';

const meta = {
  title: 'Shared UI/Item',
  component: Item,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[450px] p-8 bg-background border border-border rounded-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Item {...args}>
      <ItemMedia variant="icon">
        <User />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>User Profile</ItemTitle>
        <ItemDescription>
          Manage your user settings and profile details.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="icon-sm" variant="ghost">
          <Settings />
        </Button>
      </ItemActions>
    </Item>
  ),
};

export const ItemList: Story = {
  render: () => (
    <ItemGroup data-size="default">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Mail />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Inbox</ItemTitle>
          <ItemDescription>
            Check your latest incoming transactions and messages.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon-sm">
            <ArrowRight />
          </Button>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Settings />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>System Configuration</ItemTitle>
          <ItemDescription>
            Customize global application settings.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon-sm">
            <ArrowRight />
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
};
