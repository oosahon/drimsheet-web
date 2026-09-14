import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/carousel';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[300px] sm:w-[450px] p-12 bg-background border border-border rounded-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="flex aspect-video items-center justify-center p-6 border border-border bg-card rounded-xl">
              <span className="text-3xl font-semibold font-heading text-primary">
                {index + 1}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    opts: {
      align: 'start',
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[250px] flex items-center justify-center bg-background border border-border rounded-2xl p-16">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Carousel {...args} className="w-full max-w-xs">
      <CarouselContent className="-mt-1 h-[150px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="pt-1 basis-1/2">
            <div className="flex h-full items-center justify-center border border-border bg-card rounded-xl p-6">
              <span className="text-xl font-semibold font-heading text-primary">
                Slide {index + 1}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
