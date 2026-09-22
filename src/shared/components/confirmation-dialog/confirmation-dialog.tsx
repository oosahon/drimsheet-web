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
import type { ButtonProps } from '@/shared/components/button';
import type { MouseEvent, PropsWithChildren, ReactNode } from 'react';

export interface ConfirmationDialogProps extends PropsWithChildren {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The caller closes the dialog after confirmation succeeds. */
  onConfirm: () => void;
  /** Called when the cancel button is selected, before onClose. */
  onCancel?: () => void;
  /** Called on user dismissal, including cancellation and Escape. */
  onClose?: () => void;
  title: string;
  trigger: ReactNode;
  cancelText: string;
  confirmationText: string;
  variant?: ButtonProps['variant'];
  loading?: boolean;
  media?: ReactNode;
  footer?: ReactNode;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  onClose,
  trigger,
  title,
  cancelText,
  confirmationText,
  variant = 'default',
  loading = false,
  children,
  media,
  footer,
}: Readonly<ConfirmationDialogProps>) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (loading) return;

    onOpenChange(nextOpen);

    if (!nextOpen) onClose?.();
  };

  const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!loading) onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          {media && <AlertDialogMedia>{media}</AlertDialogMedia>}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {footer ?? (
            <>
              <AlertDialogCancel
                disabled={loading}
                size="sm"
                onClick={onCancel}
              >
                {cancelText}
              </AlertDialogCancel>
              <AlertDialogAction
                variant={variant}
                size="sm"
                onClick={handleConfirm}
                loading={loading}
              >
                {confirmationText}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
