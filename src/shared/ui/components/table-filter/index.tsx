import { Check, Filter, Search, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/shared/ui/components/button';
import { Input } from '@/shared/ui/components/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/components/popover';
import { cn } from '@/shared/ui/components/utils';

export interface TableFilterOption {
  label: string;
  value: string | number;
}

export interface TableFilterProps {
  title?: string;
  options: TableFilterOption[];
  selectedValues: (string | number)[];
  onSelect: (value: string | number) => void;
  onClear: () => void;
  onSelectAll?: (values: (string | number)[]) => void;
  trigger?: React.ReactNode;
}

export function TableFilter({
  title,
  options,
  selectedValues,
  onSelect,
  onClear,
  onSelectAll,
  trigger,
}: TableFilterProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const handleSelectAll = React.useCallback(() => {
    const allOptionValues = filteredOptions.map((option) => option.value);
    if (onSelectAll) {
      onSelectAll(allOptionValues);
    } else {
      // Default: select all filtered options
      filteredOptions.forEach((option) => {
        if (!selectedValues.includes(option.value)) {
          onSelect(option.value);
        }
      });
    }
  }, [filteredOptions, selectedValues, onSelect, onSelectAll]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="xs"
            className={cn(
              'h-7 px-2 text-muted-foreground hover:text-foreground relative group/filter-btn',
              selectedValues.length > 0 &&
                'text-primary bg-primary/10 hover:bg-primary/20 dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30'
            )}
            data-testid="table-filter-trigger"
          >
            <Filter className="size-3.5 shrink-0" />
            {selectedValues.length > 0 && (
              <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in-50 duration-200">
                {selectedValues.length}
              </span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-60 p-0 flex flex-col overflow-hidden border border-border bg-popover text-popover-foreground shadow-lg rounded-xl animate-in fade-in-50 zoom-in-95 duration-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-foreground">
            Filter {title ? `by ${title}` : ''}
          </span>
          {selectedValues.length > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={onClear}
              className="h-6 px-1.5 text-xs text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 font-medium transition-colors"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Search Input */}
        {options.length > 5 && (
          <div className="p-2 border-b border-border flex items-center gap-1.5 relative bg-muted/10">
            <Search className="size-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-7 text-xs bg-background border-input focus-visible:ring-primary/20 rounded-lg w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-full p-0.5 hover:bg-muted transition-all"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        )}

        {/* Options List */}
        <div className="max-h-48 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
          {filteredOptions.length === 0 ? (
            <div className="text-center py-4 px-2 text-xs text-muted-foreground italic">
              No results found
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isChecked = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => onSelect(option.value)}
                  className={cn(
                    'w-full flex items-center justify-between text-left text-xs px-2.5 py-2 rounded-lg hover:bg-muted transition-all duration-150 font-medium group/option',
                    isChecked
                      ? 'text-foreground bg-muted/60'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="truncate pr-2">{option.label}</span>
                  <div
                    className={cn(
                      'flex size-4 items-center justify-center rounded border transition-all duration-200 shrink-0',
                      isChecked
                        ? 'border-primary bg-primary text-primary-foreground scale-100'
                        : 'border-input group-hover/option:border-muted-foreground scale-95'
                    )}
                  >
                    {isChecked && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-t border-border bg-muted/20">
          <Button
            variant="outline"
            size="xs"
            onClick={handleSelectAll}
            className="flex-1 h-7 text-xs font-semibold rounded-lg bg-background hover:bg-muted"
          >
            Select All
          </Button>
          {selectedValues.length > 0 && (
            <Button
              variant="outline"
              size="xs"
              onClick={onClear}
              className="flex-1 h-7 text-xs font-semibold rounded-lg border-destructive/20 text-destructive bg-background hover:bg-destructive/5 hover:border-destructive/30"
            >
              Clear All
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
