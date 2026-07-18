import { statusBadgeVariants } from '@/shared/components/status-badge/status-badge-variants';
import { cn } from '@/shared/lib/cn';
import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

export interface StatusBadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  label: string;
  showDot?: boolean;
}

export type TStatusBadgeValue = Pick<StatusBadgeProps, 'variant' | 'label'>;

export function StatusBadge({
  className,
  variant = 'neutral',
  showDot = true,
  label,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    >
      {showDot && (
        <span
          data-testid="status-badge-dot"
          className="h-1.5 w-1.5 rounded-full bg-current shrink-0"
        />
      )}
      {label}
    </span>
  );
}
