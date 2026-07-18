import { cva } from 'class-variance-authority';

export const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold border transition-colors w-fit shrink-0',
  {
    variants: {
      variant: {
        success: 'bg-success/10 text-success border-success/20',
        info: 'bg-info/10 text-info border-info/20',
        warning: 'bg-warning/10 text-warning border-warning/20',
        error: 'bg-error/10 text-error border-error/20',
        neutral: 'bg-neutral/10 text-neutral border-neutral/20',
        primary: 'bg-primary/10 text-primary border-primary/20',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);
