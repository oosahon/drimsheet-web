import { TransactionDetails } from '@/journal-entries/components/transaction-details';
import type { UTransactionDetails } from '@/journal-entries/lib/types/transaction-details';
import { Button } from '@/shared/components/button';
import { ConfirmationDialog } from '@/shared/components/confirmation-dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/sheet';
import { Archive, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TransactionDetailsDrawerProps {
  archiving?: boolean;
  onArchive?: () => Promise<void>;
  details?: UTransactionDetails;
  editDisabled?: boolean;
  onEdit: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function TransactionDetailsDrawer({
  archiving = false,
  onArchive,
  details,
  editDisabled = false,
  onEdit,
  onOpenChange,
  open,
}: Readonly<TransactionDetailsDrawerProps>) {
  const { t } = useTranslation('journal-entries');
  const [archiveConfirmationOpen, setArchiveConfirmationOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (archiving) return;
    if (!nextOpen) setArchiveConfirmationOpen(false);
    onOpenChange(nextOpen);
  };

  const handleArchiveConfirm = async () => {
    if (archiving || !onArchive) return;
    await onArchive();
    setArchiveConfirmationOpen(false);
  };

  if (!details) return null;

  const details_title = t('transaction_details_title');
  const details_description = t('transaction_details_description');
  const close_action = t('transaction_details_close_action');
  const archive_label = t('archive_entry_label');
  const archiving_text = t('archive_entry_loading_text');
  const delete_label = t('delete_entry_label');
  const edit_label = t('edit_entry_label');
  const archive_confirmation_title = t('archive_entry_confirmation_title');
  const archive_confirmation_description = t(
    'archive_entry_confirmation_description'
  );
  const archive_cancel_text = t('archive_entry_cancel_text');

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetContent className="gap-0 p-0 sm:max-w-md" showCloseButton={false}>
        <SheetHeader className="flex-row items-center justify-between border-b border-border px-5 py-4">
          <div>
            <SheetTitle>{details_title}</SheetTitle>
            <SheetDescription className="sr-only">
              {details_description}
            </SheetDescription>
          </div>
          <SheetClose asChild>
            <Button
              aria-label={close_action}
              disabled={archiving}
              size="icon-sm"
              title={close_action}
              type="button"
              variant="ghost"
            >
              <X />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
          <TransactionDetails details={details} />
        </div>

        <SheetFooter className="flex-row items-center justify-between border-t border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ConfirmationDialog
              open={archiveConfirmationOpen}
              onOpenChange={setArchiveConfirmationOpen}
              onConfirm={handleArchiveConfirm}
              title={archive_confirmation_title}
              description={archive_confirmation_description}
              cancelText={archive_cancel_text}
              confirmationText={archiving ? archiving_text : archive_label}
              loading={archiving}
              media={<Archive aria-hidden="true" />}
            >
              <Button
                disabled={!onArchive || archiving}
                type="button"
                variant="outline"
              >
                <Archive aria-hidden="true" data-icon="inline-start" />
                {archive_label}
              </Button>
            </ConfirmationDialog>

            <Button disabled={archiving} type="button" variant="destructive">
              {delete_label}
            </Button>
          </div>
          <Button
            disabled={editDisabled || archiving}
            onClick={onEdit}
            type="button"
          >
            {edit_label}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
