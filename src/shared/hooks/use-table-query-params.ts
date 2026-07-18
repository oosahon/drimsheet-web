import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UseTableQueryParamsOptions<
  TFilterKeys extends string = string,
> {
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  filterKeys?: TFilterKeys[];
}

export function useTableQueryParams<
  TSortKey extends string = string,
  TFilterKeys extends string = string,
>(options: UseTableQueryParamsOptions<TFilterKeys> = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;
  const sortKey = (searchParams.get('sort') || options.defaultSortKey) as
    | TSortKey
    | undefined;
  const sortDirection =
    (searchParams.get('order') as 'asc' | 'desc' | null) ||
    options.defaultSortDirection ||
    null;

  const filters = useMemo(() => {
    const result: Record<string, (string | number)[]> = {};
    if (options.filterKeys) {
      for (const key of options.filterKeys) {
        const val = searchParams.get(key);
        if (val) {
          result[key] = val.split(',');
        }
      }
    }
    return result;
  }, [searchParams, options.filterKeys]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) {
            next.set('q', value);
          } else {
            next.delete('q');
          }
          next.set('page', '1');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newPage > 1) {
            next.set('page', String(newPage));
          } else {
            next.delete('page');
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleSortChange = useCallback(
    (key: string, direction: 'asc' | 'desc' | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (key && direction) {
            next.set('sort', key);
            next.set('order', direction);
          } else {
            next.delete('sort');
            next.delete('order');
          }
          next.set('page', '1');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleFilterChange = useCallback(
    (newFilters: Record<string, (string | number)[]>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (options.filterKeys) {
            for (const key of options.filterKeys) {
              const val = newFilters[key];
              if (val && val.length > 0) {
                next.set(key, val.join(','));
              } else {
                next.delete(key);
              }
            }
          }
          next.set('page', '1');
          return next;
        },
        { replace: true }
      );
    },
    [options.filterKeys, setSearchParams]
  );

  return {
    searchQuery,
    page,
    sortKey,
    sortDirection,
    filters,
    handleSearchChange,
    handlePageChange,
    handleSortChange,
    handleFilterChange,
  };
}
