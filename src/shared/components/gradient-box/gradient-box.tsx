import { cn } from '@/shared/lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const gradientBoxVariants = cva(
  'group relative z-0 overflow-hidden rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-inner hover:brightness-110',
  {
    variants: {
      variant: {
        primary:
          'text-primary-foreground bg-linear-to-br from-primary to-brand-primary',

        success: 'text-background bg-linear-to-br from-success to-info',

        info: 'text-background bg-linear-to-br from-info to-primary',

        warning: 'text-background bg-linear-to-br from-warning to-chart-3',

        danger: 'text-background bg-linear-to-br from-error to-destructive',

        grey: 'text-secondary-foreground bg-linear-to-br from-muted to-secondary',
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
