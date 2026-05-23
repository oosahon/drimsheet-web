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
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation(['shared']);

  const sidebarData = useMemo(
    () => ({
      navMain: [
        {
          title: t('shared:dashboard'),
          url: '#',
          icon: <LayoutDashboard />,
          isActive: true,
        },
        {
          title: t('shared:accounts'),
          url: '/accounts',
          icon: <Landmark />,
          items: [
            {
              title: t('shared:bank_accounts'),
              url: '/accounts/bank',
            },
            {
              title: t('shared:petty_cash_accounts'),
              url: '/accounts/petty-cash',
            },
          ],
        },
        {
          title: t('shared:income'),
          url: '#',
          icon: <TrendingUp />,
        },
        {
          title: t('shared:expenses'),
          url: '#',
          icon: <TrendingDown />,
        },
        {
          title: t('shared:liabilities'),
          url: '#',
          icon: <CircleMinus />,
        },
      ],
      projects: [
        {
          name: t('shared:third_parties'),
          url: '#',
          icon: <UsersRound />,
        },
        {
          name: t('shared:categories'),
          url: '#',
          icon: <Tags />,
        },
        {
          name: t('shared:tax'),
          url: '#',
          icon: <Calculator />,
        },
      ],
    }),
    [t]
  );

  const purple_ledger_text = t('shared:purple_ledger');
  const beta_text = t('shared:beta');

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <img
            src={logoImg}
            width={40}
            height={40}
            className="rounded-lg"
            alt={purple_ledger_text}
          />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold">{purple_ledger_text}</p>
            <Badge variant="outline" className="w-fit">
              {beta_text}
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
