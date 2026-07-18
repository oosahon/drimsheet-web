import { AnimatedThemeToggler } from '@/shared/ui/components/animated-theme-toggler';
import { Avatar, AvatarFallback } from '@/shared/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/components/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/components/sidebar';
import { Skeleton } from '@/shared/ui/components/skeleton';
import type { IUser } from '@/shared/utils/api/Api';
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  SparklesIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

export type NavUserProfile = Pick<IUser, 'email' | 'firstName' | 'lastName'>;

export interface NavUserProps {
  user?: NavUserProfile;
  isLoading?: boolean;
  isMobile?: boolean;
  logoutDialog?: (trigger: ReactNode) => ReactNode;
}

export function NavUser({
  user,
  isLoading = false,
  isMobile = false,
  logoutDialog = (trigger) => trigger,
}: NavUserProps) {
  if (!user || isLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  const avatar = user.firstName.charAt(0) + user.lastName.charAt(0);
  const logoutTrigger = (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <LogOutIcon />
      Log out
    </DropdownMenuItem>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{avatar}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.firstName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.firstName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SparklesIcon />
                Drop a feedback
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <AnimatedThemeToggler
                  showText
                  className="w-full cursor-default justify-start"
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {logoutDialog(logoutTrigger)}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
