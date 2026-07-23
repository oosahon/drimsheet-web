import { badgeVariants } from '@/shared/components/badge/badge-variants';
import { cn } from '@/shared/lib/cn';
import { type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: Readonly<
  React.ComponentProps<'span'> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }
>) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
