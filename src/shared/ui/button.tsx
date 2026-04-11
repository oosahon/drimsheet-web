import { type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { buttonVariants } from '@/shared/ui/button-variants';
import { cn } from '@/shared/ui/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  children,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        <Slot.Slottable>{children}</Slot.Slottable>
      </Slot.Root>
    );
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      disabled={loading}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </button>
  );
}
