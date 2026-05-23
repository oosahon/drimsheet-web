import _ from 'lodash';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  HelpCircle,
  Inbox,
} from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/components/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/components/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/components/tooltip';
import { cn } from '@/shared/ui/components/utils';
import { useCallback, useMemo } from 'react';
import { TableFilter, type TableFilterOption } from './table-filter';

export interface IDataWithId {
  id: string | number;
}

export type ITableColumn<T extends IDataWithId> = {
  dataIndex: keyof T;
  title?: string;
  span?: number;
  tooltip?: string;
  sortable?: boolean;
  render?: (cellData: unknown, rowData: T) => React.ReactNode;
  headerRender?: (column: ITableColumn<T>) => React.ReactNode;
  renderHeader?: (column: ITableColumn<T>) => React.ReactNode;
  testId?: string;
  hidden?: boolean;
  // Filtering fields
  filterable?: boolean;
  filterOptions?: TableFilterOption[];
  filterValue?: (string | number)[];
  onFilterChange?: (values: (string | number)[]) => void;
};

export interface IStickyProps {
  top?: string | number;
  zIndex?: number;
  className?: string;
}

export interface TableProps<T extends IDataWithId> {
  columns: ITableColumn<T>[];
  data: T[];
  currentSortKey?: string;
  currentSortDirection?: 'asc' | 'desc' | null;
  emptyStateNode?: React.ReactNode;
  loadingStateNode?: React.ReactNode;
  loading?: boolean;
  stickyProps?: IStickyProps;
  responsive?: boolean;
  'data-testid'?: string;
  // Selection
  selectable?: boolean;
  selectedRowIds?: (string | number)[];
  onRowSelectionChange?: (selectedIds: (string | number)[]) => void;
  // External callbacks
  onSortChange?: (key: keyof T, direction: 'asc' | 'desc' | null) => void;
  onFilterChange?: (filters: Record<string, (string | number)[]>) => void;
  className?: string;
  stickyHeader?: boolean;
  filters?: Record<string, (string | number)[]>;
}

export interface TableCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
}

export function TableCheckbox({
  checked = false,
  indeterminate = false,
  onClick,
  'aria-label': ariaLabel,
}: TableCheckboxProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex size-4 mx-auto items-center justify-center rounded border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        checked &&
          'border-primary bg-primary text-primary-foreground scale-100 shadow-xs',
        !checked &&
          indeterminate &&
          'border-primary bg-primary/20 text-primary scale-100',
        !checked &&
          !indeterminate &&
          'border-input hover:border-muted-foreground bg-background scale-95'
      )}
      aria-label={ariaLabel}
    >
      {checked && <Check className="size-2.5 stroke-[3]" />}
      {indeterminate && <div className="size-1.5 bg-primary rounded-xs" />}
    </button>
  );
}

export interface DataTableSkeletonProps {
  columnsCount: number;
  showSelection?: boolean;
  rowsCount?: number;
}

export function DataTableSkeleton({
  columnsCount,
  showSelection = false,
  rowsCount = 5,
}: DataTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowsCount }).map((_, rIdx) => (
        <TableRow key={`skeleton-row-${rIdx}`} className="hover:bg-transparent">
          {showSelection && (
            <TableCell className="w-12 px-3 text-center border-r border-border/20">
              <div className="size-4 mx-auto bg-muted animate-pulse rounded" />
            </TableCell>
          )}
          {Array.from({ length: columnsCount }).map((_, cIdx) => (
            <TableCell
              key={`skeleton-cell-${rIdx}-${cIdx}`}
              className="px-4 py-3"
            >
              <div
                style={{
                  width: `${Math.max(40, 100 - cIdx * 15 - (rIdx % 3) * 10)}%`,
                }}
                className="h-4 bg-muted animate-pulse rounded-md"
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

interface SortIconProps {
  direction: 'asc' | 'desc' | null;
}

function SortIcon({ direction }: SortIconProps) {
  if (direction === 'asc') {
    return (
      <ArrowUp className="size-3.5 text-primary stroke-[2.5] animate-in slide-in-from-bottom-1 duration-150" />
    );
  }
  if (direction === 'desc') {
    return (
      <ArrowDown className="size-3.5 text-primary stroke-[2.5] animate-in slide-in-from-top-1 duration-150" />
    );
  }
  return (
    <ArrowUpDown className="size-3 text-muted-foreground/45 group-hover:text-muted-foreground transition-all duration-150" />
  );
}

export interface WithTooltipProps {
  tooltip?: string;
  children: React.ReactNode;
}

function WithTooltip({ tooltip, children }: WithTooltipProps) {
  if (!tooltip) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dashed border-muted-foreground/40 pb-0.5 inline-flex items-center gap-1 group/tooltip">
          {children}
          <HelpCircle className="size-3 text-muted-foreground/75 group-hover/tooltip:text-muted-foreground transition-colors" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export interface DataTableHeaderCellProps<T extends IDataWithId> {
  column: ITableColumn<T>;
  idx: number;
  currentSortKey?: string;
  currentSortDirection?: 'asc' | 'desc' | null;
  handleSort: (key: keyof T) => void;
  filters?: Record<string, (string | number)[]>;
  onFilterChange?: (filters: Record<string, (string | number)[]>) => void;
  getStickyStyles: (index: number) => React.CSSProperties | undefined;
}

export function DataTableHeaderCell<T extends IDataWithId>({
  column,
  idx,
  currentSortKey,
  currentSortDirection = null,
  handleSort,
  filters,
  onFilterChange,
  getStickyStyles,
}: DataTableHeaderCellProps<T>) {
  const isSorted = currentSortKey === column.dataIndex;
  const sortDir = isSorted ? currentSortDirection : null;

  // Title Content
  const headerContent = column.headerRender
    ? column.headerRender(column)
    : column.renderHeader
      ? column.renderHeader(column)
      : column.title;

  // Memoized filter handlers
  const handleSelectFilter = useCallback(
    (val: string | number) => {
      const currentSelected =
        column.filterValue || filters?.[String(column.dataIndex)] || [];
      const newSelected = currentSelected.includes(val)
        ? currentSelected.filter((v) => v !== val)
        : [...currentSelected, val];

      if (column.onFilterChange) {
        column.onFilterChange(newSelected);
      } else if (onFilterChange) {
        onFilterChange({
          ...(filters || {}),
          [String(column.dataIndex)]: newSelected,
        });
      }
    },
    [column, filters, onFilterChange]
  );

  const handleClearFilter = useCallback(() => {
    if (column.onFilterChange) {
      column.onFilterChange([]);
    } else if (onFilterChange) {
      const newFilters = { ...(filters || {}) };
      delete newFilters[String(column.dataIndex)];
      onFilterChange(newFilters);
    }
  }, [column, filters, onFilterChange]);

  return (
    <TableHead
      style={getStickyStyles(idx + 1)}
      className={cn(
        'h-11 px-4 text-left align-middle font-semibold text-foreground text-xs tracking-wider transition-colors',
        column.sortable && 'select-none cursor-pointer hover:bg-muted/40'
      )}
      onClick={() => column.sortable && handleSort(column.dataIndex)}
      data-testid={column.testId || `column-header-${String(column.dataIndex)}`}
    >
      <div className="flex items-center gap-2">
        <span className="flex-1 truncate">
          <WithTooltip tooltip={column.tooltip}>{headerContent}</WithTooltip>
        </span>

        {/* Sort Controls */}
        {column.sortable && (
          <div className="flex items-center justify-center shrink-0 text-muted-foreground transition-colors">
            <SortIcon direction={sortDir} />
          </div>
        )}

        {/* Filter Controls */}
        {column.filterable && column.filterOptions && (
          <div
            onClick={(e) => e.stopPropagation()} // Stop sorting trigger
            className="shrink-0"
          >
            <TableFilter
              title={column.title}
              options={column.filterOptions}
              selectedValues={
                column.filterValue || filters?.[String(column.dataIndex)] || []
              }
              onSelect={handleSelectFilter}
              onClear={handleClearFilter}
            />
          </div>
        )}
      </div>
    </TableHead>
  );
}

export interface DataTableEmptyStateProps {
  columnsCount: number;
  emptyStateNode?: React.ReactNode;
}

export function DataTableEmptyState({
  columnsCount,
  emptyStateNode,
}: DataTableEmptyStateProps) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columnsCount} className="p-0 border-none">
        <div className="flex w-full items-center justify-center p-8">
          {emptyStateNode || (
            <Empty className="border-none max-w-md my-4">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Inbox className="size-6 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle className="text-foreground">
                  No records found
                </EmptyTitle>
                <EmptyDescription className="text-muted-foreground text-xs">
                  There are no matching items to display. Try adjusting your
                  search query or column filters.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export interface DataTableRowProps<T extends IDataWithId> {
  row: T;
  columns: ITableColumn<T>[];
  selectable?: boolean;
  isSelected?: boolean;
  onSelectRow?: (id: string | number) => void;
}

export function DataTableRow<T extends IDataWithId>({
  row,
  columns,
  selectable = false,
  isSelected = false,
  onSelectRow,
}: DataTableRowProps<T>) {
  return (
    <TableRow
      data-state={isSelected ? 'selected' : undefined}
      className={cn(
        'group/row border-b border-border/50 transition-colors hover:bg-muted/15',
        'odd:bg-muted/5 even:bg-background',
        isSelected && 'bg-primary/5 hover:bg-primary/10 border-primary/20'
      )}
    >
      {selectable && (
        <TableCell className="w-12 px-3 text-center border-r border-border/30">
          <TableCheckbox
            checked={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              onSelectRow?.(row.id);
            }}
            aria-label={
              isSelected ? `Deselect row ${row.id}` : `Select row ${row.id}`
            }
          />
        </TableCell>
      )}
      {columns.map((column) => {
        const cellData = row[column.dataIndex];
        return (
          <TableCell
            key={String(column.dataIndex)}
            className={cn(
              'px-4 py-3 text-sm text-foreground align-middle font-medium truncate max-w-[240px]',
              'transition-all duration-200'
            )}
          >
            {column.render
              ? column.render(cellData, row)
              : cellData !== null && cellData !== undefined
                ? String(cellData)
                : ''}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export function DataTable<T extends IDataWithId>({
  columns,
  data,
  currentSortKey,
  currentSortDirection = null,
  emptyStateNode,
  loadingStateNode,
  loading = false,
  stickyProps,
  responsive = true,
  'data-testid': dataTestId = 'data-table',
  selectable = false,
  selectedRowIds,
  onRowSelectionChange,
  onSortChange,
  onFilterChange,
  className,
  stickyHeader = false,
  filters,
}: TableProps<T>) {
  // Row Selection Set (derived directly from controlled prop)
  const selectedSet = useMemo(
    () => new Set(selectedRowIds || []),
    [selectedRowIds]
  );

  // Get active columns (excluding hidden ones)
  const visibleColumns = useMemo(() => {
    return columns.filter((col) => !col.hidden);
  }, [columns]);

  // Handle row selection
  const handleSelectRow = useCallback(
    (id: string | number) => {
      const newSelection = new Set(selectedRowIds || []);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      onRowSelectionChange?.(Array.from(newSelection));
    },
    [selectedRowIds, onRowSelectionChange]
  );

  // Handle select/deselect all rows
  const handleSelectAll = useCallback(() => {
    const selectedSet = new Set(selectedRowIds || []);
    const allSelected =
      data.length > 0 && data.every((row) => selectedSet.has(row.id));
    let newSelection: Set<string | number>;

    if (allSelected) {
      newSelection = new Set();
    } else {
      newSelection = new Set(data.map((row) => row.id));
    }
    onRowSelectionChange?.(Array.from(newSelection));
  }, [data, selectedRowIds, onRowSelectionChange]);

  // Handle Sorting Toggles
  const handleSort = useCallback(
    (key: keyof T) => {
      let direction: 'asc' | 'desc' | null = 'asc';

      if (currentSortKey === key) {
        if (currentSortDirection === 'asc') {
          direction = 'desc';
        } else if (currentSortDirection === 'desc') {
          direction = null;
        }
      }

      onSortChange?.(key, direction);
    },
    [currentSortKey, currentSortDirection, onSortChange]
  );

  // Header Select All details
  const isAllSelected =
    data.length > 0 && data.every((row) => selectedSet.has(row.id));
  const isSomeSelected =
    data.length > 0 &&
    data.some((row) => selectedSet.has(row.id)) &&
    !isAllSelected;

  // Sticky settings helper
  const getStickyStyles = (index: number) => {
    if (!stickyHeader && _.isEmpty(stickyProps)) return undefined;
    return {
      position: 'sticky' as const,
      top: stickyProps?.top ?? 0,
      zIndex: (stickyProps?.zIndex ?? 10) + index,
    };
  };

  return (
    <div
      className={cn(
        'w-full rounded-xl border border-border bg-background shadow-xs overflow-hidden flex flex-col transition-all duration-300',
        className
      )}
      data-testid={dataTestId}
    >
      <div
        className={cn(
          'w-full',
          responsive && 'relative overflow-x-auto custom-scrollbar'
        )}
      >
        <Table className="border-collapse w-full">
          <TableHeader className="bg-muted/30 border-b border-border">
            <TableRow className="hover:bg-transparent">
              {selectable && (
                <TableHead
                  style={getStickyStyles(0)}
                  className={cn(
                    'w-12 px-3 text-center transition-colors bg-muted/30 border-r border-border/50'
                  )}
                >
                  <TableCheckbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onClick={handleSelectAll}
                    aria-label={
                      isAllSelected ? 'Deselect all rows' : 'Select all rows'
                    }
                  />
                </TableHead>
              )}
              {visibleColumns.map((column, idx) => (
                <DataTableHeaderCell
                  key={String(column.dataIndex)}
                  column={column}
                  idx={idx}
                  currentSortKey={currentSortKey}
                  currentSortDirection={currentSortDirection}
                  handleSort={handleSort}
                  filters={filters}
                  onFilterChange={onFilterChange}
                  getStickyStyles={getStickyStyles}
                />
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              (loadingStateNode || (
                <DataTableSkeleton
                  columnsCount={visibleColumns.length}
                  showSelection={selectable}
                />
              ))}

            {!loading && data.length === 0 && (
              <DataTableEmptyState
                columnsCount={visibleColumns.length + (selectable ? 1 : 0)}
                emptyStateNode={emptyStateNode}
              />
            )}

            {!loading &&
              data.length > 0 &&
              data.map((row) => (
                <DataTableRow
                  key={row.id}
                  row={row}
                  columns={visibleColumns}
                  selectable={selectable}
                  isSelected={selectedSet.has(row.id)}
                  onSelectRow={handleSelectRow}
                />
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
