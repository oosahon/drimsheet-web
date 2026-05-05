import { Button } from '@/shared/ui/components/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/shared/ui/components/input-group';
import { AppHeader, AppHeaderTitle } from '@/shared/ui/layouts/app-sidebar';
import { PlusIcon, SearchIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';

interface LedgerAccountPageLayoutProps extends PropsWithChildren {
  title: string;
  onAddClick: () => void;
}

export default function LedgerAccountPageLayout({
  title,
  onAddClick,
  children,
}: LedgerAccountPageLayoutProps) {
  return (
    <div className="flex w-full flex-col pt-0">
      <AppHeader className="sticky top-0 py-2 z-10 w-full bg-background pb-4">
        <div className="flex items-baseline gap-4">
          <AppHeaderTitle className="m-0 leading-none">{title}</AppHeaderTitle>
          <Button size="xs" onClick={onAddClick}>
            <PlusIcon /> Add
          </Button>
        </div>
        <InputGroup className="w-full md:ml-auto md:w-64">
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <SearchIcon />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="Search" />
        </InputGroup>
      </AppHeader>
      <div className="flex-1">{children}</div>
    </div>
  );
}
