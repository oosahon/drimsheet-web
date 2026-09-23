import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/sidebar';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface NavConfigurationsProps {
  items: {
    name: string;
    isActive?: boolean;
    url: string;
    icon: React.ReactNode;
  }[];
}

export function NavConfigurations({ items }: Readonly<NavConfigurationsProps>) {
  const { t } = useTranslation('shared');

  const configurations_text = t('configurations');

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="uppercase text-xs">
        {configurations_text}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild isActive={item.isActive}>
              <Link
                to={item.url}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
