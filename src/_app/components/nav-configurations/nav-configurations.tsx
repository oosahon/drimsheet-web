import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/sidebar';
import { useTranslation } from 'react-i18next';

interface NavConfigurationsProps {
  items: {
    name: string;
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
            <SidebarMenuButton asChild>
              <a href={item.url}>
                {item.icon}
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
