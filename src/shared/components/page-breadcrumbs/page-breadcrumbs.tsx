import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/breadcrumb';
import { Skeleton } from '@/shared/components/skeleton';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export interface IPageBreadcrumb {
  label: string;
  link?: string;
  next?: IPageBreadcrumb;
}

export interface PageBreadcrumbsProps {
  breadcrumb: IPageBreadcrumb;
  isLoading?: boolean;
}

function flattenBreadcrumb(breadcrumb: IPageBreadcrumb) {
  const breadcrumbs: IPageBreadcrumb[] = [];
  let current: IPageBreadcrumb | undefined = breadcrumb;

  while (current) {
    breadcrumbs.push(current);
    current = current.next;
  }

  return breadcrumbs;
}

function isHashLink(link: string) {
  return link.startsWith('#');
}

export function PageBreadcrumbs({
  breadcrumb,
  isLoading,
}: Readonly<PageBreadcrumbsProps>) {
  if (isLoading) {
    return <Skeleton className="w-25 h-3" />;
  }

  const breadcrumbs = flattenBreadcrumb(breadcrumb);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <Fragment key={`${crumb.label}-${index}`}>
              <BreadcrumbItem>
                {crumb.link ? (
                  <BreadcrumbLink asChild>
                    {isHashLink(crumb.link) ? (
                      <a href={crumb.link}>{crumb.label}</a>
                    ) : (
                      <Link to={crumb.link}>{crumb.label}</Link>
                    )}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage aria-current={isLast ? 'page' : undefined}>
                    {crumb.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
