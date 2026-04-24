import { Badge } from '@/shared/ui/badge';
import { NavConfigurations } from '@/shared/ui/nav-configurations';
import { NavMain } from '@/shared/ui/nav-main';
import { NavUser } from '@/shared/ui/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/shared/ui/sidebar';
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

import logoImg from '@/shared/assets/logo.svg';

const data = {
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
        <NavMain items={data.navMain} />
        <NavConfigurations projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
