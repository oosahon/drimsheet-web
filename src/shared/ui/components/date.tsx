import dateUtils from '@/shared/utils/date';
import { cn } from './utils';

interface FormattedDateProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: Date;
  countryCode?: string;
}

function FormattedDate({
  value,
  className,
  countryCode,
  ...props
}: FormattedDateProps) {
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
