import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { AccountingEntityOnboardingForm } from "./accounting-entity-form";

export function OnboardingDialog() {
  return (
    <Dialog open modal={false}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Account Setup</DialogTitle>
          <DialogDescription className="text-sm">
            Choose the type of account you want to create.
          </DialogDescription>
        </DialogHeader>

        <AccountingEntityOnboardingForm onSubmit={(val) => console.log(val)} />
        <DialogFooter>
          <Button type="submit" form="accounting-entity-form">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
