import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Field, FieldError } from '@/shared/ui/field';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { formatFiscalDate } from '@/shared/utils/date';
import { Calendar1 } from 'lucide-react';
import { useState } from 'react';

interface FiscalYearStartSelectProps {
  value: { month: number; day: number };
  onChange: (value: { month: number; day: number }) => void;
  error?: string;
}

function FiscalYearStartSelect({
  value,
  onChange,
  error,
}: FiscalYearStartSelectProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const displayValue = value
    ? formatFiscalDate(value.month, value.day)
    : 'Select a financial start date';
  const selectedDate = value
    ? new Date(2024, value.month - 1, value.day)
    : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange({ month: date.getMonth() + 1, day: date.getDate() });
      setShowCalendar(false);
    }
  };

  return (
    <Field>
      <Label>When does your financial year start?</Label>
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
                date.toLocaleString(undefined, { month: 'long' }),
            }}
          />
        </PopoverContent>
      </Popover>
      <FieldError errors={error ? [{ message: error }] : undefined} />
    </Field>
  );
}

export { FiscalYearStartSelect, type FiscalYearStartSelectProps };
