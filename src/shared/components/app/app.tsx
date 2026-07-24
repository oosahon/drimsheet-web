import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/shared/components/breadcrumb';
import { SidebarTrigger } from '@/shared/components/sidebar';
import { cn } from '@/shared/lib/utils/cn';
import type { PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

// ==========================================
// 1. AppBody
// ==========================================

export function AppBody({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="flex w-full flex-col gap-15 pt-0 max-w-full">
      {children}
    </div>
  );
}

// ==========================================
// 2. AppHeader
// ==========================================

export interface IBreadCrumb {
  label: string;
  to?: string;
}

export interface AppHeaderProps extends React.ComponentProps<'header'> {
  breadcrumbs?: IBreadCrumb[];
}

export function AppHeader({
  breadcrumbs,
  children,
  className,
  ...props
}: Readonly<AppHeaderProps>) {
  return (
    <header
      {...props}
      className={cn(
        'sticky top-0 py-2 z-10 w-full bg-background pb-4',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-4">
        <SidebarTrigger />
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <Fragment key={index}>
                    <BreadcrumbItem>
                      {isLast || !crumb.to ? (
                        <span className="text-foreground text-sm font-medium">
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          to={crumb.to}
                          className="hover:text-foreground text-muted-foreground transition-colors text-sm font-medium"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        {children}
      </div>
    </header>
  );
}

// ==========================================
// 3. AppHeaderTitle
// ==========================================

export function AppHeaderTitle({
  className,
  ...props
}: Readonly<React.ComponentProps<'h1'>>) {
  return (
    <h1
      {...props}
      className={cn('text-3xl text-primary font-semibold', className)}
    />
  );
}
