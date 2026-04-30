import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Field, FieldError } from '@/shared/ui/field';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { formatDateWithJurisdiction } from '@/shared/utils/date';
import { Calendar1 } from 'lucide-react';
import { useState } from 'react';

interface FiscalDateSelectProps {
  label: string;
  value: Date | null | undefined;
  onChange: (value: Date) => void;
  error?: string;
  countryCode?: string;
}

function FiscalDateSelect({
  label,
  value,
  onChange,
  error,
  countryCode,
}: FiscalDateSelectProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const displayValue = value
    ? formatDateWithJurisdiction(value, countryCode)
    : 'Select a date';

  const selectedDate = value ? value : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setShowCalendar(false);
    }
  };

  return (
    <Field>
      <Label>{label}</Label>
      <Popover open={showCalendar} onOpenChange={setShowCalendar}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={
              'w-full justify-start text-left font-normal ' +
              (!value ? 'text-muted-foreground' : '')
            }
          >
            <Calendar1 className="mr-2 h-4 w-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate}
            formatters={{
              formatMonthCaption: (date) =>
                date.toLocaleString(undefined, {
                  month: 'long',
                  year: 'numeric',
                }),
            }}
          />
        </PopoverContent>
      </Popover>
      <FieldError errors={error ? [{ message: error }] : undefined} />
    </Field>
  );
}

export { FiscalDateSelect, type FiscalDateSelectProps };
