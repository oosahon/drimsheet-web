import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/shared/components/pagination';
import { type IPaginationResponseMeta } from '@/shared/lib/api/Api';

export interface TablePaginationProps {
  meta: IPaginationResponseMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({
  meta,
  onPageChange,
  className,
}: Readonly<TablePaginationProps>) {
  const { page, totalPages } = meta;

  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className={className}>
      <PaginationContent>
        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(p);
              }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
