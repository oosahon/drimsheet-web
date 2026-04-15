import useLogout from '@/auth/hooks/use-logout';
import { handleApiError } from '@/shared/utils/api/errors';
import { LogOutIcon } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';

interface LogoutConfirmationDialogProps {
  children?: ReactNode;
}

export function LogoutConfirmationDialog({
  children,
}: LogoutConfirmationDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { mutateAsync: logout, isPending } = useLogout();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      setOpen(false);
      navigate('/auth/login');
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <LogOutIcon className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to log back in to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? 'Logging out...' : 'Log out'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
