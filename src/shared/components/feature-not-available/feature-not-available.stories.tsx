import type { Meta, StoryObj } from '@storybook/react-vite';

import { FeatureNotAvailable } from '.';

const meta = {
  title: 'Shared UI/FeatureNotAvailable',
  component: FeatureNotAvailable,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FeatureNotAvailable>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const NarrowViewport: TStory = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
