import { useLogout } from '@/auth/hooks/use-logout';
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
} from '@/shared/components/alert-dialog';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { LogOutIcon } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface LogoutConfirmationDialogProps {
  children?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function LogoutConfirmationDialog({
  children,
  onOpenChange,
  open,
}: Readonly<LogoutConfirmationDialogProps>) {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');
  const handleApiError = useApiErrorHandler();
  const [internalOpen, setInternalOpen] = useState(false);
  const { mutateAsync: logout, isPending } = useLogout();

  const isOpen = open ?? internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      handleOpenChange(false);
      navigate('/auth/signin', { replace: true });
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  const are_you_sure_logout_text = t('are_you_sure_logout_text');
  const will_need_to_log_back_in_text = t('will_need_to_log_back_in_text');
  const cancel_text = t('cancel_text');
  const logging_out_text = t('logging_out_text');
  const log_out_text = t('log_out_text');

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <LogOutIcon className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>{are_you_sure_logout_text}</AlertDialogTitle>
          <AlertDialogDescription>
            {will_need_to_log_back_in_text}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending} size="sm">
            {cancel_text}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            variant="destructive"
            size="sm"
            disabled={isPending}
          >
            {isPending ? logging_out_text : log_out_text}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
