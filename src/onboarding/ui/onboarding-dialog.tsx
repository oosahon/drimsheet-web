import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { AccountingEntityOnboardingForm } from "./accounting-entity-form";

export function OnboardingDialog() {
  return (
    <Dialog open modal>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Account Setup</DialogTitle>
          <DialogDescription className="text-sm">
            Choose the type of account you want to create.
          </DialogDescription>
        </DialogHeader>

        <AccountingEntityOnboardingForm onSubmit={(val) => console.log(val)} />
      </DialogContent>
    </Dialog>
  );
}
