import { cn } from '@/shared/lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const gradientBoxVariants = cva(
  'group relative z-0 overflow-hidden rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-inner hover:brightness-110',
  {
    variants: {
      variant: {
        // Primary: Deep Purple to Gray
        primary: 'text-white bg-linear-to-br from-[#8E33FF] to-gray-600',

        // Success: Emerald Green to Teal
        success: 'text-white bg-linear-to-br from-[#10B981] to-teal-600',

        // Info: Sky Blue to Indigo
        info: 'text-white bg-linear-to-br from-[#4DA3FF] to-indigo-600',

        // Warning: Bright Yellow to Orange
        warning: 'text-gray-900 bg-linear-to-br from-[#FFD60A] to-orange-500',

        // Danger: Bright Red to Rose
        danger: 'text-white bg-linear-to-br from-[#FF4C4C] to-rose-600',

        // Grey: Dark Slate
        grey: 'text-[#A6C3E0] bg-linear-to-br from-[#212B36] to-[#1C252E]',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export interface GradientBoxProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gradientBoxVariants> {}

export function GradientBox({
  className,
  variant,
  ...props
}: Readonly<GradientBoxProps>) {
  return (
    <div
      className={cn(gradientBoxVariants({ variant }), className)}
      {...props}
    />
  );
}
