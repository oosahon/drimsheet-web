import { JournalEntryNotFound } from '@/journal-entries/components/journal-entry-not-found';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Journal Entries/JournalEntryNotFound',
  component: JournalEntryNotFound,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onBack: () => undefined,
  },
} satisfies Meta<typeof JournalEntryNotFound>;

export default meta;
type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};
