import { NavConfigurations } from '@/_app/components/nav-configurations';
import { NavMain } from '@/_app/components/nav-main';
import logoImg from '@/shared/assets/logo.svg';
import { Badge } from '@/shared/components/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/shared/components/sidebar';
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
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  footer?: ReactNode;
}

export function AppSidebar({ footer, ...props }: AppSidebarProps) {
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

  const purpleLedgerText = t('shared:purple_ledger');
  const betaText = t('shared:beta');

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <img
            src={logoImg}
            width={40}
            height={40}
            className="rounded-lg"
            alt={purpleLedgerText}
          />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold">{purpleLedgerText}</p>
            <Badge variant="outline" className="w-fit">
              {betaText}
            </Badge>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavConfigurations projects={sidebarData.projects} />
      </SidebarContent>
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
      <SidebarRail />
    </Sidebar>
  );
}
