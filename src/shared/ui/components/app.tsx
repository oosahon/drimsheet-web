import { Badge } from '@/shared/ui/components/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/shared/ui/components/breadcrumb';
import { NavConfigurations } from '@/shared/ui/components/nav-configurations';
import { NavMain } from '@/shared/ui/components/nav-main';
import { NavUser } from '@/shared/ui/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from '@/shared/ui/components/sidebar';
import { cn } from '@/shared/ui/components/utils';
import {
  Calculator,
  CircleMinus,
  Landmark,
  LayoutDashboard,
  Tags,
  TrendingDown,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import logoImg from '@/shared/assets/logo.svg';

// ==========================================
// 1. AppBody
// ==========================================

export function AppBody({ children }: PropsWithChildren) {
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
}: AppHeaderProps) {
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
}: React.ComponentProps<'h1'>) {
  return (
    <h1
      {...props}
      className={cn('text-3xl text-primary font-semibold', className)}
    />
  );
}

// ==========================================
// 4. AppSidebar
// ==========================================

const sidebarData = {
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: <LayoutDashboard />,
      isActive: true,
    },
    {
      title: 'Accounts',
      url: '/accounts',
      icon: <Landmark />,
      items: [
        {
          title: 'Bank Accounts',
          url: '/accounts/bank',
        },
        {
          title: 'Petty Cash Accounts',
          url: '/accounts/petty-cash',
        },
      ],
    },
    {
      title: 'Income',
      url: '#',
      icon: <TrendingUp />,
    },
    {
      title: 'Expenses',
      url: '#',
      icon: <TrendingDown />,
    },
    {
      title: 'Liabilities',
      url: '#',
      icon: <CircleMinus />,
    },
  ],
  projects: [
    {
      name: 'Third Parties',
      url: '#',
      icon: <UsersRound />,
    },
    {
      name: 'Categories',
      url: '#',
      icon: <Tags />,
    },
    {
      name: 'Tax',
      url: '#',
      icon: <Calculator />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <img
            src={logoImg}
            width={40}
            height={40}
            className="rounded-lg"
            alt="Purple Ledger"
          />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold">Purple Ledger</p>
            <Badge variant="outline" className="w-fit">
              Beta
            </Badge>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavConfigurations projects={sidebarData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
