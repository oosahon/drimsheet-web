import { cn } from '@/shared/lib/cn';
import { dateUtils } from '@/shared/lib/date';

interface FormattedDateProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: Date;
  countryCode?: string;
}

function FormattedDate({
  value,
  className,
  countryCode,
  ...props
}: Readonly<FormattedDateProps>) {
  return (
    <span
      className={cn('text-xs text-muted-foreground font-medium', className)}
      {...props}
    >
      {dateUtils.formatWithJurisdiction(value, countryCode)}
    </span>
  );
}

export { FormattedDate };
